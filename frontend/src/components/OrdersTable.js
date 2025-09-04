import React from "react";

const OrdersTable = ({ orders }) => {
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full";
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return `${baseClasses}
        ${statusClasses[status] || statusClasses.pending}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg"> 📋 </div>
        <p className="text-gray-500 mt-2"> No orders found </p>{" "}
        <p className="text-gray-400 text-sm">
          {" "}
          Orders will appear here once created{" "}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product{" "}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supplier{" "}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity{" "}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit Price{" "}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total{" "}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status{" "}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {" "}
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {" "}
                {formatDate(order.order_date)}{" "}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {" "}
                  {order.product_name || "Unknown Product"}{" "}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {" "}
                {order.supplier || "N/A"}{" "}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {" "}
                {order.quantity?.toLocaleString() || "0"}{" "}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {" "}
                {formatCurrency(order.unit_price || 0)}{" "}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {" "}
                {formatCurrency(order.total || 0)}{" "}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getStatusBadge(order.status)}>
                  {" "}
                  {order.status || "pending"}{" "}
                </span>{" "}
              </td>
            </tr>
          ))}{" "}
        </tbody>
      </table>
      {/* Summary footer */}{" "}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total Orders: <span className="font-medium"> {orders.length} </span>
          </span>
          <span className="text-sm text-gray-600">
            Total Value:{" "}
            <span className="font-medium">
              {" "}
              {formatCurrency(
                orders.reduce((sum, order) => sum + (order.total || 0), 0)
              )}{" "}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
