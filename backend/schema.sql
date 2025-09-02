-- Pharmacy Management System Database Schema


-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'salesperson')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER NOT NULL DEFAULT 100,
    unit_price DECIMAL(10, 2) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Sales table
CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    salesperson_id INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (salesperson_id) REFERENCES users(id)
);


-- Purchases table
CREATE TABLE purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Orders table
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    order_date DATE NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Insert default users
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@pharmacy.com', '$2b$10$XyZvW1qP2aB3cD4eF5gH6I', 'manager'),
('Sales Person', 'sales@pharmacy.com', '$2b$10$XyZvW1qP2aB3cD4eF5gH6I', 'salesperson');


-- Insert sample products
INSERT INTO products (name, category, current_stock, reorder_point, max_stock, unit_price, supplier) VALUES 
('Paracetamol 500mg', 'Pain Relief', 50, 20, 200, 2.50, 'MedCorp'),
('Amoxicillin 250mg', 'Antibiotics', 15, 25, 150, 5.00, 'PharmSupply'),
('Ibuprofen 400mg', 'Pain Relief', 80, 30, 200, 3.25, 'MedCorp'),
('Aspirin 75mg', 'Pain Relief', 100, 25, 300, 1.75, 'MedCorp'),
('Cough Syrup 100ml', 'Cold & Flu', 40, 15, 100, 8.50, 'PharmSupply');


-- Insert sample sales
INSERT INTO sales (product_id, quantity, unit_price, total, salesperson_id, sale_date) VALUES 
(1, 10, 2.50, 25.00, 2, '2025-08-25'),
(2, 5, 5.00, 25.00, 2, '2025-08-24'),
(3, 8, 3.25, 26.00, 2, '2025-08-23');


-- Insert sample purchases
INSERT INTO purchases (product_id, quantity, unit_price, total, purchase_date, status) VALUES 
(1, 100, 2.00, 200.00, '2025-08-20', 'completed'),
(2, 50, 4.50, 225.00, '2025-08-22', 'completed');


-- Insert sample orders
INSERT INTO orders (product_id, quantity, unit_price, total, status, order_date, supplier) VALUES 
(2, 50, 4.50, 225.00, 'pending', '2025-08-25', 'PharmSupply');


-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_users_email ON users(email);
