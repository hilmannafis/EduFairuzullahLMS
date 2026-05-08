// Check all users in database
const { poolConnect, pool, sql } = require('./db');

async function checkUsers() {
    try {
        console.log('🔍 Connecting to database...');
        await poolConnect;
        console.log('✅ Connected!\n');
        
        const request = pool.request();
        const result = await request.query(`
            SELECT id, name, email, password, role 
            FROM users 
            ORDER BY id
        `);
        
        if (result.recordset.length === 0) {
            console.log('❌ No users found in database!');
            console.log('💡 You need to run database.sql in Azure Query Editor to create default users.');
        } else {
            console.log(`✅ Found ${result.recordset.length} user(s):\n`);
            result.recordset.forEach((user, index) => {
                console.log(`User ${index + 1}:`);
                console.log(`  ID: ${user.id}`);
                console.log(`  Name: ${user.name}`);
                console.log(`  Email: ${user.email}`);
                console.log(`  Password: ${user.password}`);
                console.log(`  Role: ${user.role}`);
                console.log('');
            });
            
            // Test login
            console.log('🔍 Testing login with default credentials...\n');
            const testRequest = pool.request();
            testRequest.input('email', sql.NVarChar(255), 'educator@edufairuzullah.com');
            testRequest.input('password', sql.NVarChar(255), 'password123');
            
            const loginResult = await testRequest.query(`
                SELECT id, name, email, role 
                FROM users 
                WHERE email = @email AND password = @password
            `);
            
            if (loginResult.recordset.length > 0) {
                console.log('✅ Login test PASSED!');
                console.log('   User found:', loginResult.recordset[0].email);
            } else {
                console.log('❌ Login test FAILED!');
                console.log('   Email: educator@edufairuzullah.com');
                console.log('   Password tried: password123');
                console.log('   💡 Password in database might be different');
            }
        }
        
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('firewall') || err.message.includes('not allowed')) {
            console.error('\n💡 Your IP is blocked. Add your IP to Azure SQL firewall rules.');
        }
        process.exit(1);
    }
}

checkUsers();


