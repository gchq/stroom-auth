package stroom.security.impl;

import java.io.Serializable;

public interface UserIdentity extends Serializable {
    String getId();

    String getJws();

    String getSessionId();
}
