package stroom.auth.service.servicediscovery

import com.codahale.metrics.health.HealthCheck
import com.google.common.base.Preconditions
import io.dropwizard.lifecycle.Managed
import org.apache.curator.framework.CuratorFramework
import org.apache.curator.framework.CuratorFrameworkFactory
import org.apache.curator.x.discovery.ServiceDiscovery
import org.apache.curator.x.discovery.ServiceDiscoveryBuilder
import org.slf4j.LoggerFactory
import stroom.auth.service.Config
import java.io.Closeable
import java.util.*
import java.util.concurrent.CompletableFuture
import java.util.concurrent.atomic.AtomicReference
import java.util.function.Consumer

class ServiceDiscoveryManager(config: Config) : Managed {


    private val curatorConfig: Config.Curator = config.curator
    private val logger = LoggerFactory.getLogger(ServiceDiscoveryManager::class.java)

    private val curatorFrameworkRef = AtomicReference<CuratorFramework>()
    private val serviceDiscoveryRef = AtomicReference<ServiceDiscovery<String>>()
    private val curatorStartupListeners = ArrayList<Consumer<ServiceDiscovery<String>>>()

    @Volatile private var health: HealthCheck.Result? = null
    private val closeables = ArrayList<Closeable>()

    override fun start() {
        health = HealthCheck.Result.unhealthy("Initialising Curator Connection...")

        //Try and start the connection with ZK in another thread to prevent connection problems from stopping the bean
        //creation and application startup, then start ServiceDiscovery and notify any listeners
        CompletableFuture.runAsync { this.startCurator() }
                .thenRun { this.startServiceDiscovery() }
                .thenRun { this.notifyListeners() }
                .exceptionally { throwable ->
                    logger.error("Error initialising service discovery", throwable)
                    health = HealthCheck.Result.unhealthy("Failed to initialise service discovery due to error: " + throwable.message)
                    null
                }
    }

    override fun stop() {
        closeables.forEach { closeable ->
            if (closeable != null) {
                try {
                    closeable.close()
                } catch (e: Exception) {
                    logger.error("Error while closing {}", closeable.javaClass.canonicalName, e)
                }

            }
        }
    }

//    init {
//        health = HealthCheck.Result.unhealthy("Initialising Curator Connection...")
//
//        //try and start the connection with ZK in another thread to prevent connection problems from stopping the bean
//        //creation and application startup, then start ServiceDiscovery and notify any listeners
//        CompletableFuture.runAsync { this.startCurator() }
//                .thenRun { this.startServiceDiscovery() }
//                .thenRun { this.notifyListeners() }
//                .exceptionally { throwable ->
//                    logger.error("Error initialising service discovery", throwable)
//                    health = HealthCheck.Result.unhealthy("Failed to initialise service discovery due to error: " + throwable.message)
//                    null
//                }
//    }

    val serviceDiscovery: Optional<ServiceDiscovery<String>>
        get() = Optional.ofNullable(serviceDiscoveryRef.get())

    fun registerStartupListener(listener: Consumer<ServiceDiscovery<String>>) {
        curatorStartupListeners.add(Preconditions.checkNotNull(listener))
    }


    private fun startCurator() {
        val curatorFramework = CuratorFrameworkFactory.newClient(curatorConfig.zookeeperQuorum, curatorConfig.retryPolicy)
        logger.info("Starting Curator client using Zookeeper at '{}'", curatorConfig.zookeeperQuorum)
        curatorFramework.start()
        closeables.add(curatorFramework)

        val wasSet = curatorFrameworkRef.compareAndSet(null, curatorFramework)
        if (!wasSet) {
            logger.error("Attempt to set curatorFrameworkRef when already set")
        } else {
            health = HealthCheck.Result.unhealthy("Curator client started, initialising service discovery...")
            logger.info("Started Curator client using Zookeeper at '{}'", curatorConfig.zookeeperQuorum)
        }
    }

    private fun startServiceDiscovery() {
        val serviceDiscovery = ServiceDiscoveryBuilder
                .builder(String::class.java)
                .client(Preconditions.checkNotNull(curatorFrameworkRef.get(), "curatorFramework should not be null at this point"))
                .basePath(curatorConfig.zookeeperBasePath)
                .build()

        try {
            serviceDiscovery.start()
            closeables.add(serviceDiscovery)
            val wasSet = serviceDiscoveryRef.compareAndSet(null, serviceDiscovery)
            if (!wasSet) {
                logger.error("Attempt to set serviceDiscoveryRef when already set")
            } else {
                logger.info("Successfully started ServiceDiscovery on path " + curatorConfig.zookeeperBasePath)
            }

        } catch (e: Exception) {
            throw RuntimeException(String.format("Error starting ServiceDiscovery with base path %s", curatorConfig.zookeeperBasePath), e)
        }

    }

    private fun notifyListeners() {
        if (serviceDiscoveryRef.get() != null) {
            //now notify all listeners
            curatorStartupListeners.forEach { listener -> listener.accept(serviceDiscoveryRef.get()) }
        } else {
            logger.error("Unable to notify listeners of serviceDiscovery starting, serviceDiscovery is null")
        }
    }





//    fun getHealth(): HealthCheck.Result {
//        val serviceDiscovery = serviceDiscoveryRef.get()
//        if (serviceDiscovery != null) {
//            try {
//                val services = ArrayList(serviceDiscovery.queryForNames())
//
//                val serviceInstanceMap = Preconditions.checkNotNull<List<String>>(services).stream()
//                        .flatMap<ServiceInstance<String>> { serviceName ->
//                            try {
//                                return@Preconditions.checkNotNull(services).stream()
//                                        .flatMap serviceDiscovery !!. queryForInstances serviceName.stream()
//                            } catch (e: Exception) {
//                                throw RuntimeException("Error getting service instances for " + serviceName)
//                            }
//                        }
//                        .map { serviceInstance -> Tuple2(serviceInstance.getName(), serviceInstance.buildUriSpec()) }
//                        .collect(Collectors.groupingBy(Function<T, K> { Tuple2._1() }, Collectors.mapping(Function<T, U> { Tuple2._2() }, Collectors.toList<T>())))
//
//                return HealthCheck.Result.builder()
//                        .healthy()
//                        .withMessage("Service discovery running")
//                        .withDetail("service-instances", serviceInstanceMap)
//                        .build()
//
//            } catch (e: Exception) {
//                return HealthCheck.Result.unhealthy("Error while querying available services, %s", e.message)
//            }
//
//        }
//        return HealthCheck.Result.unhealthy("ServiceDiscovery is null")
//    }
//
//    companion object {
//
//        private val LOGGER = LoggerFactory.getLogger(ServiceDiscoveryManager::class.java)
//
//        val PROP_KEY_ZOOKEEPER_QUORUM = "stroom.serviceDiscovery.zookeeperUrl"
//        val PROP_KEY_CURATOR_BASE_SLEEP_TIME_MS = "stroom.serviceDiscovery.curator.baseSleepTimeMs"
//        val PROP_KEY_CURATOR_MAX_SLEEP_TIME_MS = "stroom.serviceDiscovery.curator.maxSleepTimeMs"
//        val PROP_KEY_CURATOR_MAX_RETRIES = "stroom.serviceDiscovery.curator.maxRetries"
//        val PROP_KEY_ZOOKEEPER_BASE_PATH = "stroom.serviceDiscovery.zookeeperBasePath"
//    }

}
