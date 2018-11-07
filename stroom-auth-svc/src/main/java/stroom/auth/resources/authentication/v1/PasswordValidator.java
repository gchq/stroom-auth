package stroom.auth.resources.authentication.v1;

import stroom.auth.config.PasswordIntegrityChecksConfig;

import java.util.ArrayList;
import java.util.List;

public class PasswordValidator {

    static PasswordValidationFailureType[] validate(
            PasswordIntegrityChecksConfig config,
            final String newPassword) {

        List<PasswordValidationFailureType> failedOn = new ArrayList<>();

        if (newPassword != null &&
                (newPassword.length() < config.getMinimumPasswordLength())) {
            failedOn.add(PasswordValidationFailureType.LENGTH);
        }

        boolean isPasswordComplexEnough = newPassword.matches(config.getPasswordComplexityRegex());

        if (!isPasswordComplexEnough) {
            failedOn.add(PasswordValidationFailureType.COMPLEXITY);
        }

        return failedOn.toArray(new PasswordValidationFailureType[0]);
    }
}
