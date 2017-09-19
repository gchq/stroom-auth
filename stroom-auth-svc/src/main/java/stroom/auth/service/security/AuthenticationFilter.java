/*
 * Copyright 2017 Crown Copyright
 *
 * This file is part of Stroom-Stats.
 *
 * Stroom-Stats is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Stroom-Stats is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Stroom-Stats.  If not, see <http://www.gnu.org/licenses/>.
 */

package stroom.auth.service.security;

import com.github.toastshaman.dropwizard.auth.jwt.JwtAuthFilter;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;
import stroom.auth.service.config.TokenConfig;

public class AuthenticationFilter {

  public static JwtAuthFilter<ServiceUser> get(TokenConfig config) {
    final JwtConsumer consumer = new JwtConsumerBuilder()
        .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
        .setRequireExpirationTime() // the JWT must have an expiration time
        .setRequireSubject() // the JWT must have a subject claim
        .setVerificationKey(new HmacKey(config.getJwsSecretAsBytes())) // verify the signature with the public key
        .setRelaxVerificationKeyValidation() // relaxes key length requirement
        .setExpectedIssuer("stroom")
        .build();

    return new JwtAuthFilter.Builder<ServiceUser>()
        .setJwtConsumer(consumer)
        .setRealm("realm")
        .setPrefix("Bearer")
        .setAuthenticator(new UserAuthenticator())
        .buildAuthFilter();
  }
}
