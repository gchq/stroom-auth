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
import io.dropwizard.jersey.sessions.Session;
import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
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

  @Inject
  public AuthenticationResource(
          @NotNull Config config,
          TokenDao tokenDao,
          UserDao userDao,
          TokenVerifier tokenVerifier,
          SessionManager sessionManager,
          EmailSender emailSender,
          CertificateManager certificateManager) {
    this.config = config;
    this.dnPattern = Pattern.compile(config.getCertificateDnPattern());
    this.tokenDao = tokenDao;
    this.userDao = userDao;
    this.tokenVerifier = tokenVerifier;
    this.sessionManager = sessionManager;
    this.emailSender = emailSender;
    this.certificateManager = certificateManager;
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

  @GET
  @Path("/checkCertificate")
  @Timed
  @NotNull
  public final Response checkCertificate(
          @Context @NotNull HttpServletRequest httpServletRequest,
          @Context @NotNull DSLContext database) throws URISyntaxException {
    String dn = httpServletRequest.getHeader("X-SSL-CLIENT-S-DN");
    String cn = certificateManager.getCn(dn);
    LOGGER.debug("Found CN in DN; logging user in.");
    // Get and return a token based on the CN
    String token = tokenDao.createToken(
            Token.TokenType.USER, "authenticationResource",
            cn, true, "Created for a certificate user.");
    return  Response.status(Status.OK).entity(token).build();
  }

  @GET
  @Path("/checkSession")
  @Timed
  @NotNull
  public final Response checkSession(
          @Session HttpSession session,
          @Context @NotNull HttpServletRequest httpServletRequest,
          @Context @NotNull DSLContext database) throws URISyntaxException {
    boolean isAuthenticated = sessionManager.isAuthenticated(session.getId());
    LOGGER.debug("Checking session is authenticated: " + isAuthenticated);
    return Response.status(Status.OK).entity(isAuthenticated).build();
  }


  @POST
  @Path("/login")
  @Consumes({"application/json"})
  @Produces({"application/json"})
  @Timed
  @NotNull
  public final Response authenticateAndReturnToken(
      @Context @NotNull DSLContext database, @Nullable Credentials credentials) throws URISyntaxException {
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
  public final Response resetEmail(@Context @NotNull DSLContext database, @PathParam("email") String emailAddress) {
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
  public final Response verifyToken(@Context @NotNull DSLContext database, @PathParam("token") String token){
    Optional<String> usersEmail = tokenVerifier.verifyToken(token);
    if(usersEmail.isPresent()) {
      return Response.status(Status.OK).entity(usersEmail.get()).build();
    }
    else{
      return Response.status(Status.UNAUTHORIZED).build();
    }
  }
}
