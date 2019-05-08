# stroom-auth
Pre-release version of a Stroom authentication service.

## Migrating from a pre-6.0 Stroom
In Stroom 6.0 the responsibility for user identities moved from the Stroom core to this service. When upgrading from a pre-6.0 version of Stroom you must migrate users from Stroom to stroom-auth. You can use the `transform_user_extract.py` for this. Run with `--help` for help in using this script.

## Releasing to DockerHub
You can release an image to DockerHub by pushing a tag to GitHub. GitHub will tell Travis to build, and pass it the tag. Our CI build script, `travis.script.sh`, will do the build and push the image. It will do this for every push to master and it will do it for _certain_ tags. 

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

1. Add your migrations.
2. Start and then stop the app so the migrations get run on your local database.
3. Run `./gradlew clean build -x test -x integrationTest -PjooqGeneration=true` to update the models
4. Commit your changes

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


## Re-generating the api client
If any of the models change, e.g. User, Token, then the Swagger clients should be updated. Do this as follows:
```
./gradlew generatedSwaggerDocumentation
./gradlew generateSwaggerApi
```
