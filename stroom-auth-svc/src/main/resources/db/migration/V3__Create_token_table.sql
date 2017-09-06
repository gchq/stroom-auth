-- Following Simon Holywell's style guide: http://www.sqlstyle.guide/

-- This migration creates tables and seed data for user and API tokens

CREATE TABLE token_types (
    id 				      MEDIUMINT NOT NULL AUTO_INCREMENT,
    token_type             VARCHAR(255) NOT NULL,
    PRIMARY KEY           (id),
    UNIQUE 			      (id)
) ENGINE=InnoDB DEFAULT CHARSET latin1;


INSERT INTO token_types (token_type) VALUES ("user");
INSERT INTO token_types (token_type) VALUES ("api");

CREATE TABLE tokens (
    id 				      MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id               MEDIUMINT NOT NULL, -- The token belongs to this user
    token_type_id         MEDIUMINT NOT NULL,
    token                 VARCHAR(255) NOT NULL,
    expires_on            TIMESTAMP NOT NULL,
    issued_on             TIMESTAMP NOT NULL,
    issued_by_user		  MEDIUMINT NOT NULL,
    enabled               BIT DEFAULT 1,
    updated_on 			  TIMESTAMP NULL,
    updated_by_user 	  VARCHAR(255) NULL,
    PRIMARY KEY           (id),
    UNIQUE 			      (id),
    CONSTRAINT            `fk_issued_to`
        FOREIGN KEY(user_id) REFERENCES users(id)
        ON DELETE CASCADE -- We want tokens to be removed when users are
        ON UPDATE RESTRICT, -- We don't want the user's ID changing if we have a token
    CONSTRAINT            `fk_token_type_id`
        FOREIGN KEY(token_type_id) REFERENCES token_types(id)
        ON DELETE CASCADE -- If we ever delete a token type we will want to delete these too
        ON UPDATE RESTRICT -- We don't want the token type's ID changing if we have a token
) ENGINE=InnoDB DEFAULT CHARSET latin1;
