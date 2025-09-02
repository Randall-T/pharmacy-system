import React from "react";
import OrdersTable from "./OrdersTable";

const OrdersView = ({ orders }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Orders </h2>{" "}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
};

export default OrdersView;
