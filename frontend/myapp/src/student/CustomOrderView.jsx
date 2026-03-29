import React, { useState } from 'react';
import { FileText, Plus, Minus, Send, AlertCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const CustomOrderView = () => {
  const [formData, setFormData] = useState({
    description: '',
    items: [''],
    estimatedPrice: '',
    specialInstructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, ''],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, value) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty items
      const filteredItems = formData.items.filter(item => item.trim() !== '');

      await orderService.placeCustomOrder({
        description: formData.description,
        items: filteredItems,
        estimatedPrice: parseFloat(formData.estimatedPrice),
        specialInstructions: formData.specialInstructions,
      });

      alert('Custom order placed successfully! Our team will contact you soon.');
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place custom order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Custom Order Request
        </h1>
        <p className="text-gray-600">
          Can't find what you need? Tell us and we'll get it for you!
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Describe what you need in detail</li>
            <li>Add approximate price (we'll adjust if needed)</li>
            <li>Our team will review and confirm within 2 hours</li>
            <li>Once confirmed, we'll deliver to your room</li>
          </ol>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you need? *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Example: 2 packets of Uncle Chips, 1 Dairy Milk chocolate, cold drink..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            required
          />
        </div>

        {/* Items List */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item List (Optional - for clarity)
          </label>
          <div className="space-y-2">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Add Another Item</span>
            </button>
          </div>
        </div>

        {/* Estimated Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Price (₹) *
          </label>
          <input
            type="number"
            value={formData.estimatedPrice}
            onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
            placeholder="Approximate total amount"
            min="1"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Don't worry if you're not sure - we'll confirm the exact amount
          </p>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            placeholder="Any specific requirements, brands, or delivery preferences..."
            rows="2"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Submit Custom Order'}</span>
        </button>
      </form>
    </div>
  );
};

export default CustomOrderView;