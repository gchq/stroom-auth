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

package stroom.auth.config;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.inject.Singleton;
import javax.validation.constraints.NotNull;

@Singleton
public class AuthorisationServiceConfig {

    @NotNull
    @JsonProperty
    private String url;

    @NotNull
    @JsonProperty
    private String canManageUsersPath;

    @NotNull
    @JsonProperty
    private String canManageUsersPermission;

    @NotNull
    @JsonProperty
    private String setUserStatusPath;

    public String getUrl() {
        return url;
    }

    public String getCanManageUsersUrl() {
        return url + canManageUsersPath;
    }

    public String getCanManageUsersPermission() {
        return canManageUsersPermission;
    }

    public String getSetUserStatusPath() {
        return setUserStatusPath;
    }
}
