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

package stroom.auth.clients;

import org.glassfish.jersey.client.ClientConfig;
import org.glassfish.jersey.client.ClientResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import stroom.auth.config.Config;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.Response;
import java.util.Set;

@Singleton
public class AppPermissionsClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(AppPermissionsClient.class);

    private Config config;
    private Client authorisationService = ClientBuilder.newClient(new ClientConfig().register(ClientResponse.class));

    @Inject
    public AppPermissionsClient(Config config) {
        this.config = config;
    }

    public Set<String> getPermissionNamesForUserName(String userName, String usersJws) {
        String authorisationUrl = config.getAppPermissionServiceConfig().getUrl() + "/byName/" + userName;
        Response response = authorisationService
                .target(authorisationUrl)
                .request()
                .header("Authorization", "Bearer " + usersJws)
                .get();

        Set<String> groups = response.readEntity(new GenericType<Set<String>>(){});
       return groups;
    }

}
