#!/bin/sh

psql ${POSTGRES_URI} -f /opt/sql/add_daily_transactions.sql