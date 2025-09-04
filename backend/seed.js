const { Client } = require("pg");
const bcrypt = require("bcrypt");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createDemoAccounts() {
  try {
    await client.connect();
    console.log("Connected to database!");

    // Define the demo users with plaintext passwords and roles
    const demoUsers = [
      {
        name: "Admin User",
        email: "admin@pharmacy.com",
        password: "admin123",
        role: "manager",
      },
      {
        name: "Sales Person",
        email: "sales@pharmacy.com",
        password: "sales123",
        role: "salesperson",
      },
    ];

    // Use a loop to create each user
    for (const user of demoUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      const insertQuery = `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING;
      `;

      const values = [user.name, user.email, hashedPassword, user.role];
      await client.query(insertQuery, values);
      console.log(`User "${user.email}" created successfully.`);
    }

    console.log("All demo accounts created successfully!");
  } catch (err) {
    console.error("Error creating demo accounts:", err);
  } finally {
    await client.end();
  }
}

createDemoAccounts();
