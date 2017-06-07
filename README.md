# stroom-auth

Pre-release version of a Stroom authentication service.

## stroom-auth-svc
This module provides an authentication resource.

### Usage
You can test the service by using HTTPie:
```
$ http POST localhost:8080 username=admin password=admin 
```

## stroom-persistence
This module accesses the existing Stroom database. Eventually the relevant tables will be migrated to a service. But until then we'll access them in this fashion, using JOOQ.