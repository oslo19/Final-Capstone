const Order = require("../models/Order");
const dayjs = require('dayjs'); 

// Create a new order
const createOrder = async (req, res) => {
  const {
    email,
    transactionId,
    price,
    source,
    items,
    address,
    mobileNumber,
    paymentType,
    schedule,
  } = req.body;

  if (
    !email ||
    !transactionId ||
    !price ||
    !source ||
    !items ||
    !address ||
    !mobileNumber ||
    !paymentType
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const now = new Date();
    const estimatedMilestones = {
      confirmed: new Date(now.getTime() + 5 * 60 * 1000), // +5 minutes
      shipped: new Date(now.getTime() + 15 * 60 * 1000), // +15 minutes
      outForDelivery: new Date(now.getTime() + 30 * 60 * 1000), // +30 minutes
      delivered: new Date(now.getTime() + 45 * 60 * 1000), // +45 minutes
    };

    // Ensure the 'schedule' is a valid Date object
    const scheduleDate = new Date(schedule); // Convert the schedule string to a Date object

    const newOrder = new Order({
      ...req.body,
      schedule: scheduleDate, // Store as Date object
      estimatedMilestones,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order.", error });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, updates, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order); // Return the updated order
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Failed to update order.", error });
  }
};




// Get orders by email, status, or source
const getOrdersByEmailOrStatus = async (req, res) => {
  const { status, source } = req.query;

  if (!status || !source) {
    return res.status(400).json({ message: "Status and source are required to fetch orders." });
  }

  try {
    const query = {};

    // Ensure the status is 'order pending' and the source is 'cart'
    query.status = status;  // 'order pending'
    query['items.source'] = source;  // 'cart'

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};




// Get all orders (Admin view with pagination and optional source filtering)
const getAllOrders = async (req, res) => {
  const { status, source, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (status) query.status = status;
    if (source) query['items.source'] = source; // Add source filter

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["order pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: `Order updated to ${status}.`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status.", error });
  }
};


// Get confirmed schedules for a specific day
const getConfirmedSchedulesForDay = async (req, res) => {
  const { date } = req.query;

  console.log("Received date:", date);  // Log the received date for debugging

  if (!date) {
    return res.status(400).json({ message: "Date is required to fetch schedules." });
  }

  try {
    // Log all orders to see the data structure and schedules
    const orders = await Order.find();
    console.log("All orders fetched:", orders);

    // Now try to filter confirmed orders for the specific day
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const confirmedOrders = await Order.find({
      status: "confirmed",
      schedule: {
        $regex: `^${formattedDate}`,  // Match orders where the schedule starts with the formatted date
        $options: 'i',
      },
    });

    // Check how many confirmed orders were found for debugging
    console.log("Confirmed orders on the specific day:", confirmedOrders);

    // Extract the schedules (or any relevant data) from confirmed orders
    const unavailableSchedules = confirmedOrders.map(order => order.schedule);

    res.status(200).json(unavailableSchedules);
  } catch (error) {
    console.error("Error fetching confirmed schedules:", error);
    res.status(500).json({ message: "Failed to fetch schedules.", error });
  }
};






const getOrderByTransactionId = async (req, res) => {
  const { transactionId } = req.params;
  console.log("Received transactionId:", transactionId); // Debugging log

  try {
    const order = await Order.findOne({ transactionId });

    if (!order) {
      console.log("Order not found for transactionId:", transactionId); // Debugging log
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by transactionId:", error);
    res.status(500).json({ message: "Failed to fetch order.", error });
  }
};

const getAggregatedSalesReport = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const salesReport = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$price" },
          totalTax: { $sum: { $multiply: ["$price", 0.12] } }, // Assuming 12% tax
          totalProductsSold: {
            $sum: {
              $add: [
                { $size: "$items.menuItems" },
                { $size: "$items.rentalItems" },
                { $size: "$items.venueItems" },
              ],
            },
          },
        },
      },
    ]);

    if (salesReport.length === 0) {
      return res.status(200).json({
        totalOrders: 0,
        totalSales: 0,
        totalTax: 0,
        totalProductsSold: 0,
      });
    }

    res.status(200).json(salesReport[0]);
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Failed to generate sales report.", error });
  }
};



// Add an item to the order
const addItemToOrder = async (req, res) => {
  const { id } = req.params;
  const { menuItem, rentalItem, cartItems } = req.body;  // Include cartItems in request body

  if (!menuItem && !rentalItem && !cartItems) {
    return res.status(400).json({ message: "Menu item, Rental item, or Cart items are required" });
  }

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Add the new menu item or rental item to the order
    if (menuItem) {
      order.items.menuItems.push(menuItem);
    }

    if (rentalItem) {
      order.items.rentalItems.push(rentalItem);
    }

    // Add cartItems to the order
    if (cartItems) {
      // Ensure cartItems is an array and add them to the existing order's cartItems
      order.cartItems.push(...cartItems);
    }

    // Recalculate the total price after adding the new items (including cartItems)
    const totalPrice = calculateTotalPrice(
      order.items.menuItems, 
      order.items.rentalItems, 
      order.items.venueItems, 
      order.cartItems
    );

    // Calculate the remaining balance
    const totalPaid = order.totalPaid || 0;
    const remainingBalance = totalPrice - totalPaid;

    // Update the order's price and remaining balance
    order.price = totalPrice;  // Update the total price
    order.remainingBalance = remainingBalance;  // Update the remaining balance

    // Save the updated order to the database
    await order.save();

    // Return the updated order with the new total and remaining balance
    res.status(200).json(order);  // Send back the updated order

  } catch (error) {
    console.error("Error adding item to order:", error);
    res.status(500).json({ message: "Failed to add item", error });
  }
};



const calculateTotalPrice = (menuItems, rentalItems, venueItems, cartItems) => {
  let total = 0;

  // Calculate total for menu items
  menuItems.forEach(item => {
    total += item.price * item.quantity;  // Price multiplied by quantity for each menu item
  });

  // Calculate total for rental items
  rentalItems.forEach(item => {
    total += item.price * item.quantity;  // Price multiplied by quantity for each rental item
  });

  // Calculate total for venue items (if any)
  venueItems.forEach(item => {
    total += item.price * item.quantity;  // Price multiplied by quantity for each venue item
  });

  // Calculate total for cart items
  cartItems.forEach(item => {
    total += item.price * item.quantity;  // Price multiplied by quantity for each cart item
  });

  return total;
};


// Update order status and payment
const updateOrderStatusAndPayment = async (req, res) => {
  const { id } = req.params;
  const { status, paymentAmount } = req.body;

  // Valid status values
  const validStatuses = ["order pending", "confirmed", "completed", "cancelled", "partially paid"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // If payment amount is provided, calculate remaining balance
    if (paymentAmount) {
      const newRemainingBalance = Math.max(0, order.remainingBalance - paymentAmount);
      order.remainingBalance = newRemainingBalance;

      // If balance reaches 0, mark as fully paid and update status to completed
      if (newRemainingBalance === 0 && status !== "completed") {
        status = "completed"; // Change status to 'completed' if balance is 0
      }
    }

    // Update order status (regardless of whether a payment is entered)
    order.status = status;

    // Save updated order
    await order.save();
    
    res.status(200).json({ message: `Order updated to ${status}.`, order });
  } catch (error) {
    console.error("Error updating order status and payment:", error);
    res.status(500).json({ message: "Failed to update order status or payment.", error });
  }
};



const getAllConfirmedOrders = async (req, res) => {
  try {
    // Fetch all orders with status 'confirmed'
    const confirmedOrders = await Order.find({ status: 'confirmed' });

    res.status(200).json(confirmedOrders); // Return only confirmed orders as response
  } catch (error) {
    console.error("Error fetching confirmed orders:", error);
    res.status(500).json({ message: "Failed to fetch confirmed orders.", error });
  }
};

const updateOrderStatusByTransactionId = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  const validStatuses = ["order pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { transactionId }, // Match by transactionId
      { status },
      { new: true } // Return the updated document
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: `Order updated to ${status}.`, order });
  } catch (error) {
    console.error("Error updating order status by transactionId:", error);
    res.status(500).json({ message: "Failed to update order status.", error });
  }
};


module.exports = {
  createOrder,
  getOrdersByEmailOrStatus,
  getAllOrders,
  updateOrderStatus,
  getConfirmedSchedulesForDay,
  updateOrder,
  getOrderByTransactionId,
  getAggregatedSalesReport,
  addItemToOrder,
  updateOrderStatusAndPayment,
  getAllConfirmedOrders,
  updateOrderStatusByTransactionId
};
