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
CREATE TABLE users (
    id 				      MEDIUMINT NOT NULL AUTO_INCREMENT,
    email                 VARCHAR(255) NOT NULL,
    password_hash         VARCHAR(255) NOT NULL,
    state                 VARCHAR(10) DEFAULT 'enabled', -- enabled, disabled, locked
    first_name            VARCHAR(255),
    last_name             VARCHAR(255),
    comments              TEXT NULL,
    login_failures        INT DEFAULT 0,
    login_count           INT DEFAULT 0,
    last_login            TIMESTAMP NULL,
    created_on 			  TIMESTAMP NULL,
    created_by_user		  VARCHAR(255) NULL,
    updated_on 			  TIMESTAMP NULL,
    updated_by_user 	  VARCHAR(255) NULL,
    PRIMARY KEY           (id),
    UNIQUE 			      (email)
) ENGINE=InnoDB DEFAULT CHARSET latin1;
