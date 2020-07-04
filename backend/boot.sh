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
exec gunicorn -b 0.0.0.0:5000 -w 3 wsgi:app --access-logfile - --error-logfile -
