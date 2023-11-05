const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const session = require("express-session");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { log } = require("console");
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
    const user = req.session.userId;
    
     
    //getting cart product count - badge
    let cartCount = 0
    if (user) {
      const cart = await Cart.findOne({ user });
      // Assuming you want to calculate cartCount based on the user's cart items
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    res.render("Delivery",{cartCount});
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
        await Product.findByIdAndUpdate(cart[i].product_id, { $inc: { stock: -cart[i].count } });

      
      }

      let newOrder = await new Order({
        user,
        orders:orderTopush
      })

      await newOrder.save();
      // await Order.updateOne({ user }, { $push: { orders: order } });
      console.log("Order pushed...");

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


    else if(method.payment =="wallet"){
        console.log("wallet");
        const orderTopush = []

        let cartAmount = 0

        for (let i = 0; i < cart.length; i++) {
          let order = {
            product_id: cart[i].product_id,
            count: cart[i].count,
            price: cart[i].price * cart[i].count,
            address: selectedAddress.address[0],
            payment: "Wallet",
            orderStatus: 1,
            orderDate: new Date(),
          };
          orderTopush.push(order)

          //reducing stock
          await Product.findByIdAndUpdate(cart[i].product_id, { $inc: { stock: -cart[i].count } });
          
          cartAmount += cart[i].price * cart[i].count
      }

        let newOrder = await new Order({
            user,
            orders:orderTopush
        })

        await newOrder.save();
            console.log(cartAmount);

            await User.findByIdAndUpdate(user, {
                $set: { walletApplied: false },
                $inc: { wallet: -cartAmount },
                $push: {
                walletHistory: {
                    transactionType: "Product purchase",
                    method: "Debit",
                    amount: cartAmount,
                    date: Date.now(),
                },
                },
            });

          await Cart.updateOne({ user }, { $set: { product: [] } });

          res.json({ status: "WALLET" });

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
                

        //reducing the stock
        await Product.findByIdAndUpdate(cart[i].product_id, { $inc: { stock: -cart[i].count } });
      }

      let newOrder = await new Order({
        user,
        orders:orderTopush
    })

    await newOrder.save();


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

//increasing the product stock
      const order = await Order.findOne(
        {
          user: user,
          'orders._id': orderId,
        },
        { 'orders.$': 1 }
    ).populate('orders.product_id')

    console.log(order);
    let product  = ((order.orders[0].product_id._id))
    let productCount = order.orders[0].count

    await Product.findByIdAndUpdate({_id:product},{$inc:{stock:productCount}})



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
   
    
     
    //getting cart product count - badge
    let cartCount = 0
    if (user) {
      const cart = await Cart.findOne({ user });
      // Assuming you want to calculate cartCount based on the user's cart items
      if (cart) {
        cartCount = cart.product.length;
      }
    }
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


    res.render("orders&returns", { orderData,cartCount });
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


 
    //getting cart product count - badge
    let cartCount = 0
    if (user) {
      const cart = await Cart.findOne({ user });
      // Assuming you want to calculate cartCount based on the user's cart items
      if (cart) {
        cartCount = cart.product.length;
      }
    }
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
    res.render("orderDetails", { orderFound,cartCount});
  } catch (error) {
    console.error(error);
    next(error);
  }
};




//loading check out
exports.loadCheckOut = async (req,res,next)=>{
  try {
      const user = req.session.userId
      console.log(user);

      //getting wallet balance
      let userFound = await User.findById(user)


      // console.log("userFound",userFound);
      const walletAmount = userFound.wallet;
      const walletApplied = userFound.walletApplied;
  
   
      //getting cart product count - badge
      let cartCount = 0
      if (user) {
        const cart = await Cart.findOne({ user });
        // Assuming you want to calculate cartCount based on the user's cart items
        if (cart) {
          cartCount = cart.product.length;
        }
      }
      const cartData = await Cart.findOne({user}).populate('product.product_id')
      const addressData = await Address.findOne({user})
      let subTotal = cartData?.product.reduce((acc,item)=>{
          const totalItem = item.price * item.count;
          return acc + totalItem
      },0)

      if(walletApplied){
        subTotal=0
      }


     //reducing walet amount

     

     
      // const couponFound = await Coupon.findOne({couponName:cartData?.isCouponApplied})
      // if(couponFound){
      //     total =subTotal- couponFound.maximumDiscount
      // }
  
  
    res.render('checkout',{addressData,subTotal,cartCount,walletAmount,walletApplied})
  } catch (error) {
      console.log(error);
      next(error)
  }
}

//applying wallet
exports.applyWallet = async (req,res)=>{
  try {
    const action = req.query.action;
    const user = req.session.userId;
    console.log(action);
    const cartData = await Cart.findOne({user}).populate('product.product_id')
    let subTotal = cartData?.product.reduce((acc,item)=>{
      const totalItem = item.price * item.count;
      return acc + totalItem
  },0)
    if(action =='USE'){
      console.log(user);
      await User.findByIdAndUpdate(user,{$set:{walletApplied:true}})
      res.json({success:true,message:"wallet applied",subTotal})

    }else if(action == "REMOVE"){
      await User.findByIdAndUpdate(user,{$set:{walletApplied:false}})
      res.json({success:true,message:"wallet removed",subTotal})
    }
  } catch (error) {
    console.log(error);
  }
}
