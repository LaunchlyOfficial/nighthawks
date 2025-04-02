@echo off
echo Initializing database...

REM Set the password
set PGPASSWORD=774616

REM Drop and recreate the database
psql -U postgres -c "DROP DATABASE IF EXISTS nighthawk;"
psql -U postgres -c "CREATE DATABASE nighthawk;"

REM Run the schema file
psql -U postgres -d nighthawk -f src/db/schema.sql

REM Clear the password
set PGPASSWORD=

echo Database initialization complete. 