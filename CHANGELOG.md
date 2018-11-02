# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).


## [Unreleased]

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

[Unreleased]: https://github.com/gchq/stroom-auth/compare/v1.0-beta.8...master
[v1.0-beta.8]: https://github.com/gchq/stroom-auth/compare/v0.1-beta.7...v0.1-beta.8
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
