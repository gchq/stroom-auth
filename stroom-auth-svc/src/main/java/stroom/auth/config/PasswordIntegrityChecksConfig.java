package stroom.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;

public class PasswordIntegrityChecksConfig {

    @NotNull
    @JsonProperty
    private int disableInactiveNewAccountAfterXMins = 30;

    @NotNull
    @JsonProperty
    private int disableInactiveAccountAfterXMins = 30;

    @NotNull
    @JsonProperty
    private int requirePasswordChangeAfterXMins = 90;

    @NotNull
    @JsonProperty
    private int secondsBetweenChecks = 120;

    @NotNull
    @JsonProperty
    private boolean forcePasswordChangeOnFirstLogin = true;

    @JsonProperty
    // The default is to let everything through
    private String passwordComplexityRegex = ".*";

    @NotNull
    @JsonProperty
    private int minimumPasswordLength;

    public int getDisableInactiveNewAccountAfterXMins() {
        return disableInactiveNewAccountAfterXMins;
    }

    public int getDisableInactiveAccountAfterXMins() {
        return disableInactiveAccountAfterXMins;
    }

    public int getRequirePasswordChangeAfterXMins() {
        return requirePasswordChangeAfterXMins;
    }

    public int getSecondsBetweenChecks() {
        return secondsBetweenChecks;
    }

    public boolean isForcePasswordChangeOnFirstLogin() {
        return forcePasswordChangeOnFirstLogin;
    }

    public String getPasswordComplexityRegex() {
        return passwordComplexityRegex;
    }

    public int getMinimumPasswordLength() {
        return minimumPasswordLength;
    }
}
