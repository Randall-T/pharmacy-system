import React from "react";

const Dashboard = ({ products, dashboardData, createAutoOrder }) => {
  const lowStockProducts = products.filter(
    (p) => p.current_stock <= p.reorder_point
  );

  const DashboardCard = ({ title, value, icon, color }) => {
    const colors = {
      blue: "text-blue-600",
      red: "text-red-600",
      orange: "text-orange-600",
      green: "text-green-600",
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Products"
          value={dashboardData.totalProducts || 0}
          icon="📦"
          color="blue"
        />
        <DashboardCard
          title="Low Stock Items"
          value={dashboardData.lowStockItems || 0}
          icon="⚠️"
          color="red"
        />
        <DashboardCard
          title="Pending Orders"
          value={dashboardData.pendingOrders || 0}
          icon="📋"
          color="orange"
        />
        <DashboardCard
          title="Total Sales (30d)"
          value={`$${(dashboardData.totalSales || 0).toFixed(2)}`}
          icon="💰"
          color="green"
        />
      </div>
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Items Need Reordering
          </h3>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <span className="text-red-700">
                  {product.name} - Current: {product.current_stock}, Reorder at:
                  {product.reorder_point}
                </span>
                <button
                  onClick={() => createAutoOrder(product)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Create Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default Dashboard;
