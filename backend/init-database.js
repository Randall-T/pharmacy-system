const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Create database
const db = new sqlite3.Database("./pharmacy.db", (err) => {
  if (err) {
    console.error("Error creating database:", err);
    return;
  }
  console.log("Database created successfully");
});

// Read and execute schema
const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

// Split schema into individual statements
const statements = schema.split(";").filter((stmt) => stmt.trim().length > 0);

// Execute each statement
db.serialize(() => {
  statements.forEach((statement, index) => {
    db.run(statement + ";", (err) => {
      if (err) {
        console.error(`Error executing statement ${index + 1}:`, err);
      } else {
        console.log(`Statement ${index + 1} executed successfully`);
      }
    });
  });

  console.log("Database initialization completed");
  db.close();
});
