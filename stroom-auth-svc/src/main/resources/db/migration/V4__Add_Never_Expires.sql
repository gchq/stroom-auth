ALTER TABLE users
ADD never_expires bit default 0;

UPDATE users SET never_expires=0 WHERE never_expires is NULL;