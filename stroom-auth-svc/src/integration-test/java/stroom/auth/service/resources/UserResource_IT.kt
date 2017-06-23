package stroom.auth.service.resources

import com.github.kittinunf.fuel.httpGet
import com.github.kittinunf.fuel.httpPost
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import com.squareup.moshi.Moshi
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Types
import org.assertj.core.api.Assertions.fail
import java.lang.reflect.Type
import java.time.Instant


/**
 * This class expects the admin user to exist, and have the default password.
 */
class UserResource_IT: Base_IT() {

    private var ROOT_URL = "http://localhost:$appPort/users/"
    private var ME_URL = "http://localhost:$appPort/users/me"

    @Test
    fun all_users() {
        val jwsToken = login()
        val url = ROOT_URL + "?fromUsername=&usersPerPage=10&orderBy=name"
        val (_, response) = url
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        val userJson = String(response.data)
        val users = userListMapper().fromJson(userJson)
        assertThat(response.httpStatusCode).isEqualTo(200)
    }

    @Test
    fun current_user() {
        val jwsToken = login()
        val (_, response) = ME_URL
                .httpGet()
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        assertThat(response.httpStatusCode).isEqualTo(200)
        val userJson = String(response.data)

        val user = userListMapper().fromJson(userJson)

        if(user != null) {
            assertThat(user[0].name).isEqualTo("admin")
        }
        else fail("No users found")
    }

    @Test
    fun create_user() {
        val jwsToken = login()
        val user = User(name = Instant.now().toString(), password = "testPassword")
        val serializedUser = userMapper().toJson(user)
        val (_, response) = ROOT_URL
                .httpPost()
                .body(serializedUser)
                .header(jsonContentType("Authorization" to "Bearer $jwsToken"))
                .responseString()
        response.assertOk()
        response.assertBodyNotNull()
    }

    private fun allUsersUrl(): String {
        return "http://localhost:$appPort/users/?tok"
    }

    private fun userListMapper(): JsonAdapter<List<User>> {
        val moshi = Moshi.Builder().build()
        val type: Type = Types.newParameterizedType(List::class.java, User::class.java)
        val jsonAdapter: JsonAdapter<List<User>> = moshi.adapter(type)
        return jsonAdapter
    }

    private fun userMapper(): JsonAdapter<User> {
        return Moshi.Builder().build().adapter(User::class.java)
    }

}