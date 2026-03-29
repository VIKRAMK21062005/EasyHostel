import React, { useState } from 'react';
import { Package, MapPin, Send, AlertCircle, Truck } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const ParcelPickupView = () => {
  const [formData, setFormData] = useState({
    courierName: 'Amazon',
    trackingNumber: '',
    senderName: '',
    deliveryRoom: '',
    pickupLocation: 'Main Gate',
    specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const couriers = ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Other'];
  const pickupLocations = ['Main Gate', 'Back Gate', 'Security Office', 'Reception'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await orderService.requestParcelPickup(formData);
      alert('Parcel pickup request submitted! We\'ll collect your parcel soon.');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit parcel pickup request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Parcel Pickup Service
        </h1>
        <p className="text-gray-600">
          Got a parcel at the gate? We'll bring it to your room!
        </p>
      </div>

      {/* Service Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-blue-900">Service Charge</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">₹20</p>
          <p className="text-xs text-blue-700 mt-1">Per parcel pickup</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Truck className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-green-900">Delivery Time</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">30-60 min</p>
          <p className="text-xs text-green-700 mt-1">Average pickup time</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <MapPin className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-purple-900">Coverage</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">24/7</p>
          <p className="text-xs text-purple-700 mt-1">All pickup points</p>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-1">Important:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure your parcel has arrived before requesting pickup</li>
            <li>Keep your phone accessible for delivery confirmation</li>
            <li>Payment can be made upon delivery (Cash/UPI)</li>
          </ul>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Courier Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Courier Company *
          </label>
          <select
            value={formData.courierName}
            onChange={(e) => setFormData({ ...formData, courierName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          >
            {couriers.map(courier => (
              <option key={courier} value={courier}>{courier}</option>
            ))}
          </select>
        </div>

        {/* Tracking Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number (Optional)
          </label>
          <input
            type="text"
            value={formData.trackingNumber}
            onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
            placeholder="Enter tracking/AWB number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Sender Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sender Name (Optional)
          </label>
          <input
            type="text"
            value={formData.senderName}
            onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            placeholder="Who sent this parcel?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Pickup Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location *
          </label>
          <select
            value={formData.pickupLocation}
            onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          >
            {pickupLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Delivery Room */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Room Number *
          </label>
          <input
            type="text"
            value={formData.deliveryRoom}
            onChange={(e) => setFormData({ ...formData, deliveryRoom: e.target.value })}
            placeholder="e.g., 201, A-Block-305"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            placeholder="Any specific instructions for delivery..."
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Service Charge:</span>
            <span className="text-2xl font-bold text-blue-600">₹20</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Payment: Cash/UPI on delivery
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Request Parcel Pickup'}</span>
        </button>
      </form>
    </div>
  );
};

export default ParcelPickupView;
