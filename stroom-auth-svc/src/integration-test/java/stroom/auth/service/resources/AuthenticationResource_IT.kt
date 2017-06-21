package stroom.auth.service.resources

import com.github.kittinunf.fuel.httpPost
import org.junit.Test
import org.slf4j.LoggerFactory

/**
 * These test all expect the admin user to exist and have the default password.
 *
 * TODO: Test certificates
 */
class AuthenticationResource_IT : Base_IT() {
    private val logger = LoggerFactory.getLogger(AuthenticationResource_IT::class.java)

    var AUTHENTICATION_CHECK_CERTIFICATE_URL = "http://localhost:$appPort/authentication/checkCertificate"

    @Test
    fun good_login() {
        // Most API tests need to login so the actual login method is in the base class.
        // We're adding it as a test here for completeness.
        login()
    }

    @Test
    fun incorrect_credentials_1() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\", \"password\" : \"admin\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertUnauthorised(response)
    }

    @Test
    fun incorrect_credentials_2() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"admin\", \"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertUnauthorised(response)
    }

    @Test
    fun incorrect_credentials_3() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\", \"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertUnauthorised(response)
    }

    @Test
    fun missing_credentials_1() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertBadRequest(response)
    }

    @Test
    fun missing_credentials_2() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .body("{\"password\" : \"BAD\"}")
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertBadRequest(response)
    }

    @Test
    fun missing_credentials_3() {
        val (_, response) = LOGIN_URL
                .httpPost()
                .header(JSON_CONTENT_TYPE)
                .responseString()
        assertBadRequest(response)
    }
}
