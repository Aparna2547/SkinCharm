const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const session = require("express-session");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

///for razorpay
// const razorpayInstance = new Razorpay({
//   key_id:RAZORPAY_ID_KEY,
//   key_secret:RAZORPAY_SECRET_KEY
// });

var instance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

//rendering the placeorder
exports.loadPlaceOrder = async (req, res, next) => {
  try {
    res.render("placeOrder");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//delivery
exports.Delivery = async (req, res, next) => {
  try {
    res.render("Delivery");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//post for place order
exports.orderPlace = async (req, res) => {
  try {
    const user = req.session.userId;
    // console.log(user);
    const method = req.body;
    console.log(method);
    const address = req.session.addressId;
    const selectedAddress = await Address.findOne(
      { user },
      { address: { $elemMatch: { _id: address } } }
    );
    const cartData = await Cart.findOne({ user });
    const cart = cartData.product;
    // console.log("cart details" + cart[0].product_id);
    const userOrderFound = await Order.findOne({ user });
    // console.log("userFound");
    if (!userOrderFound) {
      // await Order.insertOne({user,orders:[]})
      // console.log("hey");
      await Order.updateOne(
        { user },
        { $set: { orders: [] } },
        { upsert: true }
      );
    }

    // console.log(selectAddress);
    if (method.payment === "cash") {
      console.log("cash called..");
      const orderTopush = []
      for (let i = 0; i < cart.length; i++) {
        let order = {
          product_id: cart[i].product_id,
          count: cart[i].count,
          price: cart[i].price * cart[i].count,
          address: selectedAddress.address[0],
          payment: "Cash on delivery",
          orderStatus: 1,
          orderDate: new Date(),
        };
        orderTopush.push(order)
        let newOrder = await new Order({
          user,
          orders:orderTopush
        })
        await newOrder.save();
        // await Order.updateOne({ user }, { $push: { orders: order } });
        console.log("Order pushed...");
      }
      await Cart.updateOne({ user }, { $set: { product: [] } });
      // res.redirect("/Delivery");
      res.json({ status: "CASH" });
    } else if (method.payment === "online") {
      const cartData = await Cart.findOne({ user }).populate(
        "product.product_id"
      );
      // console.log(cartData);
      const total = cartData?.product.reduce((acc, item) => {
        const totalItem = item.price * item.count;
        return acc + totalItem;
      }, 0);
      var options = {
        amount: total * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: " ",
      };
      instance.orders.create(options, (err, order) => {
        if (err) {
          console.log(err);
        } else {
          console.log(cart);
          res.json({ status: "ONLINE", order: cart, order });
        }
      });
    }

    //reducing the stock
    let product = "",
      count = 0;
      // let productId = cart.product_id;
      // console.log(productId)

    for (let i = 0; i < cart.product.length; i++) {
      product = cart.product[i].product_id.toString();
      count = cart.product[i].count;
      await Product.findByIdAndUpdate(product, { $inc: { stock: -count } });
      console.log("stock changed");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//verify payment for razorpay
exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findOne({ _id: userId });
    const payment = req.body.payment;

    //order details from razorpay
    const order = req.body.order;
    //user cart array for confirm order
    // const cart = req.body.cart
    const cartData = await Cart.findOne({ user: userId });
    console.log("cart", cartData);
    const cart = cartData.product;

    //taking address from the session
    const address = req.session.addressId;
    const selectedAddress = await Address.findOne(
      { user },
      { address: { $elemMatch: { _id: address } } }
    );

    //verifying payment is confirmed or not
    let hmac = crypto.createHmac("sha256", RAZORPAY_SECRET_KEY);
    hmac.update(payment.razorpay_order_id + "|" + payment.razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == payment.razorpay_signature) {
      const orderTopush = []
      for (let i = 0; i < cart.length; i++) {
        let order = {
          product_id: cart[i].product_id,
          count: cart[i].count,
          price: cart[i].price * cart[i].count,
          address: selectedAddress.address[0],
          payment: "Online",
          orderStatus: 1,
          orderDate: new Date(),
        };
        orderTopush.push(order);
        let newOrder = await new Order({
          user,
          orders:orderTopush
        })
        await newOrder.save();
        // await Order.updateOne({ user }, { $push: { orders: order } });
        console.log("Order pushed...");
      }
      await Cart.updateOne({ user }, { $set: { product: [] } });
      res.json({ paymentSuccess: true });
    } else {
      res.json({ paymentSuccess: false });
    }
  } catch (error) {
    console.log(error);
  }
};
//order placed for online
// exports.paymentMethod = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error.message);
//   }
// };

//cancel order
exports.cancelOrder = async (req, res, next) => {
 
    try {
      const user = req.session.userId;
      const orderId = req.query._id;
      const productId  = req.query.productId// The product_id you want to update
console.log(orderId,"productId",productId);

      // const order = await Order.findOne(
      //   {
      //     user: user,
      //     'orders._id': orderId,
      //   },
      //   { 'orders.$': 1 }
      // ).populate('orders.product')


      await Order.findOneAndUpdate({
        user: user,
        'orders._id': orderId,
      },
      {
        $set: {
          'orders.$.orderStatus': 5,
          'orders.$.orderDate': Date.now()
        },
      });
  
    // const order = await Order.findOne({_id:orderId})
    // const product = order.orders.find((pro)=>{
    //   return pro.product_id== productId
    // })
    // // console.log(product);

    // product.orderStatus = 5
    //  product.orderDate = new Date()
    // await order.save()
    // console.log("Order cancelled");

     res.redirect('/orders&returns')
    
    } catch (error) {
      console.error("Error updating order:", error);
    }
    

};

//admin controller
exports.orderLoad = async (req, res) => {
  try {
    let orderData = await Order.find({})
      .populate({
        path: "orders",
        populate: {
          path: "product_id",
        },
      })
      .populate("user")
      .exec();
    orderData = orderData.reverse();
    // console.log(orderData);
    res.render("admin/order", { orderData });
  } catch (error) {
    console.log(error);
  }
};

//shipping order status
exports.changeOrder = async (req, res, next) => {
  try {
    const order = req.query.id;
    const Action = parseInt(req.query.action);
    // const user = req.session.userId;
    const selectedOrder = await Order.findOne(
      {},
      {
        orders: { $elemMatch: { _id: order } },
      }
    );
    console.log("selectedorder" + selectedOrder);

    await Order.findOneAndUpdate(
      {
        "orders._id": order,
      },
      {
        $set: {
          "orders.$.orderStatus": Action,
          "orders.$.orderDate": new Date(),
        },
      }
    );

    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//view details
exports.viewDetails = async (req, res, next) => {
  try {
    const id = req.query.id;
    console.log(id);
    const order = await Order.findOne({ "orders._id": id }).populate(
      "orders.product_id"
    );

    const orderFound = order.orders.find(
      (orderItem) => orderItem._id.toString() === id
    );
    // console.log("orderfound", orderFound);
    res.render("admin/viewDetails", { orderFound });
    // console.log(selectedOrder);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//orders and returns
exports.ordersAndReturns = async (req, res, next) => {
  try {
    const user = req.session.userId;
    console.log(user);
     let orderData = await Order.find({user})
      .populate({
        path: "orders",
        populate: {
          path: "product_id",
        },
      })
      .exec();
    orderData = orderData.reverse();
    // console.log(orderData);


    res.render("orders&returns", { orderData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//view order details in user side

// exports.viewDetailsUser = async (req, res, next) => {
//   try {
//     const id = req.query.id;
//     console.log(id);
//     const order = await Order.findOne({ "orders._id": id }).populate(
//       "orders.product_id"
//     );

//     const orderFound = order.orders.find(
//       (orderItem) => orderItem._id.toString() === id
//     );
//     console.log("orderfound", orderFound);

//     res.render("orderDetails", { orderFound });
//     // console.log(selectedOrder);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
exports.viewDetailsUser = async (req, res, next) => {
  try {
    const user = req.session.userId;
    const id = req.query.id;
    console.log("id of the order: " + id);

    // Finding the specific order
    const order = await Order.findOne(
      {
        user,
        orders: { $elemMatch: { _id: id } }
      },
      { 'orders.$': 1 }
    );

    if (!order) {
      // Handle the case where the order with the specified ID is not found
      return res.status(404).send("Order not found");
    }

    const orderFound = order.orders.find(
      (orderItem) => orderItem._id.toString() === id
    );
    console.log("orderfound", orderFound);

    // Render the response or perform any other necessary actions
    res.render("orderDetails", { orderFound });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

