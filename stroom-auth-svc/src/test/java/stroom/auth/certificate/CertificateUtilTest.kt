package stroom.auth.certificate

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