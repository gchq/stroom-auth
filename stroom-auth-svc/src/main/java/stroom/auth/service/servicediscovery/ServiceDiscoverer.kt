package stroom.auth.service.servicediscovery

import com.codahale.metrics.health.HealthCheck
import io.dropwizard.lifecycle.Managed
import org.apache.curator.x.discovery.ServiceDiscovery
import org.apache.curator.x.discovery.ServiceInstance
import org.apache.curator.x.discovery.ServiceProvider
import org.slf4j.LoggerFactory
import java.io.IOException
import java.util.*
import java.util.function.Consumer
import java.util.stream.Collectors

class ServiceDiscoverer(val serviceDiscoveryManager: ServiceDiscoveryManager) : Managed {
    override fun start() {
        //create the service providers once service discovery has started up
        serviceDiscoveryManager.registerStartupListener(Consumer<ServiceDiscovery<String>> { this::initProviders })
    }

    override fun stop() {
        serviceProviders.entries.forEach { entry ->
            try {
                entry.value.close()
            } catch (e: IOException) {
                LOGGER.error("Failed to close serviceProvider {} with error",
                        entry.key.getVersionedServiceName(), e)
            }
        }    }

    private val LOGGER = LoggerFactory.getLogger(ServiceDiscovererImpl::class.java)

    /*
    Note: When using Curator 2.x (Zookeeper 3.4.x) it's essential that service provider objects are cached by your
    application and reused. Since the internal NamespaceWatcher objects added by the service provider cannot be
    removed in Zookeeper 3.4.x, creating a fresh service provider for each call to the same service will
    eventually exhaust the memory of the JVM.
     */
    private val serviceProviders = HashMap<ExternalService, ServiceProvider<String>>()


    fun getServiceInstance(externalService: ExternalService): Optional<ServiceInstance<String>> {
        try {
            LOGGER.trace("Getting service instance for {}", externalService.getServiceKey())
            return Optional.ofNullable<ServiceProvider<String>>(serviceProviders.get(externalService))
                    .flatMap<ServiceInstance<String>> { stringServiceProvider ->
                        try {
                            return@Optional.ofNullable(serviceProviders.get(externalService))
                                    .flatMap Optional . ofNullable < ServiceInstance < String > > stringServiceProvider.instance
                        } catch (e: Exception) {
                            throw RuntimeException(e)
                        }
                    }
        } catch (e: Exception) {
            throw RuntimeException(e)
        }

    }

    private fun initProviders(serviceDiscovery: ServiceDiscovery<String>) {

        //Attempt to create ServiceProviders for each of the ExternalServices
        Arrays.stream(ExternalService.values()).forEach { externalService ->
            val serviceProvider = createProvider(serviceDiscovery, externalService)
            LOGGER.debug("Adding service provider {}", externalService.getVersionedServiceName())
            serviceProviders.put(externalService, serviceProvider)
        }

    }

    private fun createProvider(serviceDiscovery: ServiceDiscovery<String>, externalService: ExternalService): ServiceProvider<String> {
        val provider = serviceDiscovery.serviceProviderBuilder()
                .serviceName(externalService.getVersionedServiceName())
                .providerStrategy(externalService.getProviderStrategy())
                .build()
        try {
            provider.start()
        } catch (e: Exception) {
            LOGGER.error("Unable to start service provider for {}", externalService.getVersionedServiceName(), e)
        }

        return provider
    }

    @StroomShutdown
    fun shutdown() {

    }

    val health: HealthCheck.Result
        get() {
            if (serviceProviders.isEmpty()) {
                return HealthCheck.Result.unhealthy("No service providers found")
            } else {
                try {
                    val providers = serviceProviders.entries.stream()
                            .map({ entry ->
                                try {
                                    return@serviceProviders.entrySet().stream()
                                            .map entry . key . getVersionedServiceName () + " - " + entry.value.getAllInstances().size
                                } catch (e: Exception) {
                                    throw RuntimeException(String.format("Error querying instances for service %s",
                                            entry.key.getVersionedServiceName()), e)
                                }
                            })
                            .collect(Collectors.joining(","))
                    return HealthCheck.Result.healthy("Running. Services providers: " + providers)
                } catch (e: Exception) {
                    return HealthCheck.Result.unhealthy("Error getting service provider details, error: " + e.cause.message)
                }

            }
        }
}