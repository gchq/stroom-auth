package stroom.auth.service.resources

import com.github.kittinunf.fuel.httpPost
import org.assertj.core.api.Assertions.assertThat
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
    fun bad_credentials_1() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\", \"password\" : \"admin\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(401)
    }

    @Test
    fun bad_credentials_2() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"admin\", \"password\" : \"BAD\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(401)
    }

    @Test
    fun bad_credentials_3() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\", \"password\" : \"BAD\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(401)
    }

    @Test
    fun bad_credentials_4() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .body("{\"username\" : \"BAD\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(400)
    }

    @Test
    fun bad_credentials_5() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .body("{\"password\" : \"BAD\"}")
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(400)
    }

    @Test
    fun bad_credentials_6() {
        val (request, response) = LOGIN_URL
                .httpPost()
                .header(mapOf("Content-Type" to "application/json"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(400)
    }




}