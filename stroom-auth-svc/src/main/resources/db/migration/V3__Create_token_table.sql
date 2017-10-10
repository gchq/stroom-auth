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
INSERT INTO token_types (token_type) VALUES ("email_reset");

CREATE TABLE tokens (
    id 				      MEDIUMINT NOT NULL AUTO_INCREMENT,
    user_id               MEDIUMINT NOT NULL, -- The token belongs to this user
    token_type_id         MEDIUMINT NOT NULL,
    token                 VARCHAR(255) NOT NULL,
    expires_on            TIMESTAMP NULL,
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
    CONSTRAINT            `fk_issued_by_user`
        FOREIGN KEY(issued_by_user) REFERENCES users(id)
        ON DELETE CASCADE -- We want tokens to be removed when users are
        ON UPDATE RESTRICT, -- We don't want the user's ID changing if we have a token
    CONSTRAINT            `fk_token_type_id`
        FOREIGN KEY(token_type_id) REFERENCES token_types(id)
        ON DELETE CASCADE -- If we ever delete a token type we will want to delete these too
        ON UPDATE RESTRICT -- We don't want the token type's ID changing if we have a token
) ENGINE=InnoDB DEFAULT CHARSET latin1;
