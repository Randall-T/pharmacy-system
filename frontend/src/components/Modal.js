import React, { useState } from "react";

const Modal = ({ show, type, item, products, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {" "}
            {item ? "Edit" : "Add"}{" "}
            {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {" "}
            {type === "product" && (
              <>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Current Stock"
                  value={formData.current_stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, current_stock: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Reorder Point"
                  value={formData.reorder_point || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reorder_point: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Max Stock"
                  value={formData.max_stock || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, max_stock: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  value={formData.supplier || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </>
            )}
            {type === "sale" && (
              <>
                <select
                  value={formData.product_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value=""> Select Product </option>{" "}
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {" "}
                      {product.name}(Stock: {product.current_stock}){" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </>
            )}
            {type === "purchase" && (
              <>
                <select
                  value={formData.product_id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value=""> Select Product </option>{" "}
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {" "}
                      {product.name}{" "}
                    </option>
                  ))}{" "}
                </select>{" "}
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unit Price"
                  value={formData.unit_price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit_price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={formData.status || "completed"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="completed"> Completed </option>{" "}
                  <option value="pending"> Pending </option>{" "}
                </select>{" "}
              </>
            )}
            {type === "user" && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={formData.role || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value=""> Select Role </option>{" "}
                  <option value="manager"> Manager </option>{" "}
                  <option value="salesperson"> Salesperson </option>{" "}
                </select>{" "}
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!item}
                />{" "}
              </>
            )}
            <div className="flex space-x-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {item ? "Update" : "Add"}{" "}
              </button>{" "}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
              >
                Cancel{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Modal;
