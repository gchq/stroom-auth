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
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.jose4j.jwt.NumericDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.CertificateManager;
import stroom.auth.EmailSender;
import stroom.auth.RelyingParty;
import stroom.auth.SessionManager;
import stroom.auth.TokenBuilder;
import stroom.auth.TokenBuilderFactory;
import stroom.auth.TokenVerifier;
import stroom.auth.config.Config;
import stroom.auth.daos.TokenDao;
import stroom.auth.daos.UserDao;
import stroom.auth.exceptions.NoSuchUserException;
import stroom.auth.exceptions.UnauthorisedException;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.resources.user.v1.User;

import javax.annotation.Nullable;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
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
import javax.ws.rs.core.NewCookie;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

import static javax.ws.rs.core.Response.ResponseBuilder;
import static javax.ws.rs.core.Response.seeOther;
import static javax.ws.rs.core.Response.status;

@Singleton
@Path("/authentication/v1")
@Produces(MediaType.APPLICATION_JSON)
@Api(description = "Stroom Authentication API", tags = {"Authentication"})
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
    @ApiOperation(value = "A welcome message.", response = String.class, tags = {"Authentication"})
    public final Response welcome() {
        return status(Status.OK).entity("Welcome to the authentication service").build();
    }


    @GET
    @Path("/authenticate")
    @Timed
    @ApiOperation(value = "Submit an OpenId AuthenticationRequest.", response = String.class, tags = {"Authentication"})
    public final Response handleAuthenticationRequest(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @QueryParam("scope") @Nullable String scope,
            @QueryParam("response_type") @Nullable String responseType,
            @QueryParam("client_id") @NotNull String clientId,
            @QueryParam("redirect_url") @NotNull String redirectUrl,
            @QueryParam("nonce") @NotNull String nonce,
            @QueryParam("state") @Nullable String state
        ) throws URISyntaxException {
        boolean isAuthenticated = false;

        Optional<NewCookie> optionalNewSessionCookie = Optional.empty();
        String sessionId;
        // Try and get the sessionId from the cookie. If there isn't one then we'll
        // create a new sessionId and add it to a new cookie.
        Optional<String> optionalSessionId = Optional.empty();
        if (httpServletRequest.getCookies() != null) {
            optionalSessionId = Arrays.stream(httpServletRequest.getCookies())
                    .filter(cookie -> cookie.getName().equals("sessionId"))
                    .findFirst()
                    .map(Cookie::getValue);
        }

        if (!optionalSessionId.isPresent()) {
            sessionId = UUID.randomUUID().toString();
            NewCookie sessionIdCookie = new NewCookie("sessionId", sessionId);
//            NewCookie sessionIdCookie = new NewCookie(
//                    "sessionId",
//                    sessionId,
//                    "/",
//                    config.getAdvertisedHost(),
//                    "",
//                    "Stroom SSO Session cookie",
//                    604800, // 1 week
//                    false);
            optionalNewSessionCookie = Optional.of(sessionIdCookie);
        } else {
            sessionId = optionalSessionId.get();
        }
        LOGGER.info("Received an AuthenticationRequest for session " + sessionId);

        // We need to make sure our understanding of the session is correct
        Optional<stroom.auth.Session> optionalSession = sessionManager.get(sessionId);
        if (optionalSession.isPresent()) {
            // If we have an authenticated session then the user is logged in
            isAuthenticated = optionalSession.get().isAuthenticated();
        } else {
            // If we've not created a session then we need to create a new, unauthenticated one
            optionalSession = Optional.of(sessionManager.create(sessionId));
            optionalSession.get().setAuthenticated(false);
        }


        // We need to make sure we record this relying party against this session
        RelyingParty relyingParty = optionalSession.get().getOrCreateRelyingParty(clientId);
        relyingParty.setNonce(nonce);
        relyingParty.setState(state);


        // Now we can check if we're logged in somehow (session or certs) and build the response accordingly
        ResponseBuilder responseBuilder;
        Optional<String> optionalCn = certificateManager.getCertificate(httpServletRequest);
        // Check for an authenticated session
        if (isAuthenticated) {
            String accessCode = SessionManager.createAccessCode();
            relyingParty.setAccessCode(accessCode);
            String subject = optionalSession.get().getUserEmail();
            String idToken = createIdToken(subject, nonce, state);
            relyingParty.setIdToken(idToken);

            String successParams = String.format("?accessCode=%s&state=%s", accessCode, state);
            String successUrl = redirectUrl + successParams;
            responseBuilder = seeOther(new URI(successUrl));
        }
        // Check for a certificate
        else if (optionalCn.isPresent()) {
            optionalSession.get().setAuthenticated(true);
            String accessCode = SessionManager.createAccessCode();
            relyingParty.setAccessCode(accessCode);
            String subject = optionalCn.get(); //
            String idToken = createIdToken(subject, nonce, state);
            relyingParty.setIdToken(idToken);

            String successParams = String.format("?accessCode=%s&state=%s", accessCode, state);
            String successUrl = redirectUrl + successParams;
            responseBuilder = seeOther(new URI(successUrl));
        }
        // There's no session and there's no certificate so we'll send them to the login page
        else {
            String failureParams = String.format(
                    "?error=login_required&" +
                            "state=%s&" +
                            "clientId=%s&" +
                            "redirectUrl=%s",
                    state, clientId, redirectUrl);
            String failureUrl = this.config.getLoginUrl() + failureParams;
            responseBuilder = seeOther(new URI(failureUrl));
        }

        // TODO FMXME: This isn't getting stored in the browser
        // If we've created a new session cookie then we need to make sure it goes back to the user agent.
        optionalNewSessionCookie.ifPresent(responseBuilder::cookie);

        return responseBuilder.build();
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
    @ApiOperation(value = "Handle a login request made using username and password credentials.",
            response = String.class, tags = {"Authentication"})
    public final Response handleLogin(@Context @NotNull HttpServletRequest httpServletRequest,
              @ApiParam("Credentials") @NotNull Credentials credentials) throws URISyntaxException {
        LOGGER.info("Received a login request for session " + credentials.getSessionId());

        // Get the cookie with the sessionId and then get the session - the request is invalid without one.
        Optional<String> optionalSessionId = Optional.empty();
        if (httpServletRequest.getCookies() != null) {
            optionalSessionId = Arrays.stream(httpServletRequest.getCookies())
                    .filter(cookie -> cookie.getName().equals("sessionId"))
                    .findFirst()
                    .map(Cookie::getValue);
        }
        Response noSessionResponse = status(422)
                .entity("You have no session. Please make an AuthenticationRequest to the Authentication Service.")
                .build();
        if(!optionalSessionId.isPresent()){
            return noSessionResponse;
        }
        Optional<stroom.auth.Session> optionalSession = sessionManager.get(optionalSessionId.get());
        if (!optionalSession.isPresent()) {
            return noSessionResponse;
        }
        stroom.auth.Session session = optionalSession.get();

        // Check the credentials
        boolean areCredentialsValid = userDao.areCredentialsValid(credentials);
        if (!areCredentialsValid) {
            LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
            userDao.incrementLoginFailures(credentials.getEmail());
            throw new UnauthorisedException("Invalid credentials");
        }

        // Make sure the session is authenticated and ready for use
        session.setAuthenticated(true);
        session.setUserEmail(credentials.getEmail());

        //The relying party is the client making this request - now that we've authenticated for them we
        // can create the access code and id token.
        String accessCode = SessionManager.createAccessCode();
        RelyingParty relyingParty = session.getRelyingParty(credentials.getRequestingClientId());
        relyingParty.setAccessCode(accessCode);
        String idToken = createIdToken(credentials.getEmail(), relyingParty.getNonce(), relyingParty.getState());
        relyingParty.setIdToken(idToken);

        LOGGER.debug("Login for {} succeeded", credentials.getEmail());

        // Reset last access, login failures, etc...
        userDao.recordSuccessfulLogin(credentials.getEmail());

        return status(Status.OK).entity(accessCode).build();
    }

    @GET
    @Path("/logout")
    @Consumes({"application/json"})
    @Produces({"application/json"})
    @Timed
    @NotNull
    @ApiOperation(value = "Log a user out of their session")
    public final Response logout(@Context @NotNull HttpServletRequest httpServletRequest) throws URISyntaxException {
        // Get the cookie with the session - the request is invalid if there isn't one.
        if(httpServletRequest.getCookies() != null) {
            Optional<String> optionalSessionId = Arrays.stream(httpServletRequest.getCookies())
                    .filter(cookie -> cookie.getName().equals("sessionId"))
                    .findFirst()
                    .map(Cookie::getValue);
            if (optionalSessionId.isPresent()) {
                sessionManager.logout(optionalSessionId.get());
                LOGGER.info("Logged out session: {}", optionalSessionId.get());
            }
            else {
                LOGGER.debug("Tried to log out but there was no session cookie!");
            }
        }
        else {
            LOGGER.debug("Tried to log out but there were no cookies!");
        }
        // We'll always redirect back to our root
        return seeOther(new URI(this.config.getAdvertisedHost())).build();
    }

    /**
     * This is one of two idToken endpoints. One a GET and one a POST. The GET is used
     * by clients that send cookies, e.g. browsers and JavaScript.
     * The POST is for other clients, e.g. Swagger.
     */
    @GET
    @Path("idToken")
    @Timed
    @ApiOperation(value = "Convert a previously provided access code into an ID token",
            response = String.class, tags = {"Authentication"})
    public final Response getIdToken(@QueryParam("accessCode") @NotNull String accessCode) {
        Optional<RelyingParty> relyingParty = this.sessionManager.getByAccessCode(accessCode);
        if(!relyingParty.isPresent()){
            return Response.status(Status.UNAUTHORIZED).entity("Invalid access code").build();
        }
        String idToken = relyingParty.get().getIdToken();
        relyingParty.get().forgetIdToken();
        relyingParty.get().forgetAccessCode();
        return Response.status(Status.OK).entity(idToken).build();
    }

    @GET
    @Path("reset/{email}")
    @Timed
    @NotNull
    @ApiOperation(value = "Reset a user account using an email address.",
            response = String.class, tags = {"Authentication"})
    public final Response resetEmail(@PathParam("email") String emailAddress) throws NoSuchUserException {
        User user = userDao.get(emailAddress);
        String resetToken = tokenDao.createEmailResetToken(emailAddress);
        emailSender.send(user, resetToken);
        Response response = status(Status.OK).build();
        return response;
    }

    @GET
    @Path("/verify/{token}")
    @Timed
    @NotNull
    @ApiOperation(value = "Verify the authenticity and current-ness of a JWS token.",
            response = String.class, tags = {"Authentication"})
    public final Response verifyToken(@PathParam("token") String token) {
        Optional<String> usersEmail = tokenVerifier.verifyToken(token);
        return usersEmail
                .map(s -> status(Status.OK).entity(s).build())
                .orElseGet(() -> status(Status.UNAUTHORIZED).build());
    }

    private String createIdToken(String subject, String nonce, String state){
        TokenBuilder tokenBuilder = tokenBuilderFactory
                .newBuilder(Token.TokenType.USER)
                .subject(subject)
                .nonce(nonce)
                .state(state);
        NumericDate expiresOn = tokenBuilder.expiresOn();
        String idToken = tokenBuilder.build();

        tokenDao.createIdToken(idToken, subject, new Timestamp(expiresOn.getValueInMillis()));
        return idToken;
    }
}
