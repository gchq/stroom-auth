INSERT INTO users (
    email,
    password_hash,
    comments,
    created_on,
    created_by_user)
VALUES (
    "admin",
    "$2a$10$THzPVeDX70fBaFPjZoY1fOXnCCAezhhYV/LO09w.3JKIybPgRMSiW",
    "Built-in admin user",
    CURRENT_TIMESTAMP,
    "Flyway migration: V2__Create_admin_user.sql"
)