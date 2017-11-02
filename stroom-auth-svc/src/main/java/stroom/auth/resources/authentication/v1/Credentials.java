/*
 *
 *   Copyright 2017 Crown Copyright
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

package stroom.auth.resources.authentication.v1;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;

import javax.validation.constraints.NotNull;

@AutoValue
public abstract class Credentials {
    public abstract String email();
    public abstract String password();
    public abstract String sessionId();
    public abstract String requestingClientId();

    @JsonCreator
    public static Credentials create(
            @JsonProperty("email") @NotNull String email,
            @JsonProperty("password") @NotNull String password,
            @JsonProperty("sessionId") @NotNull String sessionId,
            @JsonProperty("requestingClientId") @NotNull String requestingClientId) {
        return new AutoValue_Credentials(email, password, sessionId, requestingClientId);
    }
}
