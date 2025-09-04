import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "./components/LoginForm";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ProductsView from "./components/ProductsView";
import SalesView from "./components/SalesView";
import PurchasesView from "./components/PurchasesView";
import OrdersView from "./components/OrdersView";
import UsersView from "./components/UsersView";
import ReorderView from "./components/ReorderView";
import Modal from "./components/Modal";
import "./App.css";

// Configure axios defaults
axios.defaults.baseURL = process.env.BACKEND_API_URL;

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentView, setCurrentView] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for different data types
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  // Set axios token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUserInfo();
    }
  }, [token]);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      loadInitialData();
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  // Load initial data
  const loadInitialData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchSales(),
        fetchOrders(),
        fetchDashboardData(),
      ]);

      const userRole = JSON.parse(atob(token.split(".")[1])).role;
      if (userRole === "manager") {
        await Promise.all([fetchPurchases(), fetchUsers()]);
      }
    } catch (error) {
      setError("Failed to load data");
    }
  };

  // API calls
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await axios.get("/sales");
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/purchases");
      setPurchases(response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Authentication
  const login = async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      axios.defaults.headers.common["Authorization"] = "Bearer ${newToken}";

      await loadInitialData();
      setCurrentView("dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  // CRUD operations
  const createProduct = async (productData) => {
    try {
      await axios.post("/products", productData);
      await fetchProducts();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create product");
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      await axios.put("/products/${id}", productData);
      await fetchProducts();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete("/products/${id}");
        await fetchProducts();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to delete product");
      }
    }
  };

  const createSale = async (saleData) => {
    try {
      await axios.post("/sales", saleData);
      await Promise.all([fetchSales(), fetchProducts(), fetchDashboardData()]);
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to record sale");
    }
  };

  const createPurchase = async (purchaseData) => {
    try {
      await axios.post("/purchases", purchaseData);
      await Promise.all([
        fetchPurchases(),
        fetchProducts(),
        fetchDashboardData(),
      ]);
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to record purchase");
    }
  };

  const createOrder = async (orderData) => {
    try {
      await axios.post("/orders", orderData);
      await fetchOrders();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create order");
    }
  };

  const createUser = async (userData) => {
    try {
      await axios.post("/users", userData);
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create user");
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await axios.put("/users/${id}", userData);
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete("/users/${id}");
        await fetchUsers();
      } catch (error) {
        setError(error.response?.data?.error || "Failed to delete user");
      }
    }
  };

  // Auto-create order for low stock items
  const createAutoOrder = async (product) => {
    const quantityToOrder = product.max_stock - product.current_stock;
    const orderData = {
      product_id: product.id,
      quantity: quantityToOrder,
      unit_price: product.unit_price * 0.8,
      supplier: product.supplier,
    };

    try {
      await axios.post("/orders", orderData);
      await fetchOrders();
      alert("Order created for ${product.name} - Quantity: ${quantityToOrder}");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create order");
    }
  }; // Render current view
  const renderView = () => {
    const commonProps = {
      user,
      products,
      sales,
      purchases,
      orders,
      users,
      dashboardData,
      setShowModal,
      setModalType,
      setEditingItem,
      createAutoOrder,
      deleteProduct,
      deleteUser,
    };

    switch (currentView) {
      case "dashboard":
        return <Dashboard {...commonProps} />;
      case "products":
        return <ProductsView {...commonProps} />;
      case "sales":
        return <SalesView {...commonProps} />;
      case "purchases":
        return user.role === "manager" ? (
          <PurchasesView {...commonProps} />
        ) : (
          <div className="p-6">Access denied </div>
        );
      case "orders":
        return <OrdersView {...commonProps} />;
      case "reorder":
        return <ReorderView {...commonProps} />;
      case "users":
        return user.role === "manager" ? (
          <UsersView {...commonProps} />
        ) : (
          <div className="p-6"> Access denied </div>
        );
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  // Handle modal save
  const handleModalSave = (data) => {
    if (modalType === "product") {
      if (editingItem) {
        updateProduct(editingItem.id, data);
      } else {
        createProduct(data);
      }
    } else if (modalType === "sale") {
      createSale(data);
    } else if (modalType === "purchase") {
      createPurchase(data);
    } else if (modalType === "user") {
      if (editingItem) {
        updateUser(editingItem.id, data);
      } else {
        createUser(data);
      }
    }
  };

  // Main render
  if (!token || !user) {
    return <LoginForm onLogin={login} loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        user={user}
        currentView={currentView}
        setCurrentView={setCurrentView}
        logout={logout}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 relative">
          {error}
          <button
            onClick={() => setError("")}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      {renderView()}

      <Modal
        show={showModal}
        type={modalType}
        item={editingItem}
        products={products}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default App;
