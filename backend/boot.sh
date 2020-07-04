#!/bin/bash

# upgrade the database
while true; do
    flask db upgrade
    if [[ "$?" == "0" ]]; then
        break
    fi
    echo Deploy command failed, retrying in 5 secs...
    sleep 5
done

# start the application
exec gunicorn -b 0.0.0.0:5000 -w 2 --threads=3 --access-logfile - --error-logfile - wsgi:app
