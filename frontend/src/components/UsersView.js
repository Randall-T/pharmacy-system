import React from "react";

const UsersView = ({
  users,
  setShowModal,
  setModalType,
  setEditingItem,
  deleteUser,
}) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Users </h2>
        <button
          onClick={() => {
            setModalType("user");
            setEditingItem(null);
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add User{" "}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Name{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Email{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Role{" "}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {" "}
                  Actions{" "}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {" "}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {" "}
                    {user.name}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {" "}
                    {user.email}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                    px - 2 py - 1 text - xs rounded - full $ {
                        user.role === 'manager' ?
                            'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                    }`}
                    >
                      {" "}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setModalType("user");
                          setEditingItem(user);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit{" "}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete{" "}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersView;
