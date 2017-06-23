package stroom.auth.service.security

import java.security.Principal

class ServiceUser(private var name: String, val jwt: String) : Principal {
    override fun getName(): String {
        return name
    }
}
