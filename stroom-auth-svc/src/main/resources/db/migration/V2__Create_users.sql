/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

INSERT INTO users (
    email,
    password_hash,
    comments,
    created_on,
    created_by_user)
VALUES (
    "admin",
    "$2a$10$THzPVeDX70fBaFPjZoY1fOXnCCAezhhYV/LO09w.3JKIybPgRMSiW", -- admin
    "Built-in admin user",
    CURRENT_TIMESTAMP,
    "Flyway migration: V2__Create_users.sql"
);

INSERT INTO users (
    email,
    password_hash,
    state,
    comments,
    created_on,
    created_by_user)
VALUES (
    "authenticationResource",
    "Fake hash: this is a service user and doesn't have a password",
    "locked",
    "User account for the authenticationResource, which is for issuing tokens not for logging in: it's locked and must remain so.",
    CURRENT_TIMESTAMP,
    "Flyway migration: V2__Create_users.sql"
)