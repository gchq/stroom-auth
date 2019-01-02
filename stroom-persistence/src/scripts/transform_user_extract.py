#!/usr/bin/env python
"""
Transforms an SQL extract of pre-6.0 Stroom users to 6.0 users, ready for import to the stroom-auth database. If you're upgrading to Stroom 6.0 then this is a necessary step.

This scripts expects the input TSV to have the following colums: NAME, STAT. If a user already exists it won't try and insert that user.

You could use something like the following SQL to dump the users from Stroom into a TSV:
    echo 'SELECT NAME, STAT FROM USR' | mysql -h"192.168.1.9" -P"3307" -u"stroomuser" -p"stroompassword1" stroom > user_extract.tsv

If you have the right permissions you could also get the extract like this by executing the following in mysql:
    SELECT NAME, STAT INTO OUTFILE './user_extract.tsv' FROM USR;

Usage: 
transform_user_extract.py <input_tsv> <output_sql>

E.g. 
./transform_user_extract.py user_extract.tsv transformed_users.sql
"""

import csv
import datetime
from docopt import docopt

def transform(input_tsv, output_sql):
    status_mapping = {
        0: "enabled",
        1: "disabled",
        2: "locked",
        3: "inactive"
    }

    password = "'No password set'"
    comment = "'This user was created during the upgrade to Stroom 6'"
    created_by = "'transform_user_extract.py'"
    created_on = datetime.datetime.now().isoformat()

    insert_template = """
    INSERT IGNORE INTO users (
        email,
        password_hash,
        state,
        comments,
        created_on,
        created_by_user)
    VALUES (
        '{0}',
        'No password set',
        '{1}',
        'This user was created during the upgrade to Stroom 6',
        '{2}',
        'transform_user_extract.py' 
    );"""

    with open(input_tsv,'rb') as tsvin, open(output_sql, 'w') as sqlout:
        tsvin = csv.reader(tsvin, delimiter='\t')
       
        # Remove the headers so we don't try to process them later
        headers = next(tsvin, None)

        processed = 0
        total = 0

        for row in tsvin:
            total += 1
            print "Adding row:"
            print "\tin:\t {0},{1}".format(row[0], row[1])

            email = row[0]
            status = status_mapping.get(int(row[1]))


            if status is None:
                print "\tout:\t ERROR! Couldn't map the status"
            else:
                print "\tout:\t {0},{1}".format(row[0], status)
                processed += 1
                sqlout.write(insert_template.format(email, status, created_on))
        
        print "Processed {0} users".format(processed)
        if total != processed:
            print "Unable to process {0} user(s).".format(total - processed)

def main():
    arguments = docopt(__doc__, version='v1.0')
    input_tsv = arguments["<input_tsv>"]
    output_sql = arguments["<output_sql>"]

    transform(input_tsv, output_sql)

if __name__ == '__main__':
    main() 
