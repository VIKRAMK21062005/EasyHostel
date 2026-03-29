import React from 'react';
import { Package, XCircle } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';

const StudentOrdersView = () => {
  const { orders, loading, cancelOrder } = useOrders();

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(orderId);
        alert('Order cancelled successfully');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          My Orders
        </h1>
        <p className="text-gray-600">Track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600">Start shopping to place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-2 mb-4">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.product}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product?.product || 'Product'}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
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
                {order.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={18} />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentOrdersView;