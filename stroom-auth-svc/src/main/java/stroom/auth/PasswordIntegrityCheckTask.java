package stroom.auth;

import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.daos.UserDao;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.TimerTask;

@Singleton
public class PasswordIntegrityCheckTask extends TimerTask {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(PasswordIntegrityCheckTask.class);
    private PasswordIntegrityChecksConfig passwordIntegrityChecksConfig;
    private UserDao userDao;

    @Inject
    public PasswordIntegrityCheckTask(PasswordIntegrityChecksConfig passwordIntegrityChecksConfig, UserDao userDao){
        this.passwordIntegrityChecksConfig = passwordIntegrityChecksConfig;
        this.userDao = userDao;
    }

    @Override
    public void run() {
        LOGGER.info("Performing password integrity checks.");

        int numberOfDisabledNewAccounts = userDao.disableNewInactiveUsers(passwordIntegrityChecksConfig.getDisableInactiveNewAccountAfterXMins());
        LOGGER.info("Disabled {} new user account(s) that have been inactive for {} days or more.",
                numberOfDisabledNewAccounts, passwordIntegrityChecksConfig.getDisableInactiveNewAccountAfterXMins());

        int numberOfDisabledAccounts = userDao.disableInactiveUsers(passwordIntegrityChecksConfig.getDisableInactiveAccountAfterXMins());
        LOGGER.info("Disabled {} user account(s) that have been inactive for {} days or more.",
                numberOfDisabledAccounts, passwordIntegrityChecksConfig.getDisableInactiveNewAccountAfterXMins());

        // TODO password change checks
    }
}
