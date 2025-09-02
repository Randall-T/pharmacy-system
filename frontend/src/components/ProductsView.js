import React from "react";

const ProductsView = ({
  user,
  products,
  setShowModal,
  setModalType,
  setEditingItem,
  deleteProduct,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Products </h2>
        {user.role === "manager" && (
          <button
            onClick={() => {
              setModalType("product");
              setEditingItem(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Product{" "}
          </button>
        )}{" "}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Product{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Category{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Stock{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Reorder Point{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Price{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Status{" "}
                </th>
                {user.role === "manager" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {" "}
                    Actions{" "}
                  </th>
                )}{" "}
              </tr>{" "}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {" "}
                      {product.name}{" "}
                    </div>
                    <div className="text-sm text-gray-500">
                      {" "}
                      {product.supplier}{" "}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    {product.category}{" "}
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
                    $ {product.unit_price}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full $ {
                    product.current_stock <= product.reorder_point ?
                        'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                }`}
                    >
                      {" "}
                      {product.current_stock <= product.reorder_point
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>
                  {user.role === "manager" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setModalType("product");
                            setEditingItem(product);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}{" "}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
