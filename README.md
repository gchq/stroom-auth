# stroom-auth
Pre-release version of a Stroom authentication service.

## Migrating from a pre-6.0 Stroom
In Stroom 6.0 the responsibility for user identities moved from the Stroom core to this service. When upgrading from a pre-6.0 version of Stroom you must migrate users from Stroom to stroom-auth. You can use the `transform_user_extract.py` for this. Run with `--help` for help in using this script.

## Releasing to DockerHub
You can release an image to DockerHub by pushing a tag to GitHub. GitHub will tell Travis to build, and pass it the tag. Our CI build script, `travis.script.sh`, will do the build and push the image. It will do this for every push to master and it will do it for _certain_ tags. 

There are two images built in this repo: one for the service and one for the UI. These have separate release cycles, so one could be on `v1.0-beta.1` and one could be on `v1.0-beta.5`. This complicates the build slightly. If you want to release a tagged version you need to add a prefix to the tag, so Travis can detect whether it's for the UI or for the service. This prefix has to be in the right format to work. The formats are:
 - For a UI build prefix the tag with `ui_`, e.g. `ui_v1.0-beta.6`.
 - For a service build prefix the tag with `service_`, e.g. `service_v1.0-beta.7`.

Travis will strip the prefix when it builds the docker image. The end result is that DockerHub has sensible tags, e.g. `gchq/stroom-auth-ui:v1.0-beta.5` instead of `gchq/stroom-auth-ui:ui_v1.0-beta.5`. GitHub will retain the tag you pushed, i.e. the one with the prefix.

## stroom-auth-svc
A service that accepts HTTP requests for authentication, and returns JWS tokens.

### Usage
You can interrogate the service using HTTPie. 

#### Getting a JWS token
You can use this token to make requests to secured endpoints. The default email and password is `admin:admin`.
```
$ http POST localhost:8099/authentication/login email=admin password=admin 
```
If you install httpie-jwt-auth then yout httpie requests will be a little simpler. For example:

```
$ http --auth-type=jwt --auth="<TOKEN>" post http://192.168.1.4:8099/authentication/v1/isPasswordValid email=admin newPassword=bad_pwd
```

#### Getting all users
In the below you'd have to paste your JWS token.

The following would get all users, with 10 per page.
```
$ http GET 'http://localhost:8099/user/?fromEmail=&usersPerPage=10&orderBy=id' Authorization:"Bearer <TOKEN>"
```
The following would get users from testUser, with 10 per page.
```
$ http GET 'http://localhost:8099/user/?fromEmail=testUser&usersPerPage=2&orderBy=id' Authorization:"Bearer <TOKEN>"
```

## stroom-persistence
This module accesses the existing Stroom database. Eventually the relevant tables will be migrated to a service. But until then we'll access them in this fashion, using JOOQ.

### Making a database change in dev
Obviously you'll lose test data if you do this.

1. Stop the database container and delete it
2. Change the migrations to whatever SQL you need
3. Run the app to perform the migrations (or use the Flyway command line)
4. Delete the old models at `stroom-persistence/src/main/java/stroom`.
5. Run `./gradlew generateAuthdbJooqSchemaSource` to generate the models again
6. Restart app

### Dropping all tables
```sql
DROP TABLE json_web_key;
DROP TABLE tokens;
DROP TABLE users;
DROP TABLE token_types;
DROP TABLE schema_version;
```

### Getting a summary of tokens
```sql
SELECT t.id, tt.token_type, u.email, t.expires_on, t.comments 
FROM token_types AS tt, users AS u, tokens AS t 
WHERE tt.id=t.token_type_id AND u.id=t.user_id; 
```
