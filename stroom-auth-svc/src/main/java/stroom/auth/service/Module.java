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
import io.dropwizard.setup.Environment;
import org.jooq.Configuration;
import stroom.auth.config.Config;
import stroom.auth.config.TokenConfig;
import stroom.auth.daos.UserDao;

public final class Module extends AbstractModule {
    private final Config config;
    private final Environment environment;
    private final Configuration jooqConfig;

    public Module(final Config config, final Environment environment, final Configuration jooqConfig) {
        this.config = config;
        this.environment = environment;
        this.jooqConfig = jooqConfig;
    }

    protected void configure() {
        bind(Config.class).toInstance(config);
        bind(Environment.class).toInstance(environment);
        bind(Configuration.class).toInstance(jooqConfig);
        bind(TokenConfig.class).toInstance(config.getTokenConfig());
    }

    @Provides
    public PasswordIntegrityCheckTask getPasswordIntegrityCheckTask(Config config, UserDao userDao) {
        return new PasswordIntegrityCheckTask(config.getPasswordIntegrityChecksConfig(), userDao);
    }
}
