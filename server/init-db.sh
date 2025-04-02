#!/bin/bash
PGPASSWORD=774616 psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS nighthawk;"
PGPASSWORD=774616 psql -U postgres -d postgres -c "CREATE DATABASE nighthawk;"
PGPASSWORD=774616 psql -U postgres -d nighthawk -f src/db/schema.sql 