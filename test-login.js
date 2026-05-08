// Quick test script to check database and login
const { poolConnect, pool, sql } = require('./db');

async function testLogin() {
    try {
        console.log('🔍 Testing database connection...');
        await poolConnect;
        console.log('✅ Database connected!');
        
        // Check if users exist
        const request = pool.request();
        const result = await request.query(`
            SELECT id, name, email, password, role 
            FROM users 
            WHERE email = 'educator@edufairuzullah.com'
        `);
        
        if (result.recordset.length === 0) {
            console.log('❌ No users found! Default users may not exist.');
            console.log('💡 Run database.sql in Azure Query Editor to create default users.');
        } else {
            const user = result.recordset[0];
            console.log('✅ Found user:', user.email);
            console.log('   Password in DB:', user.password);
            console.log('   Expected password: password123');
            console.log('   Match:', user.password === 'password123' ? '✅ YES' : '❌ NO');
        }
        
        // Test login query
        console.log('\n🔍 Testing login query...');
        const loginRequest = pool.request();
        loginRequest.input('email', sql.NVarChar(255), 'educator@edufairuzullah.com');
        loginRequest.input('password', sql.NVarChar(255), 'password123');
        
        const loginResult = await loginRequest.query(`
            SELECT id, name, email, role 
            FROM users 
            WHERE email = @email AND password = @password
        `);
        
        if (loginResult.recordset.length > 0) {
            console.log('✅ Login query works! User found:', loginResult.recordset[0].email);
        } else {
            console.log('❌ Login query failed - no user found with those credentials');
        }
        
        await pool.close();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('Error code:', err.code);
        if (err.message.includes('firewall') || err.message.includes('not allowed')) {
            console.error('\n💡 Solution: Add your IP to Azure SQL firewall rules');
        }
        process.exit(1);
    }
}

testLogin();




