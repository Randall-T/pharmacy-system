# Pharmacy Management System

A complete pharmacy inventory management system with separate frontend (React) and backend (Node.js/Express) with SQLite database.

## Features

- User Management: Manager and Salesperson roles with different permissions
- Product Management: Add, edit, view products with stock tracking
- Sales Recording: Record sales with automatic stock deduction
- Purchase Management: Track purchases and update inventory
- Order Management: Create and track purchase orders
- Reorder Alerts: Automatic low stock detection and reorder recommendations
- Dashboard Analytics: Overview of key metrics and alerts

## Project Structure

pharmacy-system/
├── backend/
│ ├── server.js ✅
│ ├── package.json ✅
│ ├── schema.sql ✅
│ └── init-database.js ✅
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── LoginForm.js ✅
│ │ │ ├── Navigation.js ✅
│ │ │ ├── Dashboard.js ✅
│ │ │ ├── ProductsView.js ✅
│ │ │ ├── SalesView.js ✅
│ │ │ ├── OrdersView.js ✅ (Updated - lightweight)
│ │ │ ├── OrdersTable.js ✅ (New - enhanced table)
│ │ │ ├── PurchasesView.js ✅
│ │ │ ├── UsersView.js ✅
│ │ │ ├── ReorderView.js ✅
│ │ │ └── Modal.js ✅
│ │ ├── App.js ✅
│ │ ├── App.css ✅ (Base styles)
│ │ ├── components.css ✅ (Extended styles)
│ │ └── index.js
│ └── package.json ✅
└── README.md ✅

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Create and navigate to the backend directory:
   mkdir pharmacy-system
   cd pharmacy-system
   mkdir backend
   cd backend
2. Save the backend files:

   - Copy server.js to this directory
   - Copy package.json to this directory
   - Copy init-database.js to this directory
   - Copy schema.sql to this directory

3. Install dependencies:
   npm install
4. Initialize the database:
   npm run init-db
5. Start the backend server:
   npm run dev
   The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the project root:
   cd pharmacy-system
   mkdir frontend
   cd frontend
2. Create a React app:
   npx create-react-app .
3. Replace the contents of the following files:

   - Replace src/App.js with the provided App.js code
   - Replace src/App.css with the provided App.css code
   - Update package.json with the provided dependencies

4. Install additional dependencies:
   npm install axios
5. Start the frontend:
   npm start
   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication

- POST /api/auth/login - User login

### Users (Manager only)

- GET /api/users - Get all users
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Products

- GET /api/products - Get all products
- POST /api/products - Create product (Manager only)
- PUT /api/products/:id - Update product (Manager only)
- DELETE /api/products/:id - Delete product (Manager only)

### Sales

- GET /api/sales - Get all sales
- POST /api/sales - Record new sale

### Purchases (Manager only)

- GET /api/purchases - Get all purchases
- POST /api/purchases - Record new purchase

### Orders

- GET /api/orders - Get all orders
- POST /api/orders - Create new order

### Dashboard

- GET /api/dashboard - Get dashboard statistics
- GET /api/reorder-recommendations - Get products needing reorder

## Database Schema

The system uses SQLite with the following tables:

- users - System users (managers and salespeople)
- products - Pharmacy products and inventory
- sales - Sales transactions
- purchases - Purchase records
- orders - Purchase orders to suppliers

## Key Features Explained

### Reorder System

- Products have reorder_point and max_stock levels
- System alerts when stock falls to/below reorder point
- Calculates optimal order quantity (max_stock - current_stock)
- One-click order creation from dashboard alerts

### Stock Management

- Automatic stock deduction on sales
- Stock increase on completed purchases
- Real-time low stock alerts
- Prevents overselling with stock validation

### Role-Based Access

- Managers: Full system access including user management, purchases, and all reports
- Salespeople: Limited to sales operations, product viewing, and basic reports

## Production Considerations

For production deployment, consider:

1. Security:

   - Implement proper password hashing (bcrypt)
   - Use environment variables for JWT secrets
   - Add rate limiting and input validation
   - Implement HTTPS

2. Database:

   - Consider PostgreSQL or MySQL for production
   - Implement database connection pooling
   - Add data backup and recovery

3. Performance:

   - Add caching (Redis)
   - Implement pagination for large datasets
   - Optimize database queries with indexes

4. Monitoring:
   - Add logging (Winston)
   - Implement health checks
   - Add error tracking (Sentry)

## Development

### Backend Development

cd backend
npm run dev # Starts server with nodemon for auto-restart

### Frontend Development

cd frontend
npm start # Starts React development server

## Troubleshooting

### Common Issues

1. CORS Errors: Ensure backend is running on port 5000 and frontend on 3000
2. Database Errors: Run npm run init-db to recreate the database
3. Login Issues: Check that demo credentials are being used correctly
4. API Connection: Verify backend server is running and accessible

### Reset Database

cd backend
rm pharmacy.db # Delete existing database
npm run init-db # Recreate with fresh data

## License

MIT License - feel free to use this project for educational or commercial purposes.
