import React from 'react';
import { Home, Package, ShoppingCart, History, ShoppingBag, FileText, Truck } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeView, setActiveView, userRole }) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
  ];

  const studentMenuItems = [
    { id: 'shop', label: 'Shop Products', icon: ShoppingBag },
    { id: 'custom-order', label: 'Custom Order', icon: FileText },
    { id: 'parcel-pickup', label: 'Parcel Pickup', icon: Truck },
    { id: 'orders', label: 'My Orders', icon: History },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
  ];

  const menuItems = userRole === 'Admin' ? adminMenuItems : studentMenuItems;

  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;