import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testAuth() {
    const password = 'Password';  // The password we want to use
    
    // Generate hash
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('\nGenerated hash:', hash);
    
    // Test verification
    const isValid = await bcrypt.compare(password, hash);
    console.log('\nVerification test:', isValid);
    
    // Format for copying into auth.ts
    console.log('\nCopy this into SUPER_ADMIN in auth.ts:');
    console.log(`password: '${hash}',`);
}

testAuth().catch(console.error); 