-- Drop existing tables if they exist
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS permission_requests CASCADE;
DROP TABLE IF EXISTS crime_reports CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS role_type;

-- Create role_type enum first
CREATE TYPE role_type AS ENUM ('user', 'admin', 'super_admin', 'analyst', 'moderator');

-- Create fresh tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role role_type DEFAULT 'user',
    full_name VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modify users table to use the new role type
ALTER TABLE users 
    ALTER COLUMN role TYPE role_type 
    USING role::role_type;

-- Add more columns to users table
ALTER TABLE users 
    ADD COLUMN last_login TIMESTAMP WITH TIME ZONE,
    ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Crime reports table
CREATE TABLE crime_reports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permission requests table
CREATE TABLE permission_requests (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    testing_scope TEXT NOT NULL,
    categories TEXT[] NOT NULL,
    requested TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    position VARCHAR(100) DEFAULT 'Security Analyst',
    skills TEXT[] NOT NULL,
    experience TEXT NOT NULL,
    reason TEXT NOT NULL,
    resume TEXT,
    status VARCHAR(50) DEFAULT 'new',
    reviewed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    type VARCHAR(50) NOT NULL,
    reporter_id INTEGER,
    assigned_to INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES reports(id),
    user_id INTEGER,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Join requests table
CREATE TABLE IF NOT EXISTS join_requests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    position VARCHAR(100) NOT NULL,
    experience TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    motivation TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    reviewer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_crime_reports_status ON crime_reports(status);
CREATE INDEX idx_permission_requests_status ON permission_requests(status);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_users_role ON users(role);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crime_reports_updated_at
    BEFORE UPDATE ON crime_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_permission_requests_updated_at
    BEFORE UPDATE ON permission_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Note: Admin user will be created by the server on startup using credentials from .env 

-- Add index for faster queries
CREATE INDEX idx_permission_requests_created_at ON permission_requests(created_at DESC);

-- Add index for faster comment retrieval
CREATE INDEX idx_comments_report_id ON comments(report_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(type);

-- Add index for faster status queries
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status); 