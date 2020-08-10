#!/bin/sh

# Add the daily job crontab
crontab /etc/crontabs/daily-jobs

# start the cron servervice
crond -f
