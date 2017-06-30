/*
 * Copyright 2017 Crown Copyright
 *
 * This file is part of Stroom-Stats.
 *
 * Stroom-Stats is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Stroom-Stats is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Stroom-Stats.  If not, see <http://www.gnu.org/licenses/>.
 */

package stroom.auth.service.resources

class User {
    constructor()

    constructor(email: String, password: String) {
        this.email = email
        this.password = password
    }

    var id: Int? = null
    var first_name: String? = null
    var last_name: String? = null
    var comments: String? = null
    var email: String? = null
    var state: String? = null
    var password: String? = null
    var password_hash: String? = null
    var login_failures: Int? = null
    var login_count: Int? = null
    var last_login: String? = null
    var updated_on: String? = null
    var updated_by_user: String? = null
    var created_on: String? = null
    var created_by_user: String? = null
}

enum class UserValidationError(val message: String) {
    NO_USER("Please supply a user with an email address and a password. "),
    NO_NAME("User's name cannot be empty. "),
    NO_PASSWORD("User's password cannot be empty. "),
    MISSING_ID("Please supply an ID for the user. ")
}
