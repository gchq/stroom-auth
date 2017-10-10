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
import stroom.auth.service.config.Config;
import stroom.auth.service.config.TokenConfig;
import stroom.auth.service.exceptions.mappers.BadRequestExceptionMapper;
import stroom.auth.service.exceptions.mappers.TokenCreationExceptionMapper;
import stroom.auth.service.exceptions.mappers.UnsupportedFilterExceptionMapper;
import stroom.auth.service.resources.authentication.v1.AuthenticationResource;
import stroom.auth.service.exceptions.mappers.UnauthorisedExceptionMapper;
import stroom.auth.service.resources.token.v1.TokenDao;
import stroom.auth.service.resources.token.v1.TokenResource;
import stroom.auth.service.resources.token.v1.TokenVerifier;
import stroom.auth.service.resources.user.v1.UserDao;
import stroom.auth.service.resources.user.v1.UserResource;

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
    bind(AuthorisationServiceClient.class);
    bind(TokenDao.class);
    bind(UserDao.class);
    bind(TokenVerifier.class);
    bind(EmailSender.class);
    bind(CertificateManager.class);

    bind(UnauthorisedExceptionMapper.class);
    bind(BadRequestExceptionMapper.class);
    bind(TokenCreationExceptionMapper.class);
    bind(UnsupportedFilterExceptionMapper.class);
  }

  @Provides
  public Config getConfig() {
    return config;
  }

  @Provides
  public TokenConfig getTokenConfig() {
    return config.getTokenConfig();
  }

  @Provides
  public Configuration getJooqConfig() {
    return jooqConfig;
  }
}
