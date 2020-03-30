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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.AuthenticationSession;
import stroom.auth.CertificateManager;
import stroom.auth.EmailSender;
import stroom.auth.service.api.OIDC;
import stroom.auth.RelyingParty;
import stroom.auth.TokenBuilder;
import stroom.auth.TokenBuilderFactory;
import stroom.auth.TokenVerifier;
import stroom.auth.config.Config;
import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.daos.TokenDao;
import stroom.auth.daos.UserDao;
import stroom.auth.exceptions.NoSuchUserException;
import stroom.auth.resources.authentication.v1.ChangePasswordResponse.ChangePasswordResponseBuilder;
import stroom.auth.resources.token.v1.Token;
import stroom.auth.resources.user.v1.User;
import stroom.auth.service.eventlogging.StroomEventLoggingService;
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
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static javax.ws.rs.core.Response.ResponseBuilder;
import static javax.ws.rs.core.Response.seeOther;
import static javax.ws.rs.core.Response.status;
import static stroom.auth.resources.authentication.v1.PasswordValidator.validateAuthenticity;
import static stroom.auth.resources.authentication.v1.PasswordValidator.validateComplexity;
import static stroom.auth.resources.authentication.v1.PasswordValidator.validateLength;
import static stroom.auth.resources.authentication.v1.PasswordValidator.validateReuse;

@Singleton
@Path("/authentication/v1")
@Produces(MediaType.APPLICATION_JSON)
@Api(description = "Stroom Authentication API", tags = {"Authentication"})
public final class AuthenticationResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationResource.class);
    private static final String INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
    private static final String ACCOUNT_LOCKED_MESSAGE = "This account is locked. Please contact your administrator";
    private static final String ACCOUNT_DISABLED_MESSAGE = "This account is disabled. Please contact your administrator";
    private static final String ACCOUNT_INACTIVE_MESSAGE = "This account is marked as inactive. Please contact your administrator";

    private final Config config;
    private final Pattern dnPattern;
    private final TokenDao tokenDao;
    private final UserDao userDao;
    private final TokenVerifier tokenVerifier;
    private final EmailSender emailSender;
    private final CertificateManager certificateManager;
    private final TokenBuilderFactory tokenBuilderFactory;
    private final StroomEventLoggingService stroomEventLoggingService;

    @Inject
    AuthenticationResource(
            final @NotNull Config config,
            final TokenDao tokenDao,
            final UserDao userDao,
            final TokenVerifier tokenVerifier,
            final EmailSender emailSender,
            final CertificateManager certificateManager,
            final TokenBuilderFactory tokenBuilderFactory,
            final StroomEventLoggingService stroomEventLoggingService) {
        this.config = config;
        this.dnPattern = Pattern.compile(config.getCertificateDnPattern());
        this.tokenDao = tokenDao;
        this.userDao = userDao;
        this.tokenVerifier = tokenVerifier;
        this.emailSender = emailSender;
        this.certificateManager = certificateManager;
        this.tokenBuilderFactory = tokenBuilderFactory;
        this.stroomEventLoggingService = stroomEventLoggingService;
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
            @QueryParam(OIDC.SCOPE) @NotNull String scope,
            @QueryParam(OIDC.RESPONSE_TYPE) @NotNull String responseType,
            @QueryParam(OIDC.CLIENT_ID) @NotNull String clientId,
            @QueryParam(OIDC.REDIRECT_URI) @NotNull String redirectUri,
            @QueryParam(OIDC.NONCE) @Nullable String nonce,
            @QueryParam(OIDC.STATE) @Nullable String state,
            @QueryParam(OIDC.PROMPT) @Nullable String prompt) {
        boolean isAuthenticated = false;
        String sessionId = httpSession.getId();

        LOGGER.info("Received an AuthenticationRequest for session " + sessionId);

        // We need to make sure our understanding of the session is correct
        final AuthenticationSession authenticationSession = AuthenticationSessionUtil.create(httpServletRequest.getSession(true));
        isAuthenticated = authenticationSession.isAuthenticated();

//        Optional<AuthenticationSession> optionalSession = httpServletRequest.getSession(false);
//        if (optionalSession.isPresent()) {
//            // If we have an authenticated session then the user is logged in
//            isAuthenticated = optionalSession.get().isAuthenticated();
//        } else {
//            // If we've not created a session then we need to create a new, unauthenticated one
//            optionalSession = Optional.of(authenticationSessionUtil.create(sessionId));
//            optionalSession.get().setAuthenticated(false);
//        }

        // TODO: @66 Do something about checking nonce values to protect against replay attacks.

        // We need to make sure we record this relying party against this session
        final RelyingParty relyingParty = authenticationSession.getOrCreateRelyingParty(clientId);
        relyingParty.setNonce(nonce);
        relyingParty.setState(state);
        relyingParty.setRedirectUrl(redirectUri);


        // Now we can check if we're logged in somehow (session or certs) and build the response accordingly
        ResponseBuilder responseBuilder;
        Optional<String> optionalCn = certificateManager.getCertificate(httpServletRequest);

        // If the prompt is 'login' then we always want to prompt the user to login in with username and password.
        boolean requireLoginPrompt = !Strings.isNullOrEmpty(prompt) && prompt.equalsIgnoreCase("login");
        boolean loginUsingCertificate = optionalCn.isPresent() && !requireLoginPrompt;
        if (requireLoginPrompt) {
            LOGGER.info("Relying party requested a user login page by using 'prompt=login'");
        }

        // Check for an authenticated session
        if (isAuthenticated) {
            LOGGER.debug("User has a session, sending them to the RP");
            String accessCode = AuthenticationSessionUtil.createAccessCode();
            relyingParty.setAccessCode(accessCode);
            String subject = authenticationSession.getUserEmail();
            String idToken = createIdToken(subject, nonce, state, sessionId);
            relyingParty.setIdToken(idToken);
            responseBuilder = seeOther(buildRedirectionUrl(redirectUri, accessCode, state));
        }
        // Check for a certificate
        else if (loginUsingCertificate) {
            String cn = optionalCn.get();
            LOGGER.debug("User has presented a certificate: {}", cn);
            Optional<String> optionalSubject = getIdFromCertificate(cn);

            if (!optionalSubject.isPresent()) {
                String errorMessage = "User is presenting a certificate but this certificate cannot be processed!";
                LOGGER.error(errorMessage);
                responseBuilder = status(Status.FORBIDDEN).entity(errorMessage);
            } else {
                final String subject = optionalSubject.get();
                final Optional<User> optionalUser = userDao.get(subject);
                if (!optionalUser.isPresent()) {
                    LOGGER.debug("The user identified by the certificate does not exist in the auth database.");
                    // There's no user so we can't let them have access.
                    responseBuilder = seeOther(UriBuilder.fromUri(this.config.getUnauthorisedUrl()).build());
                } else {
                    final User user = optionalUser.get();
                    if (User.UserState.ENABLED.getStateText().equals(user.getState())) {
                        LOGGER.info("Logging user in using DN with subject {}", subject);
                        authenticationSession.setAuthenticated(true);
                        authenticationSession.setUserEmail(subject);
                        String accessCode = AuthenticationSessionUtil.createAccessCode();
                        relyingParty.setAccessCode(accessCode);
                        String idToken = createIdToken(subject, nonce, state, sessionId);
                        relyingParty.setIdToken(idToken);
                        responseBuilder = seeOther(buildRedirectionUrl(redirectUri, accessCode, state));
                        stroomEventLoggingService.successfulLogin(httpServletRequest, subject);
                        // Reset last access, login failures, etc...
                        userDao.recordSuccessfulLogin(subject);
                    } else {
                        LOGGER.debug("The user identified by the certificate is not enabled!");
                        stroomEventLoggingService.failedLoginBecause(httpServletRequest, subject, User.UserState.LOCKED.getStateText());
                        String failureUrl = this.config.getUnauthorisedUrl() + "?reason=account_locked";
                        responseBuilder = seeOther(UriBuilder.fromUri(failureUrl).build());
                    }
                }

            }
        }
        // There's no session and there's no certificate so we'll send them to the login page
        else {
            LOGGER.debug("User has no session and no certificate - sending them to login.");
            final UriBuilder uriBuilder = UriBuilder.fromUri(this.config.getLoginUrl())
                    .queryParam("error", "login_required")
                    .queryParam("state", state)
                    .queryParam("clientId", clientId)
                    .queryParam("redirectUrl", redirectUri);
            responseBuilder = seeOther(uriBuilder.build());
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
        String sessionId = httpSession.getId();
        LOGGER.info("Received a login request for session " + sessionId);

        final AuthenticationSession authenticationSession = AuthenticationSessionUtil.create(httpSession);

        // Check the credentials
        UserDao.LoginResult loginResult = userDao.areCredentialsValid(credentials.getEmail(), credentials.getPassword());
        switch (loginResult) {
            case BAD_CREDENTIALS:
                LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
                boolean shouldLock = userDao.incrementLoginFailures(credentials.getEmail());
                stroomEventLoggingService.failedLogin(httpServletRequest, credentials.getEmail());

                if (shouldLock) {
                    return status(Status.OK)
                            .entity(
                                    new LoginResponse(false, ACCOUNT_LOCKED_MESSAGE, null))
                            .build();
                } else {
                    return status(Status.OK)
                            .entity(new LoginResponse(false, INVALID_CREDENTIALS_MESSAGE, null)).build();
                }
            case GOOD_CREDENTIALS:
                String redirectionUrl = processSuccessfulLogin(authenticationSession, credentials, sessionId);
                stroomEventLoggingService.successfulLogin(httpServletRequest, credentials.getEmail());
                return status(Status.OK)
                        .entity(new LoginResponse(true, "", redirectionUrl))
                        .build();
            case USER_DOES_NOT_EXIST:
                // We don't want to let the user know the account they tried to log in with doesn't exist.
                // If we did we'd be revealing the presence or absence of an account or email address and
                // we don't want to do this.
                stroomEventLoggingService.failedLogin(httpServletRequest, credentials.getEmail());
                return status(Status.OK)
                        .entity(new LoginResponse(false, INVALID_CREDENTIALS_MESSAGE, null)).build();
            case LOCKED_BAD_CREDENTIALS:
                stroomEventLoggingService.failedLogin(httpServletRequest, credentials.getEmail());
                return status(Status.OK)
                        .entity(new LoginResponse(false, ACCOUNT_LOCKED_MESSAGE, null)).build();
            case LOCKED_GOOD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                stroomEventLoggingService.failedLoginBecause(httpServletRequest, credentials.getEmail(), User.UserState.LOCKED.getStateText());
                return status(Status.OK)
                        .entity(new LoginResponse(false, ACCOUNT_LOCKED_MESSAGE, null)).build();
            case DISABLED_BAD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                stroomEventLoggingService.failedLoginBecause(httpServletRequest, credentials.getEmail(), User.UserState.DISABLED.getStateText());
                return status(Status.OK)
                        .entity(new LoginResponse(false, INVALID_CREDENTIALS_MESSAGE, null)).build();
            case DISABLED_GOOD_CREDENTIALS:
                stroomEventLoggingService.failedLoginBecause(httpServletRequest, credentials.getEmail(), User.UserState.DISABLED.getStateText());
                return status(Status.OK)
                        .entity(new LoginResponse(false, ACCOUNT_DISABLED_MESSAGE, null)).build();
            case INACTIVE_BAD_CREDENTIALS:
                // If the credentials are bad we don't want to reveal the status of the account to the user.
                stroomEventLoggingService.failedLoginBecause(httpServletRequest, credentials.getEmail(), User.UserState.INACTIVE.getStateText());
                return status(Status.OK)
                        .entity(new LoginResponse(false, INVALID_CREDENTIALS_MESSAGE, null)).build();
            case INACTIVE_GOOD_CREDENTIALS:
                stroomEventLoggingService.failedLoginBecause(httpServletRequest, credentials.getEmail(), User.UserState.INACTIVE.getStateText());
                return status(Status.OK)
                        .entity(new LoginResponse(false, ACCOUNT_INACTIVE_MESSAGE, null)).build();
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
            @QueryParam("redirect_uri") @Nullable String redirectUri) throws URISyntaxException {
        String sessionId = httpSession.getId();

        AuthenticationSession authenticationSession = AuthenticationSessionUtil.create(httpSession);
            stroomEventLoggingService.logout(httpServletRequest, authenticationSession.getUserEmail());

            httpSession.invalidate();

        // If we have a redirect URL then we'll use that, otherwise we'll go to the advertised host.
        final String postLogoutUrl =
                Strings.isNullOrEmpty(redirectUri) ? this.config.getAdvertisedHost() : redirectUri;

        return seeOther(new URI(postLogoutUrl)).build();
    }

    @POST
    @Path("idToken")
    @Timed
    @ApiOperation(value = "Convert a previously provided access code into an ID token",
            response = String.class, tags = {"Authentication"})
    public final Response getIdToken(
            @Session HttpSession httpSession,
            @ApiParam("IdTokenRequest") @NotNull IdTokenRequest idTokenRequest,
                                     @Context @NotNull HttpServletRequest httpServletRequest) {
        AuthenticationSession authenticationSession = AuthenticationSessionUtil.create(httpSession);

        RelyingParty relyingParty = authenticationSession.getRelyingParty(idTokenRequest.getClientId());
        if (idTokenRequest.getAccessCode() == null || !idTokenRequest.getAccessCode().equals(relyingParty.getAccessCode())) {
            return Response.status(Status.UNAUTHORIZED).entity("Invalid access code").build();
        }

        // See the comments in StroomConfig.
        if (config.getStroomConfig().getClientId().equals(idTokenRequest.getClientId())
                && config.getStroomConfig().getClientSecret().equals(idTokenRequest.getClientSecret())) {
            String idToken = relyingParty.getIdToken();
            relyingParty.forgetIdToken();
            relyingParty.forgetAccessCode();
            return Response.status(Status.OK).entity(idToken).build();
        } else {
            return Response.status(Status.UNAUTHORIZED).entity("Invalid client or access code").build();
        }
    }

    @GET
    @Path("reset/{email}")
    @Timed
    @NotNull
    @ApiOperation(value = "Reset a user account using an email address.",
            response = String.class, tags = {"Authentication"})
    public final Response resetEmail(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @PathParam("email") String emailAddress) throws NoSuchUserException {
        stroomEventLoggingService.resetPassword(httpServletRequest, emailAddress);
        Optional<User> user = userDao.get(emailAddress);
        if (user.isPresent()) {
            String resetToken = tokenDao.createEmailResetToken(emailAddress, config.getStroomConfig().getClientId());
            emailSender.send(user.get(), resetToken);
            Response response = status(Status.NO_CONTENT).build();
            return response;
        } else {
            return status(Status.NOT_FOUND).entity("User does not exist").build();
        }
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
            @Context @NotNull HttpServletRequest httpServletRequest,
            @ApiParam("changePasswordRequest") @NotNull ChangePasswordRequest changePasswordRequest,
            //TODO: Delete this parameter
            @PathParam("id") int userId) {

        List<PasswordValidationFailureType> failedOn = new ArrayList<>();
        final UserDao.LoginResult loginResult = userDao.areCredentialsValid(changePasswordRequest.getEmail(), changePasswordRequest.getOldPassword());
        validateAuthenticity(loginResult).ifPresent(failedOn::add);
        validateReuse(changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword()).ifPresent(failedOn::add);
        validateLength(changePasswordRequest.getNewPassword(), config.getPasswordIntegrityChecksConfig().getMinimumPasswordLength()).ifPresent(failedOn::add);
        validateComplexity(changePasswordRequest.getNewPassword(), config.getPasswordIntegrityChecksConfig().getPasswordComplexityRegex()).ifPresent(failedOn::add);

        final ChangePasswordResponseBuilder responseBuilder = ChangePasswordResponseBuilder.aChangePasswordResponse();
        if (failedOn.size() == 0) {
            responseBuilder.withSuccess();
            stroomEventLoggingService.changePassword(httpServletRequest, changePasswordRequest.getEmail());
            userDao.changePassword(changePasswordRequest.getEmail(), changePasswordRequest.getNewPassword());
        } else {
            responseBuilder.withFailedOn(failedOn);
        }

        return Response.status(Status.OK).entity(responseBuilder.build()).build();
    }

    @POST
    @Path("resetPassword")
    @Timed
    @NotNull
    @ApiOperation(value = "Reset an authenticated user's password.",
            response = String.class, tags = {"Authentication"})
    public final Response resetPassword(
            @Auth @NotNull ServiceUser user,
            @Context @NotNull HttpServletRequest httpServletRequest,
            @ApiParam("changePasswordRequest") @NotNull ResetPasswordRequest req) {
        List<PasswordValidationFailureType> failedOn = new ArrayList<>();
        PasswordIntegrityChecksConfig conf = config.getPasswordIntegrityChecksConfig();

        validateLength(req.getNewPassword(), conf.getMinimumPasswordLength()).ifPresent(failedOn::add);
        validateComplexity(req.getNewPassword(), conf.getPasswordComplexityRegex()).ifPresent(failedOn::add);

        final ChangePasswordResponseBuilder responseBuilder = ChangePasswordResponseBuilder.aChangePasswordResponse();

        if (responseBuilder.failedOn.size() == 0) {
            responseBuilder.withSuccess();
            stroomEventLoggingService.changePassword(httpServletRequest, user.getName());
            userDao.changePassword(user.getName(), req.getNewPassword());
        }

        return Response.status(Status.OK).entity(responseBuilder.build()).build();
    }

    @GET
    @Path("needsPasswordChange")
    @Timed
    @NotNull
    @ApiOperation(value = "Check if a user's password needs changing.",
            response = Boolean.class, tags = {"Authentication"})
    public final Response needsPasswordChange(@QueryParam("email") String email) {
        boolean userNeedsToChangePassword = userDao.needsPasswordChange(
                email, config.getPasswordIntegrityChecksConfig().getMandatoryPasswordChangeDuration(),
                config.getPasswordIntegrityChecksConfig().isForcePasswordChangeOnFirstLogin());
        return Response.status(Status.OK).entity(userNeedsToChangePassword).build();
    }

    @POST
    @Path("isPasswordValid")
    @Timed
    @NotNull
    @ApiOperation(value = "Returns the length and complexity rules.",
            response = Boolean.class, tags = {"Authentication"})
    public final Response isPasswordValid(
            @Context @NotNull HttpServletRequest httpServletRequest,
            @ApiParam("passwordValidationRequest") @NotNull PasswordValidationRequest passwordValidationRequest) {

        List<PasswordValidationFailureType> failedOn = new ArrayList<>();

        if (!Strings.isNullOrEmpty(passwordValidationRequest.getOldPassword())) {
            final UserDao.LoginResult loginResult = userDao.areCredentialsValid(passwordValidationRequest.getEmail(), passwordValidationRequest.getOldPassword());
            validateAuthenticity(loginResult).ifPresent(failedOn::add);
            validateReuse(passwordValidationRequest.getOldPassword(), passwordValidationRequest.getNewPassword()).ifPresent(failedOn::add);
        }

        validateLength(passwordValidationRequest.getNewPassword(), config.getPasswordIntegrityChecksConfig().getMinimumPasswordLength()).ifPresent(failedOn::add);
        validateComplexity(passwordValidationRequest.getNewPassword(), config.getPasswordIntegrityChecksConfig().getPasswordComplexityRegex()).ifPresent(failedOn::add);


        PasswordValidationResponse response = PasswordValidationResponse.PasswordValidationResponseBuilder
                .aPasswordValidationResponse()
                .withFailedOn(failedOn.toArray(new PasswordValidationFailureType[0]))
                .build();

        return Response.status(Status.OK).entity(response).build();
    }

    /**
     * Checks to see if the user needs to change their password, and re-directs them accordingly if they do.
     * If they don't it will create the redirection URL with access code as normal.
     */
    @GET
    @Path("postAuthenticationRedirect")
    @Produces({"application/json"})
    @Timed
    @NotNull
    public final Response postAuthenticationRedirect(
            @Session HttpSession httpSession,
            @QueryParam("clientId") @NotNull String clientId) throws UnsupportedEncodingException {
        AuthenticationSession session = AuthenticationSessionUtil.create(httpSession);
        RelyingParty relyingParty = session.getRelyingParty(clientId);

        String username = session.getUserEmail();

        boolean userNeedsToChangePassword = userDao.needsPasswordChange(
                username, config.getPasswordIntegrityChecksConfig().getMandatoryPasswordChangeDuration(),
                config.getPasswordIntegrityChecksConfig().isForcePasswordChangeOnFirstLogin());

        if (userNeedsToChangePassword) {
            final String redirectUrl = getPostAuthenticationCheckUrl(clientId);
            final URI changePasswordUri = UriBuilder.fromUri(this.config.getChangePasswordUrl())
                    .queryParam("redirect_uri", redirectUrl)
                    .build();
            return seeOther(changePasswordUri).build();
        } else {
            //TODO this method needs to take just a relying party
            session.setAuthenticated(true);
            URI redirectionUrl = buildRedirectionUrl(relyingParty.getRedirectUrl(), relyingParty.getAccessCode(), relyingParty.getState());
            return seeOther(redirectionUrl).build();
        }
    }

    private String createIdToken(String subject, String nonce, String state, String authSessionId) {
        TokenBuilder tokenBuilder = tokenBuilderFactory
                .newBuilder(Token.TokenType.USER)
                .clientId(config.getStroomConfig().getClientId())
                .subject(subject)
                .nonce(nonce)
                .state(state)
                .authSessionId(authSessionId);
        Instant expiresOn = tokenBuilder.getExpiryDate();
        String idToken = tokenBuilder.build();

        tokenDao.createIdToken(idToken, subject, new Timestamp(expiresOn.toEpochMilli()));
        return idToken;
    }

    private URI buildRedirectionUrl(String redirectUrl, String accessCode, String state) {
        return UriBuilder
                .fromUri(redirectUrl)
                .replaceQueryParam("code", accessCode)
                .replaceQueryParam("state", state)
                .build();
    }

    private Optional<String> getIdFromCertificate(final String cn) {
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
        } catch (IllegalStateException ex) {
            LOGGER.error("Unable to extract user ID from CN. CN was {} and pattern was {}", cn,
                    this.config.getCertificateDnPattern());
            return Optional.empty();
        }
    }

    private String processSuccessfulLogin(final AuthenticationSession session,
                                          final Credentials credentials,
                                          final String sessionId) {
        // Make sure the session is authenticated and ready for use
        session.setAuthenticated(false);
        session.setUserEmail(credentials.getEmail());

        //The relying party is the client making this request - now that we've authenticated for them we
        // can create the access code and id token.
        String accessCode = AuthenticationSessionUtil.createAccessCode();
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

    private String getPostAuthenticationCheckUrl(String clientId) {
        String postAuthenticationCheckUrl = String.format("%s/%s/v1/postAuthenticationRedirect?clientId=%s",
                this.config.getAdvertisedHost(), config.getOwnPath(), clientId);
        return postAuthenticationCheckUrl;
    }

}
