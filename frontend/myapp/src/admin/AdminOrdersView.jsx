import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';

const AdminOrdersView = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState('All');

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredOrders =
    filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Order Management
        </h1>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Assigned', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {order.user?.name || 'Unknown User'}
                </h3>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Order ID: {order._id.slice(-8)}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {order.products.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.product}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {item.product?.product || 'Product'}
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-blue-600">
                    ₹{(item.product?.price || 0) * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
              <div className="text-lg font-bold text-gray-800">
                Total: ₹{order.totalPrice}
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersView;
