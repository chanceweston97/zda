const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

console.log('Testing database connection...');
console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

client.connect()
  .then(() => {
    console.log('✅ Connection successful!');
    return client.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('✅ Query successful!', result.rows[0]);
    client.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
    client.end();
    process.exit(1);
  });

