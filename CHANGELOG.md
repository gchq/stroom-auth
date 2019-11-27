# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

* Rename migration scripts so that scripts released in v6 are unchanged.

* Stop exchanging accessCode for idToken in UI, so that the client secret can be back-channel.

* Made session cookie `Secure` and `HttpOnly`.

* Issue **#151**: Reset last login to prevent premature disabling of accounts

* Issue **#125**: Make dates display as ISO 8601

* Issue **#161**: Tidy up duplicate API keys

* Add null pointer protection to AppPermissionsClient


## [v7.0-beta.3] - 2019-10-04

* Add fallback config.yml file into the docker image for running outside of a stack.


## [v7.0-beta.2] - 2019-09-13

* Merge changes from 6.0


## [v7.0-beta.1] - 2019-09-11

* Upgrade to Java 12 and Gradle 5.

* Fix migration file naming so upgrading from 6.0 works.


## [v7.0-alpha.1] - 2019-06-11

* Update paths

* Move stroom-auth-ui to stroom-ui

* Issue **#91**: Allow an admin to specify that a user must change password at next login

* Issue **#107**: Remove the 'password has been reset, prepare for redirection' page

* Issue **#154**: Redirect URL is now encoded and params are guarded

* Issue **#149**: Remove config yaml from docker image

* Update paths for routing changes

* Update paths for routing changes

* Update paths for routing changes

* Issue **#142**: Change jooq generation/configuration to allow differne DB name to be used.


## v1.0-beta.32 - 2019-05-08

* No changes. Version skipped.

* FIx issue in an integration test

* Issue **#140**: Fix user deactivation that can occur soon after reactivation

* Uplift base docker image to openjdk:8u191-jdk-alpine3.9, reverting back to JDK for access to diagnostic tools.

* Change service docker image base to openjdk:8u181-jre-alpine3.8

* Issue **#129**: Update authorisation user's status when authentication user's status is changed

* Improve logging

* Issue **#126**: Fix new API key page

* Issue **#109**: Button on Change Password page does not disable when clicked

* Issue **#67**: Clear out obsolete dependencies in `public`

* Update JOSE library

* Fix broken drop-down

* Make transform_user_extract.py Python 2.6 compatible and without dependencies 

* Issue **#123**: Disable authorisation users when an authentication user is deleted

* Issue **#124**: Add 5 -> 6 migration script

* Issue **#113** : Add 'disabled' status

* Issue **#111** : Fix button enable events

* Issue **#120** : Improve text size

* Issue **#119** : Improve heading alignment

* Issue **#118** : Improve logging

* Issue **#111** : Changing a User status from Inactive to Locked doesn't enable the save button

* Issue **#112** : Only active accounts should be considered for scheduled inactivity checks

* Issue **#114** : Improve copy of account statuses

* Issue **#115** : It should not be possible to manually set an account as 'inactive'

* Issue **#117** : Improve logging

* Issue **#121** : Users with certificates should not be able to log in unless they have a user account

* Issue **#116** : Update expired developer API keys

* Issue **#102** : Fix bad redirect after an email-based password reset

* Issue **#103** : Disabling new and new but inactive accounts uses the same number of minutes

* Issue **#104** : Password validation layout

* Issue **#105** : Password field is not mandatory when creating a user

* Issue **#106** : No validation on the API creation page

* Issue **#110** : Active PKI users are marked as Inactive in the Users tab

* Issue **#101** : Fix issue where 'account locked' message was only displayed once.

* Issue **#100** : Make forms more responsive

* Issue **#99** : Add a 'never expires' option to API keys

* Issue **#97** : Fix 'invalid date' on audit information

* Add GIT_TAG & GIT_COMMIT build args to service docker build in Travis.

* Issue **gchq/stroom/#937** : Add setting of container identity in extra_headers file to docker image.

* Issue **#96** : Fixed an issue where the user select box is initially empty when trying to create an API key

* Issue **#96** : Change password integrity checks from days to minutes to make manual testing feasible

* Issue **#94** : Fixed account becoming locked after being made active

* Issue **#93** : Fixed issue where re-creating a user caused an error

* Change logback archived logs to be gzip compressed

* Allow password resets by email to be enabled and disabled

* Remove Material UI and replacing with our current styles

* Switch from Redux Form to Formik

* Improve validation for passwords

* Add curl back into the service docker image

* Remove log sending process from service docker image

* Add git_tag and git_commit labels to docker images

* Stop truncation of `logger` in logback console logs

* Add colours to docker console logs

* Issue **gchq/stroom#874** : Added configurable password complexity.

* Removed Material-UI from the User and API Key areas.

* Refactored classes into stateless functional components.

* Added loading spinners to buttons and edit pages.

* Improved validation messages

* Many UI and UX improvements

* Uplift service docker image base to openjdk:8u181-jdk-alpine3.8

* Downgrade to java 8 for compatibility with stroom v6

* Fix bintray upload

* Issue **gchq/stroom#877** : State -> Account status

* Issue **gchq/stroom#877** : Enabled/disabled -> Active/Inactive

* Issue **gchq/stroom#876** : Prevent error if a reset email doesn't exist

* Issue **gchq/stroom#876** : Allow enabling/disabling of password resets

* Issue **gchq/stroom#876** : Added a back to login button

* Issue **gchq/stroom#876** : Add back button, improve copy

* Add password complexity rules

* Fix sending of logs to stroom in the docker containers

* Change logback logFormat to be consistent with stroom

* Add Java opts configuration to service docker build

* Refactor Dockerfiles - add non-root user, add tini/gosu, reduce image size

* Issue **#81** : Remove wait-for-it

* Issue **#80** : Improve Flyway migration failure handling

* Issue **#71** : Show an error message if a users account is locked

* Issue **#78** : Allow run-time changes to log levels

* Issue **#58** : Add mandatory password changes

* Issue **#84** : Require password change on first use

* Issue **#85** : Focus on username field when the login page loads

[Unreleased]: https://github.com/gchq/stroom-auth/compare/v7.0-beta.3...master
[v7.0-beta.3]: https://github.com/gchq/stroom-auth/compare/v7.0-beta.2...v7.0-beta.3
[v7.0-beta.2]: https://github.com/gchq/stroom-auth/compare/v7.0-beta.1...v7.0-beta.2
[v7.0-beta.1]: https://github.com/gchq/stroom-auth/compare/v7.0-alpha.1...v7.0-beta.1
[v7.0-alpha.1]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.32...v7.0-alpha.1
