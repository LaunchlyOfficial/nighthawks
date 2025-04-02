-- Drop existing tables in correct order
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS crime_reports CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS permission_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table first (other tables depend on it)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create crime_reports table
CREATE TABLE IF NOT EXISTS crime_reports (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    incident_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    reviewed_by INTEGER REFERENCES users(id),
    assigned_to INTEGER REFERENCES users(id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES crime_reports(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    position TEXT NOT NULL,
    experience TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    motivation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    reviewed_by INTEGER REFERENCES users(id)
);

-- Create permission_requests table
CREATE TABLE IF NOT EXISTS permission_requests (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    website_url TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    testing_scope TEXT NOT NULL,
    categories TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, password, role)
VALUES (
    'nighthawk_admin_2024',
    -- This is a bcrypt hash of 'admin123'
    '$2b$10$5dwsS5snIRlKu8ka5r5UhuM5E6STqxEEKT9qS.5akz6kQVqK6.N1m',
    'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert some test reports
INSERT INTO crime_reports (name, incident_type, description, status)
VALUES 
    ('Test Report 1', 'Phishing', 'Suspicious email received', 'pending'),
    ('Test Report 2', 'Malware', 'System acting strange', 'investigating'),
    ('Test Report 3', 'DDoS', 'Website down', 'resolved')
ON CONFLICT DO NOTHING; 