import { Order } from "../model/OrderModel.js";
import { Product } from "../model/ProductModel.js";

// Place Custom Order
export const placeCustomOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { description, items, estimatedPrice, specialInstructions } = req.body;

    if (!description || !estimatedPrice) {
      return res.status(400).json({ 
        message: "Description and estimated price are required" 
      });
    }

    const newOrder = await Order.create({
      user: userId,
      orderType: 'custom',
      customOrder: {
        description,
        estimatedPrice,
        items: items || [],
      },
      totalPrice: estimatedPrice,
      status: 'Pending',
      paymentStatus: 'Pending',
      specialInstructions,
    });

    res.status(201).json({
      success: true,
      message: "Custom order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing custom order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Place Parcel Pickup Request
export const requestParcelPickup = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      courierName, 
      trackingNumber, 
      senderName, 
      deliveryRoom,
      pickupLocation,
      specialInstructions 
    } = req.body;

    if (!courierName || !deliveryRoom) {
      return res.status(400).json({ 
        message: "Courier name and delivery room are required" 
      });
    }

    // Parcel pickup service charge
    const serviceCharge = 20; // ₹20 for parcel pickup

    const newOrder = await Order.create({
      user: userId,
      orderType: 'parcel',
      parcelDetails: {
        courierName,
        trackingNumber,
        senderName,
        pickupLocation: pickupLocation || 'Main Gate',
        deliveryRoom,
      },
      totalPrice: serviceCharge,
      status: 'Pending',
      paymentStatus: 'Pending',
      specialInstructions,
    });

    res.status(201).json({
      success: true,
      message: "Parcel pickup request placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error requesting parcel pickup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Regular product order (existing)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products, paymentMethod, specialInstructions } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productId}` 
        });
      }
      totalPrice += product.price * (item.quantity || 1);
    }

    const newOrder = await Order.create({
      user: userId,
      orderType: 'product',
      products: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity || 1,
      })),
      totalPrice,
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod,
      specialInstructions,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Payment Status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentId, paymentMethod } = req.body;

    const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus, paymentId, paymentMethod },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders (existing - keep this)
export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("user", "name email phone address")
      .populate("products.product", "product price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      orders: allOrders || [],
    });
  } catch (error) {
    console.error("Error retrieving all orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user orders (existing - keep this)
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("products.product", "product price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User orders retrieved successfully",
      orders: orders || [],
    });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update order status (existing - keep this)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Assigned", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Cancel order (existing - keep this)
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found or unauthorized access" 
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ 
        message: "Delivered orders cannot be cancelled" 
      });
    }

    order.status = "Cancelled";
    
    // Refund if payment was made
    if (order.paymentStatus === "Paid") {
      order.paymentStatus = "Refunded";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};