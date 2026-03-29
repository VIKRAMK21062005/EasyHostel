import { loadStripe } from '@stripe/stripe-js';
import api from './api';

// Initialize Stripe (will load once)
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const stripeService = {
  // Get Stripe instance
  getStripeInstance: getStripe,

  // Create Payment Intent
  createPaymentIntent: async (amount, orderId) => {
    try {
      const response = await api.post('/payments/create-payment-intent', {
        amount,
        currency: 'inr',
        orderId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  // Verify Payment
  verifyPayment: async (paymentIntentId) => {
    try {
      const response = await api.post('/payments/verify', {
        paymentIntentId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },
};

export default stripeService;