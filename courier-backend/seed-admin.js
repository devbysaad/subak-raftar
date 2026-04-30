require('dotenv').config();
const { auth } = require('./src/modules/auth/auth.config');
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: 'subakraftar@gmail.com',
        password: 'subakraftar123',
        name: 'Admin',
      }
    });
    console.log('User created or already exists.');
    
    // Now set role to admin
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    await db.collection('user').updateOne(
      { email: 'subakraftar@gmail.com' },
      { $set: { role: 'admin' } }
    );
    console.log('Role set to admin successfully.');
    process.exit(0);
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
       console.log('User already exists, just updating role...');
       const client = new MongoClient(process.env.MONGO_URI);
       await client.connect();
       const db = client.db();
       await db.collection('user').updateOne(
         { email: 'subakraftar@gmail.com' },
         { $set: { role: 'admin' } }
       );
       console.log('Role set to admin successfully.');
       process.exit(0);
    } else {
       console.error(err);
       process.exit(1);
    }
  }
})();
