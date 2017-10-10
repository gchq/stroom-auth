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

package stroom.auth.service;

import stroom.auth.service.exceptions.NoCertificateException;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import java.util.Optional;

public class CertificateManager {
    private static final org.slf4j.Logger LOGGER = org.slf4j.LoggerFactory.getLogger(CertificateManager.class);

    public String getCn(String dn){
        if (dn == null) {
            LOGGER.debug("No DN in request. Redirecting to login.");
            throw new NoCertificateException();
        }

        Optional<String> cn;
        try {
            LdapName ldapName = new LdapName(dn);
            cn = ldapName.getRdns().stream()
                    .filter(rdn -> rdn.getType().equalsIgnoreCase("CN"))
                    .map(rdn -> (String) rdn.getValue())
                    .findFirst();

        } catch (InvalidNameException e) {
            String message = "Cannot process this DN. Redirecting to login.";
            LOGGER.debug(message, e);
            throw new NoCertificateException(message);
        }

        if(!cn.isPresent()){
            throw new NoCertificateException();
        }

        return cn.get();
    }
}
