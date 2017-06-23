package stroom.auth.service.resources

data class User (val name: String, val password: String){
    constructor() : this("", "")

        val id: Int? = null
        val total_login_failures: Int = 0
        val last_login: String? = null
        val updated_on: String? = null
        val updated_by_user: String? = null
        val created_on: String? = null
        val created_by_user: String? = null
}