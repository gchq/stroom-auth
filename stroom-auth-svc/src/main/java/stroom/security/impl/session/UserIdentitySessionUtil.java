package stroom.security.impl.session;

import stroom.security.impl.UserIdentity;

import javax.servlet.http.HttpSession;

public final class UserIdentitySessionUtil {
    private static final String SESSION_USER_IDENTITY = "SESSION_USER_IDENTITY";

    private UserIdentitySessionUtil() {
    }

    public static void set(final HttpSession session, final UserIdentity userIdentity) {
        session.setAttribute(SESSION_USER_IDENTITY, userIdentity);
    }

    public static UserIdentity get(final HttpSession session) {
        if (session == null) {
            return null;
        }
        return (UserIdentity) session.getAttribute(SESSION_USER_IDENTITY);
    }
}