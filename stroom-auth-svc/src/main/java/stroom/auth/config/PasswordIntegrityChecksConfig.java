package stroom.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;

public class PasswordIntegrityChecksConfig {
    @NotNull
    @JsonProperty
    private int disableInactiveNewAccountAfterXDays = 30;

    @NotNull
    @JsonProperty
    private int disableInactiveAccountAfterXDays = 30;

    @NotNull
    @JsonProperty
    private int requirePasswordChangeAfterXDays = 90;

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

    public int getDisableInactiveNewAccountAfterXDays() {
        return disableInactiveNewAccountAfterXDays;
    }

    public int getDisableInactiveAccountAfterXDays() {
        return disableInactiveAccountAfterXDays;
    }

    public int getRequirePasswordChangeAfterXDays() {
        return requirePasswordChangeAfterXDays;
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
