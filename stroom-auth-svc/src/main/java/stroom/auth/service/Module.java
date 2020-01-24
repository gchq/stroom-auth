/*
 * Copyright 2017 Crown Copyright
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

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import org.jooq.Configuration;
import stroom.auth.clients.UserServiceClient;
import stroom.auth.CertificateManager;
import stroom.auth.EmailSender;
import stroom.auth.PasswordIntegrityCheckTask;
import stroom.auth.TokenBuilderFactory;
import stroom.auth.TokenVerifier;
import stroom.auth.config.AuthorisationServiceConfig;
import stroom.auth.config.Config;
import stroom.auth.config.EmailConfig;
import stroom.auth.config.PasswordIntegrityChecksConfig;
import stroom.auth.config.SmtpConfig;
import stroom.auth.config.StroomConfig;
import stroom.auth.config.TokenConfig;
import stroom.auth.config.UserServiceConfig;
import stroom.auth.daos.JwkDao;
import stroom.auth.daos.TokenDao;
import stroom.auth.daos.UserDao;
import stroom.auth.exceptions.mappers.BadRequestExceptionMapper;
import stroom.auth.exceptions.mappers.NoSuchUserExceptionMapper;
import stroom.auth.exceptions.mappers.TokenCreationExceptionMapper;
import stroom.auth.exceptions.mappers.UnsupportedFilterExceptionMapper;
import stroom.auth.resources.authentication.v1.AuthenticationResource;
import stroom.auth.resources.token.v1.TokenResource;
import stroom.auth.resources.user.v1.UserResource;
import stroom.auth.service.eventlogging.StroomEventLoggingService;

public final class Module extends AbstractModule {
    private Config config;
    private Configuration jooqConfig;

    public Module(Config config, Configuration jooqConfig) {
        this.config = config;
        this.jooqConfig = jooqConfig;
    }

    protected void configure() {
        bind(UserResource.class);
        bind(AuthenticationResource.class);
        bind(TokenResource.class);
        bind(UserServiceClient.class);
        bind(TokenDao.class);
        bind(UserDao.class);
        bind(JwkDao.class);
        bind(TokenVerifier.class);
        bind(EmailSender.class);
        bind(CertificateManager.class);
        bind(TokenBuilderFactory.class);
        bind(StroomEventLoggingService.class);

        bind(BadRequestExceptionMapper.class);
        bind(TokenCreationExceptionMapper.class);
        bind(UnsupportedFilterExceptionMapper.class);
        bind(NoSuchUserExceptionMapper.class);

        // Bind all the config objects so they can be injected independently
        bind(StroomConfig.class).toInstance(config.getStroomConfig());
        bind(TokenConfig.class).toInstance(config.getTokenConfig());
        bind(AuthorisationServiceConfig.class).toInstance(config.getAuthorisationServiceConfig());
        bind(EmailConfig.class).toInstance(config.getEmailConfig());
        bind(SmtpConfig.class).toInstance(config.getEmailConfig().getSmtpConfig());
        bind(PasswordIntegrityChecksConfig.class).toInstance(config.getPasswordIntegrityChecksConfig());
        bind(UserServiceConfig.class).toInstance(config.getUserServiceConfig());
    }

    @Provides
    public Config getConfig() {
        return config;
    }


    @Provides
    public Configuration getJooqConfig() {
        return jooqConfig;
    }

    @Provides
    public PasswordIntegrityCheckTask getPasswordIntegrityCheckTask(Config config, UserDao userDao){
        return new PasswordIntegrityCheckTask(config.getPasswordIntegrityChecksConfig(), userDao);
    }
}
