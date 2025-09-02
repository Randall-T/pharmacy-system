import React from "react";

const Navigation = ({ user, currentView, setCurrentView, logout }) => {
  const NavButton = ({ view, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-4 py-2 rounded ${
        currentView === view ? "bg-blue-800" : "bg-blue-500 hover:bg-blue-700"
      }   transition duration - 200`}
    >
      {label}
    </button>
  );

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl"> 💊 </span>
          <h1 className="text-xl font-bold"> Pharmacy Manager </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm"> Welcome, {user.name} </span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-blue-700 rounded hover:bg-blue-800 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mt-4 flex space-x-2 overflow-x-auto">
        <NavButton view="dashboard" label="Dashboard" />
        {user.role === "manager" && <NavButton view="users" label="Users" />}
        <NavButton view="products" label="Products" />
        <NavButton view="sales" label="Sales" />
        {user.role === "manager" && (
          <NavButton view="purchases" label="Purchases" />
        )}
        <NavButton view="orders" label="Orders" />
        <NavButton view="reorder" label="Reorder Points" />
      </div>
    </nav>
  );
};

export default Navigation;
