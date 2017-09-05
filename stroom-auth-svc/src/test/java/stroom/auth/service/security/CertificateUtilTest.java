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
