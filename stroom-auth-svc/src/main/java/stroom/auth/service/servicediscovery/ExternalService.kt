package stroom.auth.service.servicediscovery

import com.google.common.base.Preconditions
import org.apache.curator.x.discovery.ProviderStrategy
import org.apache.curator.x.discovery.strategies.RandomStrategy
import org.apache.curator.x.discovery.strategies.StickyStrategy
import java.util.*
import java.util.stream.Stream

/**
 * The canonical list of external services.
 *
 *
 * Service names, used for service discovery lookup, are obtained from configuration.
 */
enum class ExternalService private constructor(
        /**
         * This is the value in the configuration, i.e. stroom.services.<serviceKey>.name.
        </serviceKey> */
        val serviceKey: String, val providerStrategy: ProviderStrategy<String>) {

    //stroom index involves multiple calls to fetch the data iteratively so must be sticky
    INDEX("stroom", RandomStrategy<String>());

    /**
     * This is the name of the service, as obtained from configuration.
     */
    val baseServiceName: String
        get() {
            return PROP_KEY_PREFIX + serviceKey + NAME_SUFFIX
            return Preconditions.checkNotNull(StroomProperties.getProperty(propKey), "Property %s does not have a value but should", propKey)
        }

    val version: Int
        get() {
            return PROP_KEY_PREFIX + serviceKey + VERSION_SUFFIX
            return StroomProperties.getIntProperty(propKey, 1)
        }

    val versionedServiceName: String
        get() {
            val baseServiceName = baseServiceName
            return baseServiceName + "-v" + version
        }

    companion object {

        private val PROP_KEY_PREFIX = "stroom.services."
        private val NAME_SUFFIX = ".name"
        private val VERSION_SUFFIX = ".version"
        private val DOC_REF_TYPE_SUFFIX = ".docRefType"

        /**
         * This maps doc ref types to services. I.e. if someone has the doc ref type they can get an ExternalService.
         */
        private val docRefTypeToServiceMap = HashMap<String, ExternalService>()

        init {
            Stream.of(*ExternalService.values())
                    .forEach { externalService ->
                        val docRefType = StroomProperties.getProperty(
                                PROP_KEY_PREFIX + externalService.serviceKey + DOC_REF_TYPE_SUFFIX)
                        if (docRefType != null && !docRefType.isEmpty()) {
                            docRefTypeToServiceMap.put(docRefType, externalService)
                        }
                    }
        }

        fun getExternalService(docRefType: String): Optional<ExternalService> {
            Preconditions.checkNotNull(docRefType)
            return Optional.ofNullable(docRefTypeToServiceMap[docRefType])
        }
    }

}