/*
 * Copyright 2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package stroom.auth.service;

import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.daos.UserDao;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.TimerTask;

@Singleton
public class PasswordIntegrityCheckTask extends TimerTask {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(PasswordIntegrityCheckTask.class);
    private final PasswordIntegrityChecksConfig passwordIntegrityChecksConfig;
    private final UserDao userDao;

    @Inject
    PasswordIntegrityCheckTask(final PasswordIntegrityChecksConfig passwordIntegrityChecksConfig, final UserDao userDao){
        this.passwordIntegrityChecksConfig = passwordIntegrityChecksConfig;
        this.userDao = userDao;
    }

    @Override
    public void run() {
        LOGGER.info("Checking for accounts that are not being used.");

        int numberOfInactiveNewAccounts = userDao.deactivateNewInactiveUsers(passwordIntegrityChecksConfig.getNeverUsedAccountDeactivationThreshold());
        LOGGER.info("Deactivated {} new user account(s) that have been inactive for duration of {} or more.",
                numberOfInactiveNewAccounts, passwordIntegrityChecksConfig.getNeverUsedAccountDeactivationThreshold());

        int numberOfInactiveAccounts = userDao.deactivateInactiveUsers(passwordIntegrityChecksConfig.getUnusedAccountDeactivationThreshold());
        LOGGER.info("Deactivated {} user account(s) that have been inactive for  duration of {} days or more.",
                numberOfInactiveAccounts, passwordIntegrityChecksConfig.getUnusedAccountDeactivationThreshold());

        // TODO password change checks
    }
}
