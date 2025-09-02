import React from "react";

const ReorderView = ({ products, createAutoOrder }) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {" "}
        Reorder Points & Recommendations{" "}
      </h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Product{" "}
                </th>{" "}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Current Stock{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Reorder Point{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Max Stock{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Qty to Order{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Status{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Action{" "}
                </th>{" "}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {" "}
              {products.map((product) => {
                const needsReorder =
                  product.current_stock <= product.reorder_point;
                const qtyToOrder = product.max_stock - product.current_stock;

                return (
                  <tr
                    key={product.id}
                    className={needsReorder ? "bg-red-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {" "}
                      {product.name}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {" "}
                      {product.current_stock}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {" "}
                      {product.reorder_point}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {" "}
                      {product.max_stock}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {" "}
                      {qtyToOrder}{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px - 2 py - 1 text - xs rounded - full $ {
                            needsReorder
                                ?
                                'bg-red-100 text-red-800' :
                                'bg-green-100 text-green-800'
                        }
                    `}
                      >
                        {" "}
                        {needsReorder ? "Needs Reorder" : "OK"}
                      </span>{" "}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {" "}
                      {needsReorder ? (
                        <button
                          onClick={() => createAutoOrder(product)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Create Order
                        </button>
                      ) : (
                        <span className="text-green-600">
                          {" "}
                          No action needed{" "}
                        </span>
                      )}{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReorderView;
