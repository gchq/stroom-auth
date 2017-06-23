package stroom.auth.service.security

import io.dropwizard.auth.AuthenticationException
import io.dropwizard.auth.Authenticator
import org.jose4j.jwt.MalformedClaimException
import org.jose4j.jwt.consumer.JwtContext

import java.util.Optional

class UserAuthenticator : Authenticator<JwtContext, ServiceUser> {

    @Throws(AuthenticationException::class)
    override fun authenticate(context: JwtContext): Optional<ServiceUser> {
        //TODO: If we want to check anything else about the user we need to do it here.
        try {
            return Optional.of(ServiceUser(
                    context.jwtClaims.subject,
                    context.jwt))
        } catch (e: MalformedClaimException) {
            return Optional.empty()
        }

    }
}

