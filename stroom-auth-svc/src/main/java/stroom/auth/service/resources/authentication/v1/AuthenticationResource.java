/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service.resources.authentication.v1;

import com.codahale.metrics.annotation.Timed;
import com.google.common.base.Strings;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Result;
import org.jooq.Table;
import org.mindrot.jbcrypt.BCrypt;
import org.simplejavamail.email.Email;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.config.ServerConfig;
import org.simplejavamail.mailer.config.TransportStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.service.config.Config;
import stroom.auth.service.resources.token.v1.Token;
import stroom.auth.service.resources.token.v1.TokenCreationException;
import stroom.auth.service.resources.token.v1.TokenDao;
import stroom.auth.service.resources.token.v1.TokenVerifier;
import stroom.auth.service.resources.user.v1.User;
import stroom.auth.service.resources.user.v1.UserMapper;
import stroom.db.auth.tables.records.UsersRecord;

import javax.annotation.Nullable;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.mail.Message;
import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.servlet.http.HttpServletRequest;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

import static stroom.db.auth.Tables.USERS;

@Singleton
@Path("/authentication/v1")
@Produces(MediaType.APPLICATION_JSON)
public final class AuthenticationResource {
  private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationResource.class);

  private Config config;
  private final Pattern dnPattern;
  private TokenDao tokenDao;
  private TokenVerifier tokenVerifier;

  @Inject
  public AuthenticationResource(@NotNull Config config, TokenDao tokenDao, TokenVerifier tokenVerifier) {
    this.config = config;
    this.dnPattern = Pattern.compile(config.getCertificateDnPattern());
    this.tokenDao = tokenDao;
    this.tokenVerifier = tokenVerifier;
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
  public final Response checkCertificate(@Context @NotNull HttpServletRequest httpServletRequest, @Context @NotNull DSLContext database) throws URISyntaxException {
    String certificateDn = httpServletRequest.getHeader("X-SSL-CLIENT-S-DN");

    Response response;
    if (certificateDn == null) {
      LOGGER.debug("No DN in request. Redirecting to login.");
      response = this.redirectToLoginResponse();
    } else {
      try {
        LdapName ldapName = new LdapName(certificateDn);
        Optional<String> cn = ldapName.getRdns().stream()
            .filter(rdn -> rdn.getType().equalsIgnoreCase("CN"))
            .map(rdn -> (String) rdn.getValue())
            .findFirst();
        if (cn.isPresent()) {
          LOGGER.debug("Found CN in DN; logging user in.");
          // Get and return a token based on the CN
          String token = tokenDao.createToken(
              Token.TokenType.USER, "authenticationResource",
              cn.get(), true, "Created for a certificate user.");
          response = Response.status(Status.OK).entity(token).build();
        } else {
          LOGGER.debug("Cannot find CN in DN. Redirecting to login.");
          response = this.redirectToLoginResponse();
        }
      } catch (InvalidNameException e) {
        LOGGER.debug("Cannot process this DN. Redirecting to login.", e);
        response = this.redirectToLoginResponse();
      } catch (TokenCreationException e) {
        LOGGER.debug("Unable to create a token for this user. Redirecting to login as a backup method.", e);
        response = this.redirectToLoginResponse();
      }
    }

    return response;
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
    if (credentials == null
        || Strings.isNullOrEmpty(credentials.getEmail())
        || Strings.isNullOrEmpty(credentials.getPassword())) {
      return Response.status(Status.BAD_REQUEST).entity("Please provide both email and password").build();
    }

    Result results = database
        .selectFrom((Table) USERS)
        .where(USERS.EMAIL.eq(credentials.getEmail()))
        .fetch();

    if (results.size() != 1) {
      LOGGER.debug("Request to log in with invalid email: " + credentials.getEmail());
      return unauthorisedResponse();
    }

    UsersRecord user = (UsersRecord) database
        .selectFrom((Table) USERS)
        .where(new Condition[]{USERS.EMAIL.eq(credentials.getEmail())})
        .fetchOne();

    // Don't let them in if the account is locked or disabled.
    if (user.getState().equals(User.UserState.DISABLED.getStateText())
        || user.getState().equals(User.UserState.LOCKED.getStateText())) {
      LOGGER.debug("Account {} tried to log in but it is disabled or locked.", credentials.getEmail());
      return unauthorisedAndLockedOrDisabledResponse();
    }

    boolean isPasswordCorrect = BCrypt.checkpw(credentials.getPassword(), user.getPasswordHash());
    if (isPasswordCorrect) {
      LOGGER.debug("Login for {} succeeded", credentials.getEmail());

      // We reset the failed login count if we have a successful login
      user.setLoginFailures(0);
      user.setLoginCount(user.getLoginCount() + 1);
      user.setLastLogin(UserMapper.convertISO8601ToTimestamp(ZonedDateTime.now().toString()));
      database
          .update((Table) USERS)
          .set(user)
          .where(new Condition[]{USERS.EMAIL.eq(credentials.getEmail())}).execute();

      String token;
      try {
        token = tokenDao.createToken(
            Token.TokenType.USER, "authenticationResource",
            credentials.getEmail(),
            true,
            "Created for username/password user");
      } catch (TokenCreationException e) {
        LOGGER.debug("Unable to create a token for this user. Redirecting to login as a backup method.", e);
        return this.redirectToLoginResponse();
      }
      response = Response.status(Status.OK).entity(token).build();
      return response;
    } else {
      // If the password is wrong we need to increment the failed login count,
      // check if we need to locked the account, and save.
      user.setLoginFailures(user.getLoginFailures() + 1);
      boolean shouldLock = user.getLoginFailures() >= this.config.getFailedLoginLockThreshold();

      if (shouldLock) {
        user.setState(User.UserState.LOCKED.getStateText());
      }

      database
          .update((Table) USERS)
          .set(user)
          .where(new Condition[]{USERS.EMAIL.eq(credentials.getEmail())}).execute();

      LOGGER.debug("Password for {} is incorrect", credentials.getEmail());
      LOGGER.debug("Account {} has had too many failed access attempts and is locked", credentials.getEmail());

      return shouldLock ? unauthorisedAndNowLockedResponse() : unauthorisedResponse();
    }
  }

  @GET
  @Path("reset/{email}")
  @Timed
  @NotNull
  public final Response resetEmail(@Context @NotNull DSLContext database, @PathParam("email") String emailAddress) {
    UsersRecord usersRecord = database
        .selectFrom(USERS)
        .where(USERS.EMAIL.eq(emailAddress)).fetchOne();

    String resetToken;
    try {
      resetToken = tokenDao.createToken(
          Token.TokenType.EMAIL_RESET, "authenticationResource",
          emailAddress,
          true, "");
    } catch (TokenCreationException e) {
      String errorMessage = "Unable to create a token for this user!";
      LOGGER.debug(errorMessage, e);
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Unable to create a token for this user!").build();
    }

    String resetName = usersRecord.getFirstName() + "" + usersRecord.getLastName();
    String resetUrl = String.format(config.getResetPasswordUrl(), resetToken);
    String passwordResetEmailText = String.format(config.getEmailConfig().getPasswordResetText(), resetUrl);

    Email email = new Email();
    email.setFromAddress(config.getEmailConfig().getFromName(), config.getEmailConfig().getFromAddress());
    email.setReplyToAddress(config.getEmailConfig().getFromName(), config.getEmailConfig().getFromAddress());
    email.addRecipient(resetName, emailAddress, Message.RecipientType.TO);
    email.setSubject(config.getEmailConfig().getPasswordResetSubject());
    email.setText(passwordResetEmailText);

    TransportStrategy transportStrategy = config.getEmailConfig().getSmtpConfig().getTransportStrategy();

    new Mailer(
        new ServerConfig(
            config.getEmailConfig().getSmtpConfig().getHost(),
            config.getEmailConfig().getSmtpConfig().getPort(),
            config.getEmailConfig().getSmtpConfig().getUsername(),
            config.getEmailConfig().getSmtpConfig().getPassword()),
        transportStrategy
    ).sendMail(email);

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

  private final Response redirectToLoginResponse() throws URISyntaxException {
    return Response.seeOther(new URI(this.config.getLoginUrl())).build();
  }

  private static final Response unauthorisedResponse() {
    return Response.status(Status.UNAUTHORIZED).entity("Invalid credentials").build();
  }

  private static final Response unauthorisedAndNowLockedResponse() {
    return Response.status(Status.UNAUTHORIZED).entity("Too many failed attempts - this account is now locked").build();
  }

  private static final Response unauthorisedAndLockedOrDisabledResponse() {
    return Response.status(Status.UNAUTHORIZED).entity("This account is locked or disabled").build();
  }
}
