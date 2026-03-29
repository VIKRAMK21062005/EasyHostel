import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createPaymentIntent, 
  verifyPayment,
  handleStripeWebhook 
} from '../controller/paymentController.js';

const router = express.Router();

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/verify', protect, verifyPayment);

// Webhook route (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
