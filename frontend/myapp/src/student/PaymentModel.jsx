import React, { useState, useEffect } from 'react';
import { X, CreditCard, Loader } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripeService from '../services/stripeService';

// Card Element Options
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Checkout Form Component
const CheckoutForm = ({ orderTotal, onPaymentComplete, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      try {
        const { clientSecret } = await stripeService.createPaymentIntent(orderTotal);
        setClientSecret(clientSecret);
      } catch (err) {
        setError(err.message);
      }
    };

    initializePayment();
  }, [orderTotal]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment successful
        onPaymentComplete('Card', paymentIntent.id);
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Total */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
        <p className="text-3xl font-bold text-gray-800">₹{orderTotal}</p>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-4 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Payment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          💳 Your payment is secured by Stripe. We don't store your card details.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Pay ₹{orderTotal}</span>
            </>
          )}
        </button>
      </div>

      {/* Test Card Info */}
      {import.meta.env.MODE === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800 font-medium mb-1">Test Mode:</p>
          <p className="text-xs text-yellow-700">
            Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
          </p>
        </div>
      )}
    </form>
  );
};

// Main Payment Modal Component
const PaymentModal = ({ isOpen, onClose, orderTotal, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const stripePromise = stripeService.getStripeInstance();

  if (!isOpen) return null;

  const handleCashPayment = () => {
    onPaymentComplete('Cash', 'CASH_' + Date.now());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setPaymentMethod('stripe')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard size={24} className="text-blue-600" />
              </div>
              <span className="font-medium text-gray-800">Credit/Debit Card</span>
              {paymentMethod === 'stripe' && (
                <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💵</span>
              </div>
              <span className="font-medium text-gray-800">Cash on Delivery</span>
              {paymentMethod === 'cash' && (
                <div className="ml-auto w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Stripe Card Payment Form */}
          {paymentMethod === 'stripe' && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                orderTotal={orderTotal}
                onPaymentComplete={onPaymentComplete}
                onClose={onClose}
              />
            </Elements>
          )}

          {/* Cash on Delivery */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800">₹{orderTotal}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💵 Pay cash when your order is delivered to your room
                </p>
              </div>

              <button
                onClick={handleCashPayment}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Confirm Order (Cash on Delivery)
              </button>
            </div>
          )}

          {/* Security Badge */}
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;