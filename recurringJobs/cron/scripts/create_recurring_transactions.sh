#!/bin/sh

psql ${POSTGRES_URI} -f /opt/add_daily_transactions.sql