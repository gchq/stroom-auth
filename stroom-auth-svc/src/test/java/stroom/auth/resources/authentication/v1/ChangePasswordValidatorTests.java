package stroom.auth.resources.authentication.v1;

import org.junit.Test;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.daos.UserDao;

import java.util.stream.Collectors;

public class ChangePasswordValidatorTests {

    private static final String COMPLEXITY_REGEX = "^(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%^&+=])(?=\\S+$).{8,}$";

    @Test
    public void test_good_password() {
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(".*");

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.GOOD_CREDENTIALS,
                "!Hem38sjds", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have no failed types: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .isNullOrEmpty();
    }

    @Test
    public void test_bad_password(){
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(".*");

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.BAD_CREDENTIALS,
                "!Hem38sjds", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have failed type of BAD_OLD_PASSWORD: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .hasSize(1)
                .contains(ChangePasswordResponse.FailTypes.BAD_OLD_PASSWORD);
    }

    @Test
    public void test_too_short_password(){
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(".*");
        when(mockedConfig.getMinimumPasswordLength()).thenReturn(5);

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.GOOD_CREDENTIALS,
                "!Hem", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have failed type of LENGTH: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .hasSize(1)
                .contains(ChangePasswordResponse.FailTypes.LENGTH);
    }

    @Test
    public void test_too_simple_password() {
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(COMPLEXITY_REGEX);

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.GOOD_CREDENTIALS,
                "Hem", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have failed type of COMPLEXITY: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .hasSize(1)
                .contains(ChangePasswordResponse.FailTypes.COMPLEXITY);
    }

    @Test
    public void test_reused_password() {
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(".*");

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.GOOD_CREDENTIALS,
                "&jdMf7ksh", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have failed type of REUSE: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .hasSize(1)
                .contains(ChangePasswordResponse.FailTypes.REUSE);
    }

    @Test
    public void test_good_combination(){
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(COMPLEXITY_REGEX);
        when(mockedConfig.getMinimumPasswordLength()).thenReturn(4);

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.GOOD_CREDENTIALS,
                "&Hem38sjds", "&jdMf7ksh");

        assertThat(result.failedOn)
                .as("Should have no failed types: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .isNullOrEmpty();
    }

    @Test
    public void test_bad_combination(){
        var mockedConfig = mock(PasswordIntegrityChecksConfig.class);
        when(mockedConfig.getPasswordComplexityRegex()).thenReturn(COMPLEXITY_REGEX);
        when(mockedConfig.getMinimumPasswordLength()).thenReturn(4);

        var result = ChangePasswordValidator.validateNewPassword(
                mockedConfig,
                UserDao.LoginResult.BAD_CREDENTIALS,
                "Hem", "Hem");

        assertThat(result.failedOn)
                .as("Should have no failed types: %s",
                        result.failedOn.stream().map(Object::toString).collect(Collectors.joining(", ")))
                .hasSize(4)
                .contains(ChangePasswordResponse.FailTypes.REUSE)
                .contains(ChangePasswordResponse.FailTypes.COMPLEXITY)
                .contains(ChangePasswordResponse.FailTypes.LENGTH)
                .contains(ChangePasswordResponse.FailTypes.BAD_OLD_PASSWORD);


    }
}
