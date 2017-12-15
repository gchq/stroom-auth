# stroom-auth
Pre-release version of a Stroom authentication service.

## stroom-auth-svc
A service that accepts HTTP requests for authentication, and returns JWS tokens.

### Usage
You can interrogate the service using HTTPie. 

#### Getting a JWS token
You can use this token to make requests to secured endpoints. The default email and password is `admin:admin`.
```
$ http POST localhost:8099/authentication/login email=admin password=admin 
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
drop table json_web_key;
drop table tokens;
drop table users;
drop table token_types;
drop table schema_version;
```