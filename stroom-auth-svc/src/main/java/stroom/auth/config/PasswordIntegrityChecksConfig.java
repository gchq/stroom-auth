package stroom.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.inject.Singleton;
import javax.validation.constraints.NotNull;
import java.time.Duration;

@Singleton
public class PasswordIntegrityChecksConfig {

    @NotNull
    @JsonProperty
    private Duration neverUsedAccountDeactivationThreshold = Duration.parse("P30D");

    @NotNull
    @JsonProperty
    private Duration unusedAccountDeactivationThreshold = Duration.parse("P90D");

    @NotNull
    @JsonProperty
    private Duration mandatoryPasswordChangeDuration = Duration.parse("P90D");

    @NotNull
    @JsonProperty
    private Duration durationBetweenChecks = Duration.parse("PT2M");

    @NotNull
    @JsonProperty
    private boolean forcePasswordChangeOnFirstLogin = true;

    @JsonProperty
    // The default is to let everything through
    private String passwordComplexityRegex = ".*";

    @NotNull
    @JsonProperty
    private int minimumPasswordLength;

    public Duration getNeverUsedAccountDeactivationThreshold() {
        return neverUsedAccountDeactivationThreshold;
    }

    public Duration getUnusedAccountDeactivationThreshold() {
        return unusedAccountDeactivationThreshold;
    }

    public Duration getMandatoryPasswordChangeDuration() {
        return mandatoryPasswordChangeDuration;
    }

    public Duration getDurationBetweenChecks() {
        return durationBetweenChecks;
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
