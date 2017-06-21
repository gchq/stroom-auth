package stroom.auth.service.resources

data class User(
        val id: Int,
        val name: String,
        val total_login_failures: Int,
        val last_login: String,
        val updated_on: String,
        val updated_by_user: String,
        val created_on: String,
        val created_by_user: String)