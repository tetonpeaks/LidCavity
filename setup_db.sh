#!/bin/bash

# MySQL commands
mysql -u root -p <<EOF
USE velocity;
DROP TABLE IF EXISTS velocity, streamlineimgp, streamlineimg, pressure, displacement, cfd, convergence;
EOF

# Remove migrations folder
rm -rf migrations

flask db init
flask db migrate -m "Initial migration"
flask db upgrade
