package stroom.auth.resources.authentication.v1;

import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.daos.UserDao.LoginResult;
import stroom.auth.resources.authentication.v1.ChangePasswordResponse.ChangePasswordResponseBuilder;

public class ChangePasswordValidator {

    static ChangePasswordResponseBuilder validateNewPassword(
            PasswordIntegrityChecksConfig config,
            LoginResult loginResult,
            final String newPassword,
            final String oldPassword){

        var responseBuilder = ChangePasswordResponseBuilder.aChangePasswordResponse();

        if(loginResult == LoginResult.BAD_CREDENTIALS
                || loginResult == LoginResult.DISABLED_BAD_CREDENTIALS
                || loginResult == LoginResult.LOCKED_BAD_CREDENTIALS){
            responseBuilder.withFailedOn(ChangePasswordResponse.FailTypes.BAD_OLD_PASSWORD);
        }

        if(oldPassword.equalsIgnoreCase(newPassword)){
            responseBuilder.withFailedOn(ChangePasswordResponse.FailTypes.REUSE);
        }

        if(newPassword.length()
                < config.getMinimumPasswordLength()){
            responseBuilder.withFailedOn(ChangePasswordResponse.FailTypes.LENGTH);
        }

        boolean isPasswordComplexEnough = newPassword.matches(config.getPasswordComplexityRegex());

        if(!isPasswordComplexEnough){
            responseBuilder.withFailedOn(ChangePasswordResponse.FailTypes.COMPLEXITY);
        }

        return responseBuilder;
    }
}
