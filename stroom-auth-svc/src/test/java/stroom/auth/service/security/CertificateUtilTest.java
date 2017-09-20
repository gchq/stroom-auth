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

package stroom.auth.service.security;

import org.junit.Assert;
import org.junit.Test;

import java.util.regex.Pattern;

public final class CertificateUtilTest {
  @Test
  public final void testSpaceInCN() {
    String dn = "CN=John Smith (johnsmith), OU=ouCode1, OU=ouCode2, O=oValue, C=GB";
    Assert.assertEquals("CN=John Smith (johnsmith),OU=ouCode1,OU=ouCode2,O=oValue,C=GB", CertificateUtil.dnToRfc2253(dn));
    Assert.assertEquals("John Smith (johnsmith)", CertificateUtil.extractCNFromDN(dn));
    Assert.assertEquals("johnsmith", CertificateUtil.extractUserIdFromCN(CertificateUtil.extractCNFromDN(dn)));
    Pattern pattern = Pattern.compile("CN=[^ ]+ [^ ]+ \\(?([a-zA-Z0-9]+)\\)?");
    Assert.assertEquals("johnsmith", CertificateUtil.extractUserIdFromDN(dn, pattern));
  }
}
