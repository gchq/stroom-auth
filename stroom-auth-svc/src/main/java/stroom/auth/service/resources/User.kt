package stroom.auth.service.resources

class User {
    constructor()

    constructor(name: String, password: String) {
        this.name = name
        this.password = password
    }

    var id: Int? = null
    var name: String? = null
    var password: String? = null
    var password_hash: String? = null
    var total_login_failures: Int? = null
    var last_login: String? = null
    var updated_on: String? = null
    var updated_by_user: String? = null
    var created_on: String? = null
    var created_by_user: String? = null
}

enum class UserValidationError(val message: String) {
    NO_USER("Please supply a user with a username and password. "),
    NO_NAME("User's name cannot be empty. "),
    NO_PASSWORD("User's password cannot be empty. "),
    MISSING_ID("Please supply an ID for the user. ")
}
