import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

const OrderSummary = ({ order }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Package className="text-yellow-600" size={24} />;
      case 'Assigned':
        return <Truck className="text-blue-600" size={24} />;
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'Pending':
        return 33;
      case 'Assigned':
        return 66;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <span className="font-semibold text-gray-700">{order.status}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getStatusProgress(order.status)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Order Placed</span>
          <span>Processing</span>
          <span>Delivered</span>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-medium text-gray-800">#{order._id.slice(-8)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order Date:</span>
          <span className="font-medium text-gray-800">
            {new Date(order.createdAt).toLocaleDateString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Items:</span>
          <span className="font-medium text-gray-800">{order.products.length}</span>
        </div>
      </div>

      {/* Products List */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
        <div className="space-y-2">
          {order.products.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.product}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.product?.product}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-800">
                ₹{(item.product?.price || 0) * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">₹{order.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;