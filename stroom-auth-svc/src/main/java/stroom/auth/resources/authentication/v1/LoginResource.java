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
import io.dropwizard.auth.AuthenticationException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.MalformedClaimException;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.api.OIDC;
import stroom.auth.config.Config;
import stroom.auth.config.OpenIdConfig;
import stroom.auth.daos.UserDao;
import stroom.auth.resources.user.v1.User;
import stroom.security.impl.AuthenticationState;
import stroom.security.impl.AuthenticationStateSessionUtil;
import stroom.security.impl.JWTService;
import stroom.security.impl.JerseyClientFactory;
import stroom.security.impl.UserAgentSessionUtil;
import stroom.security.impl.UserIdentity;
import stroom.security.impl.UserIdentityImpl;
import stroom.security.impl.session.UserIdentitySessionUtil;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.ServerErrorException;
import javax.ws.rs.client.Entity;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static javax.ws.rs.core.Response.ResponseBuilder;
import static javax.ws.rs.core.Response.seeOther;

@Singleton
@Path("/login/v1")
@Produces(MediaType.APPLICATION_JSON)
@Api(description = "Stroom Login API", tags = {"Login"})
public final class LoginResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginResource.class);

    private final OpenIdConfig openIdConfig;
    private final UserDao userDao;
    private final JerseyClientFactory jerseyClientFactory;
    private final JWTService jwtService;

    @Inject
    LoginResource(
            final @NotNull Config config,
            final UserDao userDao,
            final JerseyClientFactory jerseyClientFactory,
            final JWTService jwtService) {
        this.userDao = userDao;
        this.jerseyClientFactory = jerseyClientFactory;
        this.jwtService = jwtService;

        openIdConfig = config.getOpenIdConfig();
    }

    @GET
    @Path("/login")
    @Timed
    @ApiOperation(value = "Check if the current session is authenticated, else start an auth flow", response = String.class, tags = {"Login"})
    public final Response login(@Context @NotNull HttpServletRequest request,
                                @QueryParam(OIDC.REDIRECT_URI) @NotNull String redirectUri,
                                @QueryParam(OIDC.PROMPT) String prompt) {
        ResponseBuilder responseBuilder;

        final UserIdentity userIdentity = UserIdentitySessionUtil.get(request.getSession(false));
        if (userIdentity != null) {
            // TODO : @66 Check how long we have got left until token expiry and do a refresh if needed.

            final UriBuilder uriBuilder = UriBuilder.fromUri(redirectUri);
            responseBuilder = seeOther(uriBuilder.build());
        } else {
            LOGGER.debug("User has no session so authenticate them.");
            responseBuilder = seeOther(redirectToAuthService(request, openIdConfig, redirectUri, prompt));
        }

        return responseBuilder.build();
    }

    private URI redirectToAuthService(final HttpServletRequest request, final OpenIdConfig openIdConfig, final String sourceUrl, final String prompt) {
        // We have a a new request so we're going to redirect with an AuthenticationRequest.
        // Get the redirect URL for the auth service from the current request.
        final UriBuilder uriBuilder = UriBuilder.fromUri(sourceUrl);

        // When the auth service has performed authentication it will redirect back to the current URL with some
        // additional parameters (e.g. `state` and `accessCode`). It is important that these parameters are not
        // provided by our redirect URL else the redirect URL that the authentication service redirects back to may
        // end up with multiple copies of these parameters which will confuse Stroom as it will not know which one
        // of the param values to use (i.e. which were on the original redirect request and which have been added by
        // the authentication service). For this reason we will cleanse the URL of any reserved parameters here. The
        // authentication service should do the same to the redirect URL before adding its additional parameters.
        OIDC.RESERVED_PARAMS.forEach(param -> uriBuilder.replaceQueryParam(param, new Object[0]));

        URI redirectUri = uriBuilder.build();

        // Create a state for this authentication request.
        final String redirectUrl = redirectUri.toString();
        final AuthenticationState state = AuthenticationStateSessionUtil.create(request, redirectUrl);

        // In some cases we might need to use an external URL as the current incoming one might have been proxied.
        UriBuilder authenticationRequest;

        // Use OIDC API which uses some subtly different parameters.
        authenticationRequest = UriBuilder.fromUri(openIdConfig.getAuthEndpoint())
                .queryParam(OIDC.RESPONSE_TYPE, OIDC.RESPONSE_TYPE__CODE)
                .queryParam(OIDC.CLIENT_ID, openIdConfig.getClientId())
                .queryParam(OIDC.REDIRECT_URI, openIdConfig.getRedirectUri())
                .queryParam(OIDC.SCOPE, OIDC.SCOPE__OPENID + " " + OIDC.SCOPE__EMAIL)
                .queryParam(OIDC.STATE, state.getId())
                .queryParam(OIDC.NONCE, state.getNonce());

        // If there's 'prompt' in the request then we'll want to pass that on to the AuthenticationService.
        // In OpenId 'prompt=login' asks the IP to present a login page to the user, and that's the effect
        // this will have. We need this so that we can bypass certificate logins, e.g. for when we need to
        // log in as the 'admin' user but the browser is always presenting a certificate.
        if (!com.google.common.base.Strings.isNullOrEmpty(prompt)) {
            authenticationRequest.queryParam(OIDC.PROMPT, prompt);
        }

        final String authenticationRequestUrl = authenticationRequest.build().toString();
        LOGGER.info("Redirecting with an AuthenticationRequest to: {}", authenticationRequestUrl);

        return authenticationRequest.build();
    }

    /**
     * We expect the user to have a session if they're trying to log in.
     * If they don't then they need to be directed to an application that will submit
     * an AuthenticationRequest to /authenticate.
     */
    @POST
    @Path("/handleAuthenticationResponse")
    @Consumes({"application/json"})
    @Produces({"application/json"})
    @Timed
    @NotNull
    @ApiOperation(value = "Handle a login response from the auth server.",
            response = String.class, tags = {"Login"})
    public final Response handleAuthenticationResponse(
            @QueryParam(OIDC.STATE) @NotNull final String stateId,
            @QueryParam(OIDC.CODE) @NotNull final String code,
            @Context @NotNull HttpServletRequest request) throws AuthenticationException {
        ResponseBuilder responseBuilder = null;

        boolean loggedIn = false;

        // Check the state is one we requested.
        final AuthenticationState state = AuthenticationStateSessionUtil.pop(request, stateId);
        if (state == null) {
            LOGGER.warn("Unexpected state: " + stateId);
        } else {

            // Invalidate the current session.
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            LOGGER.debug("We have the following access code: {{}}", code);
            session = request.getSession(true);

            UserAgentSessionUtil.set(request);

            // Verify code.
            final Map<String, String> params = new HashMap<>();
            params.put(OIDC.GRANT_TYPE, OIDC.GRANT_TYPE__AUTHORIZATION_CODE);
            params.put(OIDC.CLIENT_ID, openIdConfig.getClientId());
            params.put(OIDC.CLIENT_SECRET, openIdConfig.getClientSecret());
            params.put(OIDC.REDIRECT_URI, openIdConfig.getRedirectUri());
            params.put(OIDC.CODE, code);

            final String tokenEndpoint = openIdConfig.getTokenEndpoint();
            final Response res = jerseyClientFactory.create().target(tokenEndpoint).request().post(Entity.entity(params, MediaType.APPLICATION_JSON));

            Map responseMap;
            if (HttpServletResponse.SC_OK == res.getStatus()) {
                responseMap = res.readEntity(Map.class);
            } else {
                throw new AuthenticationException("Received status " + res.getStatus() + " from " + tokenEndpoint);
            }

            final String idToken = (String) responseMap.get(OIDC.ID_TOKEN);
            if (idToken == null) {
                throw new AuthenticationException("'" + OIDC.ID_TOKEN + "' not provided in response");
            }

            final UserIdentityImpl token = createUIToken(session, state, idToken);
            if (token != null) {
                // Set the token in the session.
                UserIdentitySessionUtil.set(session, token);
                loggedIn = true;
            }

            // If we manage to login then redirect to the original URL held in the state.
            if (loggedIn) {
                LOGGER.info("Redirecting to initiating URL: {}", state.getUrl());
                final UriBuilder uriBuilder = UriBuilder.fromUri(state.getUrl());
                responseBuilder = seeOther(uriBuilder.build());
            }
        }

        if (responseBuilder == null) {
            throw new ServerErrorException(Status.UNAUTHORIZED, new RuntimeException("Not logged in"));
        }

        return responseBuilder.build();
    }

    /**
     * This method must create the token.
     * It does this by enacting the OpenId exchange of accessCode for idToken.
     */
    private UserIdentityImpl createUIToken(final HttpSession session, final AuthenticationState state, final String idToken) {
        UserIdentityImpl token = null;

        try {
            String sessionId = session.getId();
            final JwtClaims jwtClaims = jwtService.verifyToken(idToken);
            final String nonce = (String) jwtClaims.getClaimsMap().get(OIDC.NONCE);
            final boolean match = nonce.equals(state.getNonce());
            if (match) {
                LOGGER.info("User is authenticated for sessionId " + sessionId);
                final String userId = jwtClaims.getSubject();
                final Optional<User> optionalUser = userDao.get(userId);
                final User user = optionalUser.orElseThrow(() -> new RuntimeException("Unable to find user: " + userId));
                token = new UserIdentityImpl(user, userId, idToken, sessionId);

            } else {
                // If the nonces don't match we need to redirect to log in again.
                // Maybe the request uses an out-of-date stroomSessionId?
                LOGGER.info("Received a bad nonce!");
            }
        } catch (final MalformedClaimException | InvalidJwtException e) {
            LOGGER.warn(e.getMessage());
            throw new RuntimeException(e.getMessage(), e);
        }

        return token;
    }
}
