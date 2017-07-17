-- Following Simon Holywell's style guide: http://www.sqlstyle.guide/
CREATE TABLE users (
    id 				      MEDIUMINT NOT NULL AUTO_INCREMENT,
    email                 VARCHAR(255) NOT NULL,
    password_hash         VARCHAR(255) NOT NULL,
    state                 TINYINT DEFAULT 0, -- 0 = enabled, 1 = disabled, 2 = locked
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
