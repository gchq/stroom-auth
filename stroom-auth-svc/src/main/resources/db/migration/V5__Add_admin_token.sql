

INSERT INTO tokens(
    user_id,
    token_type_id,
    token,
    issued_on,
    issued_by_user
)
VALUES (
    (SELECT id FROM users WHERE email = 'admin'),
    (SELECT id FROM token_types WHERE token_type = 'api'),
    -- This token is for admin and doesn't have an expiration.
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InN0cm9vbSJ9.NLTH0YNedtKsco0E6jWTcPYV3AW2mLlgLf5TVxXVa-I',
    NOW(),
    (SELECT id FROM users WHERE email = 'admin')
);