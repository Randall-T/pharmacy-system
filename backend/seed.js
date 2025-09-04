const { Client } = require("pg");
const bcrypt = require("bcrypt");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createDemoAccounts() {
  try {
    await client.connect();
    console.log("Connected to database!");

    // Generate a secure hashed password for the demo account
    const password = "admin123";
    const saltRounds = 10; // A reasonable number for security vs. performance
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES
      ('admin', 'admin@pharmacy.com', $1)
      ON CONFLICT (username) DO NOTHING;
    `;

    // Use parameterized query to prevent SQL injection
    const values = [hashedPassword];
    await client.query(insertQuery, values);

    console.log('Admin account "admin" created successfully!');
  } catch (err) {
    console.error("Error creating demo accounts:", err);
  } finally {
    await client.end();
  }
}

createDemoAccounts();
