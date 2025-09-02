import React from "react";

const PurchasesView = ({
  purchases,
  setShowModal,
  setModalType,
  setEditingItem,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Purchases </h2>
        <button
          onClick={() => {
            setModalType("purchase");
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Record Purchase
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Date{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Product{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Quantity{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Unit Price{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Total{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Status{" "}
                </th>
              </tr>{" "}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {" "}
              {purchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    {purchase.purchase_date}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    {purchase.product_name}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    {purchase.quantity}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    $ {purchase.unit_price}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    $ {purchase.total}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px - 2 py - 1 text - xs rounded - full $ {
                        purchase.status === 'completed' ?
                            'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}
                    >
                      {" "}
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}{" "}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasesView;
