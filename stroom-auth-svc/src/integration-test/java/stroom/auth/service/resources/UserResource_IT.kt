package stroom.auth.service.resources

import com.github.kittinunf.fuel.httpGet
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import com.squareup.moshi.Moshi
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Types
import java.lang.reflect.Type


/**
 * This class expects the admin user to exist, and have the default password.
 */
class UserResource_IT: Base_IT() {

    private var ALL_URL = "http://localhost:$appPort/users/"
    private var ME_URL = "http://localhost:$appPort/users/me"

    @Test
    fun current_user() {
        val jwsToken = login()
        val (request, response) = ME_URL
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(200)
        val userJson = String(response.data)

        val user = mapper().fromJson(userJson)

        assertThat(user).isNotNull
    }

    private fun allUsersUrl(): String {
        return "http://localhost:$appPort/users/?tok"
    }

    private fun mapper(): JsonAdapter<List<User>> {
        val moshi = Moshi.Builder().build()
        val type: Type = Types.newParameterizedType(List::class.java, User::class.java)
        val jsonAdapter: JsonAdapter<List<User>> = moshi.adapter(type)
        return jsonAdapter
    }

}