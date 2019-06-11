# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [v7.0-alpha.1] - 2019-06-11

- Update paths

## [v1.0-beta.32] - 2019-05-08

- Move stroom-auth-ui to stroom-ui

* Issue **#91**: Allow an admin to specify that a user must change password at next login

* Issue **#107**: Remove the 'password has been reset, prepare for redirection' page

## [v1.0-beta.31] - 2019-03-25

* FIx issue in an integration test

## [v1.0-beta.30] - 2019-03-25

* Issue #140: Fix user deactivation that can occur soon after reactivation

* Uplift base docker image to openjdk:8u191-jdk-alpine3.9, reverting back to JDK for access to diagnostic tools.

## [v1.0-beta.29] - 2019-02-05

* Change service docker image base to openjdk:8u181-jre-alpine3.8

## [v1.0-beta.28] - 2019-02-05

* Issue **#129**: Update authorisation user's status when authentication user's status is changed

## [v1.0-beta.27] - 2019-01-29

* Improve logging

## [v1.0-beta.26] - 2019-01-15

* Issue #126: Fix new API key page

* Issue **#109**: Button on Change Password page does not disable when clicked

* Issue **#67**: Clear out obsolete dependencies in `public`

## [v1.0-beta.25] - 2019-01-03

* Update JOSE library

* Fix broken drop-down

* Make transform_user_extract.py Python 2.6 compatible and without dependencies 

## [v1.0-beta.24] - 2019-01-02

* Issue **#123**: Disable authorisation users when an authentication user is deleted

## [v1.0-beta.23] - 2019-01-02

* Issue **#124**: Add 5 -> 6 migration script

## [v1.0-beta.22] - 2018-12-21

* Issue **#113** : Add 'disabled' status

* Issue **#111** : Fix button enable events

* Issue **#120** : Improve text size

* Issue **#119** : Improve heading alignment

* Issue **#118** : Improve logging

## [v1.0-beta.21] - 2018-12-19

* Issue **#111** : Changing a User status from Inactive to Locked doesn't enable the save button

* Issue **#112** : Only active accounts should be considered for scheduled inactivity checks

* Issue **#114** : Improve copy of account statuses

* Issue **#115** : It should not be possible to manually set an account as 'inactive'

* Issue **#117** : Improve logging

* Issue **#121** : Users with certificates should not be able to log in unless they have a user account

## [v1.0-beta.20] - 2018-12-18

* Issue **#116** : Update expired developer API keys

* Issue **#102** : Fix bad redirect after an email-based password reset

* Issue **#103** : Disabling new and new but inactive accounts uses the same number of minutes

* Issue **#104** : Password validation layout

* Issue **#105** : Password field is not mandatory when creating a user

* Issue **#106** : No validation on the API creation page

* Issue **#110** : Active PKI users are marked as Inactive in the Users tab

## [v1.0-beta.19]

* Issue **#101** : Fix issue where 'account locked' message was only displayed once.

## [v1.0-beta.18]

* Issue **#100** : Make forms more responsive

* Issue **#99** : Add a 'never expires' option to API keys

* Issue **#97** : Fix 'invalid date' on audit information

* Add GIT_TAG & GIT_COMMIT build args to service docker build in Travis.

## [v1.0-beta.17] - 2018-12-07

* Issue **gchq/stroom/#937** : Add setting of container identity in extra_headers file to docker image.

## [v1.0-beta.16]

* Issue **#96** : Fixed an issue where the user select box is initially empty when trying to create an API key

* Issue **#96** : Change password integrity checks from days to minutes to make manual testing feasible

* Issue **#94** : Fixed account becoming locked after being made active

* Issue **#93** : Fixed issue where re-creating a user caused an error

## [v1.0-beta.15]

* Change logback archived logs to be gzip compressed

## [v1.0-beta.14]

* Allow password resets by email to be enabled and disabled

## [v1.0-beta.13]

* Remove Material UI and replacing with our current styles

* Switch from Redux Form to Formik

* Improve validation for passwords

* Add curl back into the service docker image

## [v1.0-beta.12]

* Remove log sending process from service docker image

* Add git_tag and git_commit labels to docker images

## [v1.0-beta.11]

* Stop truncation of `logger` in logback console logs

* Add colours to docker console logs

## [v1.0-beta.10]

* Issue **gchq/stroom#874** : Added configurable password complexity.

* Removed Material-UI from the User and API Key areas.

* Refactored classes into stateless functional components.

* Added loading spinners to buttons and edit pages.

* Improved validation messages

* Many UI and UX improvements

## [v1.0-beta.9]

* Uplift service docker image base to openjdk:8u181-jdk-alpine3.8

## [v1.0-beta.8]

* Downgrade to java 8 for compatibility with stroom v6

## [v1.0-beta.7]

* Fix bintray upload

## [v1.0-beta.6]

* Issue **gchq/stroom#877** : State -> Account status

* Issue **gchq/stroom#877** : Enabled/disabled -> Active/Inactive

* Issue **gchq/stroom#876** : Prevent error if a reset email doesn't exist

* Issue **gchq/stroom#876** : Allow enabling/disabling of password resets

* Issue **gchq/stroom#876** : Added a back to login button

* Issue **gchq/stroom#876** : Add back button, improve copy

* Add password complexity rules

* Fix sending of logs to stroom in the docker containers

* Change logback logFormat to be consistent with stroom

## [v1.0-beta.5]

* Add Java opts configuration to service docker build

## [v1.0-beta.4]

* Refactor Dockerfiles - add non-root user, add tini/gosu, reduce image size

## [v1.0-beta.2]

## [v0.1-alpha.14]

* Issue **#81** : Remove wait-for-it

* Issue **#80** : Improve Flyway migration failure handling

* Issue **#71** : Show an error message if a users account is locked

* Issue **#78** : Allow run-time changes to log levels

* Issue **#58** : Add mandatory password changes

* Issue **#84** : Require password change on first use

* Issue **#85** : Focus on username field when the login page loads

[Unreleased]: https://github.com/gchq/stroom-auth/compare/v7.0-alpha.1...master
[v7.0-alpha.1]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.32...v7.0-alpha.1
[v1.0-beta.32]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.31...v1.0-beta.32
[v1.0-beta.31]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.30...v1.0-beta.31
[v1.0-beta.30]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.29...v1.0-beta.30
[v1.0-beta.29]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.28...v1.0-beta.29
[v1.0-beta.28]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.27...v1.0-beta.28
[v1.0-beta.27]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.26...v1.0-beta.27
[v1.0-beta.26]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.25...v1.0-beta.26
[v1.0-beta.25]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.24...v1.0-beta.25
[v1.0-beta.24]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.23...v1.0-beta.24
[v1.0-beta.23]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.22...v1.0-beta.23
[v1.0-beta.22]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.21...v1.0-beta.22
[v1.0-beta.21]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.20...v1.0-beta.21
[v1.0-beta.20]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.19...v1.0-beta.20
[v1.0-beta.19]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.18...v1.0-beta.19
[v1.0-beta.18]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.17...v1.0-beta.18
[v1.0-beta.17]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.16...v1.0-beta.17
[v1.0-beta.16]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.15...v1.0-beta.16
[v1.0-beta.15]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.14...v1.0-beta.15
[v1.0-beta.14]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.13...v1.0-beta.14
[v1.0-beta.13]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.12...v1.0-beta.13
[v1.0-beta.12]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.11...v1.0-beta.12
[v1.0-beta.11]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.10...v1.0-beta.11
[v1.0-beta.10]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.9...v1.0-beta.10
[v1.0-beta.9]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.8...v1.0-beta.9
[v1.0-beta.8]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.7...v1.0-beta.8
[v1.0-beta.7]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.6...v0.1-beta.7
[v1.0-beta.6]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.5...v0.1-beta.6
[v1.0-beta.5]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.4...v0.1-beta.5
[v1.0-beta.4]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.2...v0.1-beta.4
[v1.0-beta.2]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.14...v0.1-beta.2
[v0.1-alpha.14]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.13...v0.1-alpha.14
[v0.1-alpha.13]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.11...v0.1-alpha.13
[v0.1-alpha.11]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.10...v0.1-alpha.11
[v0.1-alpha.10]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.8...v0.1-alpha.10
[v0.1-alpha.8]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.7...v0.1-alpha.8
[v0.1-alpha.7]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.6...v0.1-alpha.7
[v0.1-alpha.6]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.5...v0.1-alpha.6
[v0.1-alpha.5]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.4...v0.1-alpha.5
[v0.1-alpha.4]: https://github.com/gchq/stroom-auth/compare/v0.1-alpha.3...v0.1-alpha.4
