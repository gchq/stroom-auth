/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.resources.authentication.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Strings;
import io.dropwizard.jersey.sessions.Session;
import org.apache.commons.lang3.NotImplementedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.TokenBuilderFactory;
import stroom.auth.resources.user.v1.User;
import stroom.auth.CertificateManager;
import stroom.auth.EmailSender;
import stroom.auth.config.Config;
import stroom.auth.exceptions.UnauthorisedException;
import stroom.auth.SessionManager;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.daos.TokenDao;
import stroom.auth.TokenVerifier;
import stroom.auth.daos.UserDao;

import javax.annotation.Nullable;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;
import java.util.regex.Pattern;

@Singleton
@Path("/authentication/v1")
@Produces(MediaType.APPLICATION_JSON)
public final class AuthenticationResource {
  private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationResource.class);

  private Config config;
  private final Pattern dnPattern;
  private TokenDao tokenDao;
  private UserDao userDao;
  private TokenVerifier tokenVerifier;
  private SessionManager sessionManager;
  private EmailSender emailSender;
  private CertificateManager certificateManager;
  private TokenBuilderFactory tokenBuilderFactory;

  @Inject
  public AuthenticationResource(
          @NotNull Config config,
          TokenDao tokenDao,
          UserDao userDao,
          TokenVerifier tokenVerifier,
          SessionManager sessionManager,
          EmailSender emailSender,
          CertificateManager certificateManager,
          TokenBuilderFactory tokenBuilderFactory) {
    this.config = config;
    this.dnPattern = Pattern.compile(config.getCertificateDnPattern());
    this.tokenDao = tokenDao;
    this.userDao = userDao;
    this.tokenVerifier = tokenVerifier;
    this.sessionManager = sessionManager;
    this.emailSender = emailSender;
    this.certificateManager = certificateManager;
    this.tokenBuilderFactory = tokenBuilderFactory;
  }

  @GET
  @Path("/")
  @Consumes({"application/json"})
  @Produces({"application/json"})
  @Timed
  @NotNull
  public final Response welcome() {
    return Response.status(Status.OK).entity("Welcome to the authentication service").build();
  }

  @Deprecated
  @GET
  @Path("/checkCertificate")
  @Timed
  @NotNull
  public final Response checkCertificate(@Context @NotNull HttpServletRequest httpServletRequest) throws URISyntaxException {
    String dn = httpServletRequest.getHeader("X-SSL-CLIENT-S-DN");
    String cn = certificateManager.getCn(dn);
    LOGGER.debug("Found CN in DN; logging user in.");
    // Get and return a token based on the CN
    String token = tokenDao.createToken(
            Token.TokenType.USER, "authenticationResource",
            cn, true, "Created for a certificate user.");
    return  Response.status(Status.OK).entity(token).build();
  }

  @Deprecated
  @GET
  @Path("/checkSession")
  @Timed
  @NotNull
  public final Response checkSession(
          @Session HttpSession session,
          @Context @NotNull HttpServletRequest httpServletRequest) throws URISyntaxException {
    boolean isAuthenticated = sessionManager.isAuthenticated(session.getId());
    LOGGER.debug("Checking session is authenticated: " + isAuthenticated);
    return Response.status(Status.OK).entity(isAuthenticated).build();
  }

  @GET
  @Path("/authenticate")
  @Timed
  public final Response handleAuthenticationRequest(
          @Session HttpSession httpSession,
          @Context @NotNull HttpServletRequest httpServletRequest,
          @QueryParam("scope") @Nullable String scope,
          @QueryParam("response_type") @Nullable String responseType,
          @QueryParam("client_id") @NotNull String clientId,
          @QueryParam("redirect_url") @NotNull String redirectUrl,
          @QueryParam("nonce") @NotNull String nonce,
          @QueryParam("state") @Nullable String state) throws URISyntaxException {
    if(!Strings.isNullOrEmpty(scope)
            || !Strings.isNullOrEmpty(responseType)
            || !Strings.isNullOrEmpty(state)){
      throw new NotImplementedException("You tried to use scope, code, or state, and these aren't yet supported");
    }

    stroom.auth.Session session = sessionManager.getOrCreate(httpSession.getId());

    Optional<String> optionalCn = certificateManager.getCertificate(httpServletRequest);
    if(optionalCn.isPresent()) {
      session.setAuthenticated(true);
      String accessCode = SessionManager.createAccessCode();
      session.setAccessCode(accessCode);
      String subject = optionalCn.get(); //TODO We might need to use a new user, or look one up.
      session.setNonce(nonce);
      session.setState(state);
      session.setClientId(clientId);
      String idToken = tokenBuilderFactory
              .newBuilder(Token.TokenType.USER)
              .subject(subject)
              .nonce(nonce)
              .state(state)
              .build();
      session.setIdToken(idToken);

      String successParams = String.format("?code=%s&state=%s", accessCode, state);
      String successUrl = redirectUrl + successParams;
      return Response.seeOther(new URI(successUrl)).build();
    }

    String failureParams = String.format("?error=login_required&state=%s&redirectUrl=%s", state, redirectUrl);
    String failureUrl = this.config.getLoginUrl() + failureParams;
    return Response.seeOther(new URI(failureUrl)).build();
  }

  /**
   * We expect the user to have a session if they're trying to log in.
   * If they don't then they need to be directed to an application that will submit
   * an AuthenticationRequest to /authenticate.
   */
  @POST
  @Path("/authenticate")
  @Consumes({"application/json"})
  @Produces({"application/json"})
  @Timed
  @NotNull
  public final Response handleLogin(
          @Session HttpSession httpSession,
          @Nullable Credentials credentials) throws URISyntaxException {
    Optional<stroom.auth.Session> optionalSession = sessionManager.get(httpSession.getId());
    if(!optionalSession.isPresent()){
      return Response
              .status(422)
              .entity("You have no session. Please make an AuthenticationRequest to the Authentication Service.")
              .build();
    }
    stroom.auth.Session session = optionalSession.get();

    boolean areCredentialsValid = userDao.areCredentialsValid(credentials);
    if(!areCredentialsValid) {
      LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
      userDao.incrementLoginFailures(credentials.getEmail());
      throw new UnauthorisedException("Invalid credentials");
    }

    session.setAuthenticated(true);

    String accessCode = SessionManager.createAccessCode();
    session.setAccessCode(accessCode);

    String idToken = tokenBuilderFactory
            .newBuilder(Token.TokenType.USER)
            .subject(credentials.getEmail())
            .nonce(session.getNonce())
            .state(session.getState())
            .build();
    session.setIdToken(idToken);

    LOGGER.debug("Login for {} succeeded", credentials.getEmail());
    userDao.resetUserLogin(credentials.getEmail());

    return Response.status(Status.OK).entity(accessCode).build();
  }

  @Deprecated
  @POST
  @Path("/login")
  @Consumes({"application/json"})
  @Produces({"application/json"})
  @Timed
  @NotNull
  public final Response authenticateAndReturnToken(@Nullable Credentials credentials) throws URISyntaxException {
    Response response;

    boolean areCredentialsValid = userDao.areCredentialsValid(credentials);
    if(!areCredentialsValid) {
      LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
      userDao.incrementLoginFailures(credentials.getEmail());
      throw new UnauthorisedException("Invalid credentials");
    }

    LOGGER.debug("Login for {} succeeded", credentials.getEmail());
    userDao.resetUserLogin(credentials.getEmail());
    String token = tokenDao.createToken(credentials.getEmail());
    return Response.status(Status.OK).entity(token).build();
  }

  @GET
  @Path("reset/{email}")
  @Timed
  @NotNull
  public final Response resetEmail(@PathParam("email") String emailAddress) {
    User user = userDao.get(emailAddress);
    String resetToken = tokenDao.createEmailResetToken(emailAddress);
    emailSender.send(user, resetToken);
    Response response = Response.status(Response.Status.OK).build();
    return response;
  }

  @GET
  @Path("/verify/{token}")
  @Timed
  @NotNull
  public final Response verifyToken(@PathParam("token") String token){
    Optional<String> usersEmail = tokenVerifier.verifyToken(token);
    if(usersEmail.isPresent()) {
      return Response.status(Status.OK).entity(usersEmail.get()).build();
    }
    else{
      return Response.status(Status.UNAUTHORIZED).build();
    }
  }
}
