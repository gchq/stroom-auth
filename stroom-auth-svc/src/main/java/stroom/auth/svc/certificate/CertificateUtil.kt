/*
 * Copyright 2016 Crown Copyright
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

package stroom.auth.svc.certificate

import org.slf4j.LoggerFactory

import javax.security.auth.x500.X500Principal
import javax.servlet.http.HttpServletRequest
import java.security.cert.X509Certificate
import java.util.StringTokenizer
import java.util.regex.Pattern

object CertificateUtil {
    private val LOGGER = LoggerFactory.getLogger(CertificateUtil::class.java)

    /**
     * API into the request for the certificate details.
     */
    val SERVLET_CERT_ARG = "javax.servlet.request.X509Certificate"

    /**
     * Do all the below in 1 go !
     */
    fun extractCertificateDN(httpServletRequest: HttpServletRequest): String? {
        return extractDNFromCertificate(extractCertificate(httpServletRequest))
    }

    /**
     * Pull out the Subject from the certificate. E.g.
     * "CN=some.server.co.uk, OU=servers, O=some organisation, C=GB"
     */
    fun extractCertificate(httpServletRequest: HttpServletRequest): java.security.cert.X509Certificate? {
        val certs = httpServletRequest.getAttribute(CertificateUtil.SERVLET_CERT_ARG) as Array<Any>

        return CertificateUtil.extractCertificate(certs)
    }

    /**
     * Pull out the Subject from the certificate. E.g.
     * "CN=some.server.co.uk, OU=servers, O=some organisation, C=GB"

     * @param certs
     * *            ARGS from the SERVLET request.
     */
    fun extractCertificate(certs: Array<Any>?): java.security.cert.X509Certificate? {
        if (certs != null) {
            for (certO in certs) {
                if (certO is java.security.cert.X509Certificate) {
                    return certO
                }
            }
        }
        return null
    }

    /**
     * Given a cert pull out the DN. E.g.
     * "CN=some.server.co.uk, OU=servers, O=some organisation, C=GB"

     * @return null or the CN name
     */
    fun extractDNFromCertificate(cert: X509Certificate?): String? {
        if (cert == null) {
            return null
        }
        return cert.subjectDN.name
    }

    /**
     * Given a cert pull out the expiry date.

     * @return null or the CN name
     */
    fun extractExpiryDateFromCertificate(cert: X509Certificate?): Long? {
        if (cert != null) {
            val date = cert.notAfter
            if (date != null) {
                return date.time
            }
        }
        return null
    }

    /**
     * User ID's are embedded in brackets at the end.
     */
    fun extractUserIdFromCN(cn: String?): String? {
        if (cn == null) {
            return null
        }
        val startPos = cn.indexOf('(')
        val endPos = cn.indexOf(')')

        if (startPos != -1 && endPos != -1 && startPos < endPos) {
            return cn.substring(startPos + 1, endPos)
        }
        return cn

    }

    /**
     * User ID's are embedded in brackets at the end.
     */
    fun extractUserIdFromDN(dn: String, pattern: Pattern): String? {
        val normalisedDN = dnToRfc2253(dn)
        val matcher = pattern.matcher(normalisedDN!!)
        if (matcher.find()) {
            return matcher.group(1)
        }

        return null
    }

    /**
     * Normalise an RFC 2253 Distinguished Name so that it is consistent. Note
     * that the values in the fields should not be normalised - they are
     * case-sensitive.

     * @param dn
     * *            Distinguished Name to normalise. Must be RFC 2253-compliant
     * *
     * @return The DN in RFC 2253 format, with a consistent case for the field
     * *         names and separation
     */
    fun dnToRfc2253(dn: String?): String? {
        if (LOGGER.isTraceEnabled) {
            LOGGER.trace("Normalising DN: " + dn!!)
        }

        if (dn == null) {
            return null
        }

        if (dn.equals("anonymous", ignoreCase = true)) {
            LOGGER.trace("Anonymous is a special case - returning as-is")
            return dn
        }

        try {
            val x500 = X500Principal(dn)
            val normalised = x500.name
            if (LOGGER.isTraceEnabled) {
                LOGGER.trace("Normalised DN: " + normalised)
            }
            return normalised
        } catch (e: IllegalArgumentException) {
            LOGGER.error("Provided value is not a valid Distinguished Name; it will be returned as-is: " + dn, e)
            return dn
        }

    }
}


/**
 * Given a DN pull out the CN. E.g.
 * "CN=some.server.co.uk, OU=servers, O=some organisation, C=GB" Would
 * return "some.server.co.uk"

 * @return null or the CN name
 */
fun extractCNFromDN(dn: String?): String? {
    if (dn == null) {
        return null
    }
    val attributes = StringTokenizer(dn, ",")
    val map = HashMap<String,String>()
    while (attributes.hasMoreTokens()) {
        val token = attributes.nextToken()
        if (token.contains("=")) {
            val parts = token.split("=".toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
            if (parts.size == 2) {
                map.put(parts[0].trim { it <= ' ' }.toUpperCase(), parts[1].trim { it <= ' ' })
            }
        }
    }
    return map["CN"]
}