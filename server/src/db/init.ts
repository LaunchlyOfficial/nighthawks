import { query } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');
        
        // Read the schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        console.log('Reading schema from:', schemaPath);
        
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found at ${schemaPath}`);
        }
        
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log('Schema file read successfully');

        // Split the schema into individual statements
        const statements = schema
            .split(';')
            .filter(stmt => stmt.trim())
            .map(stmt => stmt.trim() + ';');

        console.log(`Found ${statements.length} SQL statements to execute`);

        // Execute each statement separately
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            try {
                console.log(`Executing statement ${i + 1}/${statements.length}:`, statement.substring(0, 50) + '...');
                await query(statement);
                console.log(`Statement ${i + 1} executed successfully`);
            } catch (err) {
                console.error(`Error executing statement ${i + 1}:`, statement);
                console.error('Error details:', err);
                // Continue with other statements
            }
        }

        // Verify tables were created
        const tables = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

        console.log('Created tables:', tables.rows.map(r => r.table_name));
        console.log('Database schema initialized successfully');

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Run initialization
console.log('Starting database initialization script...');
initializeDatabase()
    .then(() => {
        console.log('Database initialization completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Fatal error during initialization:', error);
        process.exit(1);
    }); 