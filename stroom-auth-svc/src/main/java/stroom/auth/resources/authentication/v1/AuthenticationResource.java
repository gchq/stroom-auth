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
import io.dropwizard.auth.Auth;
import io.dropwizard.jersey.sessions.Session;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.lang3.NotImplementedException;
import org.apache.curator.shaded.com.google.common.base.Strings;
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
import stroom.auth.service.security.ServiceUser;

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
import javax.ws.rs.core.UriBuilder;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.util.Base64;
import java.util.Optional;
import java.util.regex.Matcher;
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
            @Session HttpSession httpSession,
            @Context @NotNull HttpServletRequest httpServletRequest,
            @QueryParam("scope") @NotNull String scope,
            @QueryParam("response_type") @NotNull String responseType,
            @QueryParam("client_id") @NotNull String clientId,
            @QueryParam("redirect_url") @NotNull String redirectUrl,
            @QueryParam("nonce") @Nullable String nonce,
            @QueryParam("state") @Nullable String state,
            @QueryParam("prompt") @Nullable String prompt) throws URISyntaxException {
        boolean isAuthenticated = false;
        String sessionId = httpSession.getId();

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
        relyingParty.setRedirectUrl(redirectUrl);


        // Now we can check if we're logged in somehow (session or certs) and build the response accordingly
        ResponseBuilder responseBuilder;
        Optional<String> optionalCn = certificateManager.getCertificate(httpServletRequest);

        // If the prompt is 'login' then we always want to prompt the user to login in with username and password.
        boolean requireLoginPrompt = !Strings.isNullOrEmpty(prompt) && prompt.equalsIgnoreCase("login");
        boolean loginUsingCertificate = optionalCn.isPresent() && !requireLoginPrompt;
        if(requireLoginPrompt){
            LOGGER.info("Relying party requested a user login page by using 'prompt=login'");
        }

        // Check for an authenticated session
        if (isAuthenticated) {
            String accessCode = SessionManager.createAccessCode();
            relyingParty.setAccessCode(accessCode);
            String subject = optionalSession.get().getUserEmail();
            String idToken = createIdToken(subject, nonce, state, sessionId);
            relyingParty.setIdToken(idToken);
            responseBuilder = seeOther(buildRedirectionUrl(redirectUrl, accessCode, state));
        }
        // Check for a certificate
        else if (loginUsingCertificate) {
            String cn = optionalCn.get();
            Optional<String> optionalSubject = getIdFromCertificate(cn);

            if(!optionalSubject.isPresent()){
                String errorMessage = "User is presenting a certificate but this certificate cannot be processed!";
                LOGGER.error(errorMessage);
                responseBuilder = status(Status.FORBIDDEN).entity(errorMessage);
            } else {
                String subject = optionalSubject.get();
                if(!userDao.exists(subject)){
                    User newUser = new User();
                    newUser.setEmail(subject);
                    newUser.setState("enabled");
                    newUser.setComments("Automatically created because the user has a valid certificate.");

                    // TODO: Password is currently mandatory so we need to set something. However this user might
                    // not be logging in because they have a certificate. Should we give them a password and let them
                    // log in, or should we add a field to make impossible for this user to log in at all? Or we could
                    // set the password as a UUID and forget it. It'd be hashed and then gone forever.
                    byte[] bytes = new byte[20];
                    new SecureRandom().nextBytes(bytes);
                    String secureRandomPassword = Base64.getUrlEncoder().encodeToString(bytes);
                    newUser.setPassword(secureRandomPassword);

                    userDao.create(newUser, "admin");
                    LOGGER.info("I've not see this certificate user ID before so I've created a new user account for them.");
                }

                LOGGER.info("Logging user in using DN with subject {}", subject);
                optionalSession.get().setAuthenticated(true);
                optionalSession.get().setUserEmail(subject);
                String accessCode = SessionManager.createAccessCode();
                relyingParty.setAccessCode(accessCode);
                String idToken = createIdToken(subject, nonce, state, sessionId);
                relyingParty.setIdToken(idToken);
                responseBuilder = seeOther(buildRedirectionUrl(redirectUrl, accessCode, state));
            }
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
    public final Response handleLogin(
            @Session HttpSession httpSession,
            @Context @NotNull HttpServletRequest httpServletRequest,
            @ApiParam("Credentials") @NotNull Credentials credentials) throws URISyntaxException, UnsupportedEncodingException {
        LOGGER.info("Received a login request for session " + credentials.getSessionId());
        String sessionId = httpSession.getId();
        if(!Strings.isNullOrEmpty(credentials.getSessionId())) {
            LOGGER.debug("There is a session ID in the request body so we'll use that instead of the one in the httpSession.");
            sessionId = credentials.getSessionId();
        }

        Response noSessionResponse = status(422)
                .entity("You have no session. Please make an AuthenticationRequest to the Authentication Service.")
                .build();

        Optional<stroom.auth.Session> optionalSession = sessionManager.get(sessionId);
        if (!optionalSession.isPresent()) {
            return noSessionResponse;
        }
        stroom.auth.Session session = optionalSession.get();

        // Check the credentials
        UserDao.LoginResult loginResult = userDao.areCredentialsValid(credentials.getEmail(), credentials.getPassword());
        switch (loginResult){
            case BAD_CREDENTIALS:
                LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
                userDao.incrementLoginFailures(credentials.getEmail());
                throw new UnauthorisedException("Invalid credentials");
            case GOOD_CREDENTIALS:
                String redirectionUrl = processSuccessfulLogin(session, credentials, sessionId);
                return status(Status.OK)
                    .entity(redirectionUrl)
                    .build();
            case USER_DOES_NOT_EXIST:
                // We don't want to let the user know the account they tried to log in with doesn't exist.
                // If we did we'd be revealing the presence or absence of an account or email address and
                // we don't want to do this.
                throw new UnauthorisedException("Invalid credentials");
            case LOCKED_BAD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                throw new UnauthorisedException("Invalid credentials");
            case LOCKED_GOOD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                throw new UnauthorisedException("This account is locked. Please contact your administrator.");
            case DISABLED_BAD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                throw new UnauthorisedException("Invalid credentials");
            case DISABLED_GOOD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                throw new UnauthorisedException("This account is disabled. Please contact your administrator.");
            default:
                String errorMessage = String.format("%s does not support a LoginResult of %s",
                    this.getClass().getSimpleName(), loginResult.toString());
                throw new NotImplementedException(errorMessage);
        }
    }

    @GET
    @Path("/logout")
    @Consumes({"application/json"})
    @Produces({"application/json"})
    @Timed
    @NotNull
    @ApiOperation(value = "Log a user out of their session")
    public final Response logout(
            @Session HttpSession httpSession,
            @Context @NotNull HttpServletRequest httpServletRequest,
            @QueryParam("redirect_url") @Nullable String redirectUrl) throws URISyntaxException {
        String sessionId = httpSession.getId();
        sessionManager.logout(sessionId);

        // If we have a redirect URL then we'll use that, otherwise we'll go to the advertised host.
        final String postLogoutUrl =
                Strings.isNullOrEmpty(redirectUrl) ? this.config.getAdvertisedHost() : redirectUrl;

        return seeOther(new URI(postLogoutUrl)).build();
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


    @POST
    @Path("changePassword")
    @Timed
    @NotNull
    @ApiOperation(value = "Change a user's password.",
            response = String.class, tags = {"Authentication"})
    public final Response changePassword(
            @ApiParam("changePasswordRequest") @NotNull ChangePasswordRequest changePasswordRequest,
            @PathParam("id") int userId) {
        UserDao.LoginResult loginResult = userDao.areCredentialsValid(changePasswordRequest.getEmail(), changePasswordRequest.getOldPassword());
        if(loginResult == UserDao.LoginResult.BAD_CREDENTIALS
            || loginResult == UserDao.LoginResult.DISABLED_BAD_CREDENTIALS
            || loginResult == UserDao.LoginResult.LOCKED_BAD_CREDENTIALS){
            String message = "The old password is not correct! " +
                "To change your password you need to enter your old password correctly.";
            return Response.status(Status.UNAUTHORIZED).entity(message).build();
        }
        else {
            userDao.changePassword(changePasswordRequest.getEmail(), changePasswordRequest.getNewPassword());
            return Response.status(Status.OK).entity("Your password has been changed.").build();
        }
    }

    @GET
    @Path("needsPasswordChange")
    @Timed
    @NotNull
    @ApiOperation(value = "Check if a user's password needs changing.",
            response = Boolean.class, tags = {"Authentication"})
    public final Response needsPasswordChange(@QueryParam("email") String email) {
        boolean userNeedsToChangePassword = userDao.needsPasswordChange(
                email, config.getPasswordIntegrityChecksConfig().getRequirePasswordChangeAfterXDays());
        return Response.status(Status.OK).entity(userNeedsToChangePassword).build();
    }

    @GET
    @Path("postAuthenticationRedirect")
    @Produces({"application/json"})
    @Timed
    @NotNull
    public final Response postAuthenticationRedirect(
        @Session HttpSession httpSession,
        @QueryParam("clientId") @NotNull String clientId) throws UnsupportedEncodingException {

        stroom.auth.Session session = this.sessionManager.get(httpSession.getId()).get();
        RelyingParty relyingParty = session.getRelyingParty(clientId);

        String username = session.getUserEmail();

        boolean userNeedsToChangePassword = userDao.needsPasswordChange(
            username, config.getPasswordIntegrityChecksConfig().getRequirePasswordChangeAfterXDays());

        if(userNeedsToChangePassword){
            String redirectUrl = getPostAuthenticationCheckUrl(clientId);
            String encodedRedirectUrl = URLEncoder.encode(redirectUrl, Charset.defaultCharset().name());
            String changePasswordLocation = String.format("%s?&redirect_url=%s",
                this.config.getChangePasswordUrl(), encodedRedirectUrl);
            URI changePasswordUri = UriBuilder.fromUri(changePasswordLocation).build();
            return seeOther(changePasswordUri).build();
        }
        else {
            //TODO this method needs to take just a relying party
            URI redirectionUrl = buildRedirectionUrl(relyingParty.getRedirectUrl(), relyingParty.getAccessCode(), relyingParty.getState());
            return seeOther(redirectionUrl).build();
        }
    }

    private String createIdToken(String subject, String nonce, String state, String authSessionId){
        TokenBuilder tokenBuilder = tokenBuilderFactory
                .newBuilder(Token.TokenType.USER)
                .subject(subject)
                .nonce(nonce)
                .state(state)
                .authSessionId(authSessionId);
        NumericDate expiresOn = tokenBuilder.expiresOn();
        String idToken = tokenBuilder.build();

        tokenDao.createIdToken(idToken, subject, new Timestamp(expiresOn.getValueInMillis()));
        return idToken;
    }

    private URI buildRedirectionUrl(String redirectUrl, String accessCode, String state){
        URI fullRedirectionUrl = UriBuilder
                .fromUri(redirectUrl)
                .queryParam("accessCode", accessCode)
                .queryParam("state", state)
                .build();
        return fullRedirectionUrl;
    }


    private Optional<String> getIdFromCertificate(String cn) {
        Pattern idExtractionPattern = Pattern.compile(this.config.getCertificateDnPattern());
        Matcher idExtractionMatcher = idExtractionPattern.matcher(cn);
        idExtractionMatcher.find();
        int captureGroupIndex = this.config.getCertificateDnCaptureGroupIndex();
        try {
            if (idExtractionMatcher.groupCount() >= captureGroupIndex) {
                String id = idExtractionMatcher.group(captureGroupIndex);
                return Optional.of(id);
            } else {
                return Optional.empty();
            }
        } catch(IllegalStateException ex) {
            LOGGER.error("Unable to extract user ID from CN. CN was {} and pattern was {}", cn,
                    this.config.getCertificateDnPattern());
            return Optional.empty();
        }
    }

    private String processSuccessfulLogin(stroom.auth.Session session, Credentials credentials, String sessionId) throws UnsupportedEncodingException {
        // Make sure the session is authenticated and ready for use
        session.setAuthenticated(false);
        session.setUserEmail(credentials.getEmail());

        //The relying party is the client making this request - now that we've authenticated for them we
        // can create the access code and id token.
        String accessCode = SessionManager.createAccessCode();
        RelyingParty relyingParty = session.getRelyingParty(credentials.getRequestingClientId());
        relyingParty.setAccessCode(accessCode);
        String idToken = createIdToken(credentials.getEmail(), relyingParty.getNonce(), relyingParty.getState(), sessionId);
        relyingParty.setIdToken(idToken);

        LOGGER.debug("Login for {} succeeded", credentials.getEmail());

        // Reset last access, login failures, etc...
        userDao.recordSuccessfulLogin(credentials.getEmail());

        String redirectionUrl = getPostAuthenticationCheckUrl(credentials.getRequestingClientId());
        return redirectionUrl;
    }

    private String getPostAuthenticationCheckUrl(String clientId){
        String postAuthenticationCheckUrl = String.format("%s/authentication/v1/postAuthenticationRedirect?clientId=%s",
            this.config.getAdvertisedHost(), clientId);
        return postAuthenticationCheckUrl;
    }

}
