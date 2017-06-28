package stroom.auth.service.servicediscovery

import com.codahale.metrics.health.HealthCheck
import com.google.common.base.Preconditions
import org.apache.curator.x.discovery.ServiceDiscovery
import org.apache.curator.x.discovery.ServiceInstance
import org.apache.curator.x.discovery.ServiceType
import org.apache.curator.x.discovery.UriSpec
import org.slf4j.LoggerFactory
import stroom.auth.service.Config
import java.net.InetAddress
import java.net.UnknownHostException
import java.util.*
import javax.inject.Inject

class ServiceRegistrar @Inject
constructor(config: Config) {

    var health: HealthCheck.Result? = null
    private val hostNameOrIpAddress: String
    private val servicePort: Int

    init {
        this.hostNameOrIpAddress = getHostOrIp(config)
        val httpPort = config.httpPort
        if(httpPort != null) {
            this.servicePort = config.httpPort
        }

        health = HealthCheck.Result.unhealthy("Not yet initialised...")
        this.serviceDiscoveryManager.registerStartupListener(???({ this.curatorStartupListener(it) }))
    }

    private fun getHostOrIp(config: Config): String {
        var hostOrIp = config.advertisedHost
        if (hostOrIp == null || hostOrIp!!.isEmpty()) {
            try {
                hostOrIp = InetAddress.getLocalHost().canonicalHostName
            } catch (e: UnknownHostException) {
                LOGGER.warn("Unable to determine hostname of this instance due to error. Will try to get IP address instead", e)
            }

            if (hostOrIp == null || hostOrIp!!.isEmpty()) {
                try {
                    hostOrIp = InetAddress.getLocalHost().hostAddress
                } catch (e: UnknownHostException) {
                    throw RuntimeException(String.format("Error establishing hostname or IP address of this instance"), e)
                }

            }
        }
        return hostOrIp
    }

    private fun curatorStartupListener(serviceDiscovery: ServiceDiscovery<String>) {
        try {
            val stringBuilder = StringBuilder()
            stringBuilder.append("Successfully registered the following services: ")

            val services = TreeMap<String, String>()
            Arrays.stream(RegisteredService.values())
                    .forEach { registeredService ->
                        val serviceInstance = registerResource(
                                registeredService,
                                serviceDiscovery)
                        services.put(registeredService.getVersionedServiceName(), serviceInstance.buildUriSpec())
                    }

            health = HealthCheck.Result.builder()
                    .healthy()
                    .withMessage("Services registered")
                    .withDetail("registered-services", services)
                    .build()

            LOGGER.info("All service instances created successfully.")
        } catch (e: Exception) {
            health = HealthCheck.Result.unhealthy("Service instance creation failed!", e)
            LOGGER.error("Service instance creation failed!", e)
            throw RuntimeException("Service instance creation failed!", e)
        }

    }

    private fun registerResource(registeredService: RegisteredService,
                                 serviceDiscovery: ServiceDiscovery<String>): ServiceInstance<String> {
        try {
            val uriSpec = UriSpec("{scheme}://{address}:{port}" +
                    ResourcePaths.ROOT_PATH +
                    registeredService.getVersionedPath())

            val serviceInstance = ServiceInstance.builder<String>()
                    .serviceType(ServiceType.DYNAMIC) //==ephemeral zk nodes so instance will disappear if we lose zk conn
                    .uriSpec(uriSpec)
                    .name(registeredService.getVersionedServiceName())
                    .address(hostNameOrIpAddress)
                    .port(servicePort)
                    .build()

            LOGGER.info("Attempting to register '{}' with service discovery at {}",
                    registeredService.getVersionedServiceName(), serviceInstance.buildUriSpec())

            Preconditions.checkNotNull(serviceDiscovery).registerService(serviceInstance)

            LOGGER.info("Successfully registered '{}' service.", registeredService.getVersionedServiceName())
            return serviceInstance
        } catch (e: Exception) {
            throw RuntimeException("Failed to register service " + registeredService.getVersionedServiceName(), e)
        }

    }

    companion object {
        private val LOGGER = LoggerFactory.getLogger(ServiceDiscoveryRegistrar::class.java)

        private val PROP_KEY_SERVICE_HOST_OR_IP = "stroom.serviceDiscovery.servicesHostNameOrIpAddress"
        private val PROP_KEY_SERVICE_PORT = "stroom.serviceDiscovery.servicesPort"
    }
}
