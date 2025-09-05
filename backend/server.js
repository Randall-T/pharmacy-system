const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// CORS Configuration for production
app.use(
  cors({
    origin: true, // Allow any origin
    credentials: true,
  })
);
app.use(express.json());

// Database (PostgreSQL) connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("Connected to PostgreSQL database");
    release();
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && req.user.role !== "manager") {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// AUTH ROUTES
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// USER ROUTES
app.get(
  "/api/users",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

app.post(
  "/api/users",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, email, hashedPassword, role]
      );

      res.json({ id: result.rows[0].id, message: "User created successfully" });
    } catch (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

app.put(
  "/api/users/:id",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const { name, email, role, password } = req.body;
    const { id } = req.params;

    try {
      let query =
        "UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4";
      let params = [name, email, role, id];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query =
          "UPDATE users SET name = $1, email = $2, role = $3, password = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5";
        params = [name, email, role, hashedPassword, id];
      }

      await pool.query(query, params);
      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

app.delete(
  "/api/users/:id",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// PRODUCT ROUTES
app.get("/api/products", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post(
  "/api/products",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const {
      name,
      category,
      current_stock,
      reorder_point,
      max_stock,
      unit_price,
      supplier,
    } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO products (name, category, current_stock, reorder_point, max_stock, unit_price, supplier) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [
          name,
          category,
          current_stock,
          reorder_point,
          max_stock,
          unit_price,
          supplier,
        ]
      );

      res.json({
        id: result.rows[0].id,
        message: "Product created successfully",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

app.put(
  "/api/products/:id",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const {
      name,
      category,
      current_stock,
      reorder_point,
      max_stock,
      unit_price,
      supplier,
    } = req.body;
    const { id } = req.params;

    try {
      await pool.query(
        "UPDATE products SET name = $1, category = $2, current_stock = $3, reorder_point = $4, max_stock = $5, unit_price = $6, supplier = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8",
        [
          name,
          category,
          current_stock,
          reorder_point,
          max_stock,
          unit_price,
          supplier,
          id,
        ]
      );

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// SALES ROUTES
app.get("/api/sales", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
            SELECT s.*, p.name as product_name, u.name as salesperson_name 
            FROM sales s 
            JOIN products p ON s.product_id = p.id 
            JOIN users u ON s.salesperson_id = u.id 
            ORDER BY s.sale_date DESC
        `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/sales", authenticateToken, async (req, res) => {
  const { product_id, quantity, unit_price } = req.body;
  const total = quantity * unit_price;
  const salesperson_id = req.user.id;
  const sale_date = new Date().toISOString().split("T")[0];

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if product has enough stock
    const productResult = await client.query(
      "SELECT current_stock FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = productResult.rows[0];
    if (product.current_stock < quantity) {
      throw new Error("Insufficient stock");
    }

    // Insert sale
    await client.query(
      "INSERT INTO sales (product_id, quantity, unit_price, total, salesperson_id, sale_date) VALUES ($1, $2, $3, $4, $5, $6)",
      [product_id, quantity, unit_price, total, salesperson_id, sale_date]
    );

    // Update product stock
    await client.query(
      "UPDATE products SET current_stock = current_stock - $1 WHERE id = $2",
      [quantity, product_id]
    );

    await client.query("COMMIT");
    res.json({ message: "Sale recorded successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error recording sale:", error);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

// DASHBOARD ROUTES
app.get("/api/dashboard", authenticateToken, async (req, res) => {
  try {
    const totalProducts = await pool.query(
      "SELECT COUNT(*) as total FROM products"
    );
    const lowStockItems = await pool.query(
      "SELECT COUNT(*) as total FROM products WHERE current_stock <= reorder_point"
    );
    const pendingOrders = await pool.query(
      "SELECT COUNT(*) as total FROM orders WHERE status = $1",
      ["pending"]
    );
    const totalSales = await pool.query(
      "SELECT COALESCE(SUM(total), 0) as total FROM sales WHERE sale_date >= $1",
      [
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      ]
    );

    res.json({
      totalProducts: parseInt(totalProducts.rows[0].total),
      lowStockItems: parseInt(lowStockItems.rows[0].total),
      pendingOrders: parseInt(pendingOrders.rows[0].total),
      totalSales: parseFloat(totalSales.rows[0].total),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get reorder recommendations
app.get("/api/reorder-recommendations", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE current_stock <= reorder_point"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reorder recommendations:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Pharmacy API is running" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch-All Route
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});
