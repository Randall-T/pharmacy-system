const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// CORS Configuration for production
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://pharmacy-front-x0mmfo7cy-randalls-projects-49978e87.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Database connection
const db = new sqlite3.Database("./pharmacy.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
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
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // For demo purposes, check plain text password
        // In production, use bcrypt to compare hashed passwords
        const validPassword =
          password === "admin123" || password === "sales123";

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
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// USER ROUTES
app.get("/api/users", authenticateToken, requireRole("manager"), (req, res) => {
  db.all(
    "SELECT id, name, email, role, created_at FROM users",
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(users);
    }
  );
});

app.post(
  "/api/users",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const { name, email, password, role } = req.body;

    db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(400).json({ error: "Email already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ id: this.lastID, message: "User created successfully" });
      }
    );
  }
);

app.put(
  "/api/users/:id",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const { name, email, role, password } = req.body;
    const { id } = req.params;

    let query = "UPDATE users SET name = ?, email = ?, role = ?";
    let params = [name, email, role];

    if (password) {
      query += ", password = ?";
      params.push(password);
    }

    query += " WHERE id = ?";
    params.push(id);

    db.run(query, params, function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "User updated successfully" });
    });
  }
);

app.delete(
  "/api/users/:id",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "User deleted successfully" });
    });
  }
);

// PRODUCT ROUTES
app.get("/api/products", authenticateToken, (req, res) => {
  db.all("SELECT * FROM products ORDER BY name", (err, products) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(products);
  });
});

app.post(
  "/api/products",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const {
      name,
      category,
      current_stock,
      reorder_point,
      max_stock,
      unit_price,
      supplier,
    } = req.body;

    db.run(
      "INSERT INTO products (name, category, current_stock, reorder_point, max_stock, unit_price, supplier) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        category,
        current_stock,
        reorder_point,
        max_stock,
        unit_price,
        supplier,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ id: this.lastID, message: "Product created successfully" });
      }
    );
  }
);

app.put(
  "/api/products/:id",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
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

    db.run(
      "UPDATE products SET name = ?, category = ?, current_stock = ?, reorder_point = ?, max_stock = ?, unit_price = ?, supplier = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [
        name,
        category,
        current_stock,
        reorder_point,
        max_stock,
        unit_price,
        supplier,
        id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Product updated successfully" });
      }
    );
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Product deleted successfully" });
    });
  }
);

// SALES ROUTES
app.get("/api/sales", authenticateToken, (req, res) => {
  const query = `
        SELECT s.*, p.name as product_name, u.name as salesperson_name 
        FROM sales s 
        JOIN products p ON s.product_id = p.id 
        JOIN users u ON s.salesperson_id = u.id 
        ORDER BY s.sale_date DESC
    `;

  db.all(query, (err, sales) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(sales);
  });
});

app.post("/api/sales", authenticateToken, (req, res) => {
  const { product_id, quantity, unit_price } = req.body;
  const total = quantity * unit_price;
  const salesperson_id = req.user.id;
  const sale_date = new Date().toISOString().split("T")[0];

  // Check if product has enough stock
  db.get(
    "SELECT current_stock FROM products WHERE id = ?",
    [product_id],
    (err, product) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.current_stock < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      // Begin transaction
      db.serialize(() => {
        // Insert sale
        db.run(
          "INSERT INTO sales (product_id, quantity, unit_price, total, salesperson_id, sale_date) VALUES (?, ?, ?, ?, ?, ?)",
          [product_id, quantity, unit_price, total, salesperson_id, sale_date],
          function (err) {
            if (err) {
              return res.status(500).json({ error: "Error recording sale" });
            }

            // Update product stock
            db.run(
              "UPDATE products SET current_stock = current_stock - ? WHERE id = ?",
              [quantity, product_id],
              function (err) {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Error updating stock" });
                }
                res.json({
                  id: this.lastID,
                  message: "Sale recorded successfully",
                });
              }
            );
          }
        );
      });
    }
  );
});

// PURCHASE ROUTES
app.get(
  "/api/purchases",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const query = `
        SELECT p.*, pr.name as product_name 
        FROM purchases p 
        JOIN products pr ON p.product_id = pr.id 
        ORDER BY p.purchase_date DESC
    `;

    db.all(query, (err, purchases) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(purchases);
    });
  }
);

app.post(
  "/api/purchases",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    const { product_id, quantity, unit_price, status } = req.body;
    const total = quantity * unit_price;
    const purchase_date = new Date().toISOString().split("T")[0];

    db.serialize(() => {
      // Insert purchase
      db.run(
        "INSERT INTO purchases (product_id, quantity, unit_price, total, purchase_date, status) VALUES (?, ?, ?, ?, ?, ?)",
        [product_id, quantity, unit_price, total, purchase_date, status],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Error recording purchase" });
          }

          // If purchase is completed, update stock
          if (status === "completed") {
            db.run(
              "UPDATE products SET current_stock = current_stock + ? WHERE id = ?",
              [quantity, product_id],
              function (err) {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Error updating stock" });
                }
                res.json({
                  id: this.lastID,
                  message: "Purchase recorded successfully",
                });
              }
            );
          } else {
            res.json({
              id: this.lastID,
              message: "Purchase recorded successfully",
            });
          }
        }
      );
    });
  }
);

// ORDER ROUTES
app.get("/api/orders", authenticateToken, (req, res) => {
  const query = `
        SELECT o.*, p.name as product_name 
        FROM orders o 
        JOIN products p ON o.product_id = p.id 
        ORDER BY o.order_date DESC
    `;

  db.all(query, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(orders);
  });
});

app.post("/api/orders", authenticateToken, (req, res) => {
  const { product_id, quantity, unit_price, supplier } = req.body;
  const total = quantity * unit_price;
  const order_date = new Date().toISOString().split("T")[0];

  db.run(
    "INSERT INTO orders (product_id, quantity, unit_price, total, order_date, supplier) VALUES (?, ?, ?, ?, ?, ?)",
    [product_id, quantity, unit_price, total, order_date, supplier],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error creating order" });
      }
      res.json({ id: this.lastID, message: "Order created successfully" });
    }
  );
});

// DASHBOARD ROUTES
app.get("/api/dashboard", authenticateToken, (req, res) => {
  const dashboardData = {};

  db.serialize(() => {
    // Get total products
    db.get("SELECT COUNT(*) as total FROM products", (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      dashboardData.totalProducts = result.total;
    });

    // Get low stock items
    db.get(
      "SELECT COUNT(*) as total FROM products WHERE current_stock <= reorder_point",
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        dashboardData.lowStockItems = result.total;
      }
    );

    // Get pending orders
    db.get(
      'SELECT COUNT(*) as total FROM orders WHERE status = "pending"',
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        dashboardData.pendingOrders = result.total;
      }
    );

    // Get total sales
    db.get(
      'SELECT SUM(total) as total FROM sales WHERE sale_date >= date("now", "-30 days")',
      (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        dashboardData.totalSales = result.total || 0;

        res.json(dashboardData);
      }
    );
  });
});

// Get reorder recommendations
app.get("/api/reorder-recommendations", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM products WHERE current_stock <= reorder_point",
    (err, products) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      res.json(products);
    }
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
