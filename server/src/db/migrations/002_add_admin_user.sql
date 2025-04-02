-- Add default admin user (password will be 'admin123' after hashing)
INSERT INTO users (username, password, role) 
VALUES (
  'admin',
  '$2b$10$5dwsS5snIRlKu8ka5r5UhuM5E6STqxEEKT9qS.5akz6kQVqK6.N1m', -- hashed 'admin123'
  'admin'
) ON CONFLICT (username) DO NOTHING; 