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

package stroom.auth.service.security

import org.junit.Assert
import org.junit.Test
import stroom.auth.service.security.CertificateUtil
import stroom.auth.service.security.extractCNFromDN
import java.util.regex.Pattern

class TestCertificateUtil {
    @Test
    fun testSpaceInCN() {
        val dn = "CN=John Smith (johnsmith), OU=ouCode1, OU=ouCode2, O=oValue, C=GB"

        Assert.assertEquals("CN=John Smith (johnsmith),OU=ouCode1,OU=ouCode2,O=oValue,C=GB",
                CertificateUtil.dnToRfc2253(dn))
        Assert.assertEquals("John Smith (johnsmith)", extractCNFromDN(dn))
        Assert.assertEquals("johnsmith", CertificateUtil.extractUserIdFromCN(extractCNFromDN(dn)))

        val pattern = Pattern.compile("CN=[^ ]+ [^ ]+ \\(?([a-zA-Z0-9]+)\\)?")
        Assert.assertEquals("johnsmith", CertificateUtil.extractUserIdFromDN(dn, pattern))
    }
}