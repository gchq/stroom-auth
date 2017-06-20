INSERT INTO users (
    name,
    is_login_expired,
    password_hash,
    created_on,
    created_by_user)
VALUES (
    "admin",
    0,
    "$2a$10$THzPVeDX70fBaFPjZoY1fOXnCCAezhhYV/LO09w.3JKIybPgRMSiW",
    CURRENT_TIMESTAMP,
    "Flyway migration: V2__Create_admin_user.sql"
)