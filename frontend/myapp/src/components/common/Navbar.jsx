import React from 'react';
import { ShoppingCart, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCard';

const Navbar = ({ onMenuClick, onCartClick }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HostelEase
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {user?.role === 'Student' && (
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart size={20} className="text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          )}
          
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
            <User size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <span className={`text-xs px-2 py-1 rounded ${
              user?.role === 'Admin' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>
              {user?.role}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;