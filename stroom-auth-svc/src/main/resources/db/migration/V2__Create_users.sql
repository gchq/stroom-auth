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