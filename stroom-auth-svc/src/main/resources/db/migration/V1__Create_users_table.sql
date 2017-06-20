-- Following Simon Holywell's style guide: http://www.sqlstyle.guide/
CREATE TABLE users (
  id 				    MEDIUMINT NOT NULL AUTO_INCREMENT,
  name				    VARCHAR(255) NOT NULL,
  last_login            TIMESTAMP NULL,
  password_hash         VARCHAR(255) NOT NULL,
  total_login_failures  INT DEFAULT 0,
  created_on 			TIMESTAMP NULL,
  created_by_user		VARCHAR(255) NULL,
  updated_on 			TIMESTAMP NULL,
  updated_by_user 		VARCHAR(255) NULL,
  PRIMARY KEY           (id),
  UNIQUE 			    (name)
) ENGINE=InnoDB DEFAULT CHARSET latin1;
