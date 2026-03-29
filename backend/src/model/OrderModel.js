import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderType: {
    type: String,
    enum: ['product', 'custom', 'parcel'],
    default: 'product',
  },
  // For regular product orders
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  }],
  // For custom orders
  customOrder: {
    description: String,
    estimatedPrice: Number,
    items: [String],
  },
  // For parcel pickup
  parcelDetails: {
    courierName: {
      type: String,
      enum: ['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Other'],
    },
    trackingNumber: String,
    senderName: String,
    pickupLocation: {
      type: String,
      default: 'Main Gate',
    },
    deliveryRoom: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Card', 'Wallet'],
  },
  paymentId: String,
  specialInstructions: String,
}, { 
  timestamps: true 
});

export const Order = mongoose.model('Order', orderSchema);