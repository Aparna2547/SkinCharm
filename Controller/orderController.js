const Product = require("../model/productModel");
const Address = require("../model/addressModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const session = require("express-session");
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const { RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY} = process.env;


///for razorpay
// const razorpayInstance = new Razorpay({
//   key_id:RAZORPAY_ID_KEY,
//   key_secret:RAZORPAY_SECRET_KEY
// });


// const Razorpay = require('razorpay');
var instance = new Razorpay({ key_id: RAZORPAY_ID_KEY, key_secret: RAZORPAY_SECRET_KEY})

const generateRazorpay =  (orderId,total)=>{
  console.log(orderId,total);
  return new Promise((resolve,reject)=>{

var options = {
  amount: total*100,  // amount in the smallest currency unit
  currency: "INR",
  receipt: orderId
};
instance.orders.create(options, function(err, order) {
  if(!err){
    res.status(200).send({
      success:true,
      msg:"order Created",
      order_id:orderId,
      amount:total,
      key_id:RAZORPAY_ID_KEY,
    })
  }
  else{
    res.status(400).send({success:false,msg:"Something went wrong"});
  }
  console.log(order);
  resolve(order)
});
  })
}







//rendering the placeorder
exports.loadPlaceOrder = async (req, res,next) => {
  try {
    res.render("placeOrder");
  } catch (error) {
    console.log(error);
    next(error)
  }
};

//delivery
exports.Delivery = async (req, res,next) => {
  try {
    res.render("Delivery");
  } catch (error) {
    console.log(error);
    next(error)
  }
};

//post for place order
exports.orderPlace = async (req, res) => {
  try {
    const user = req.session.userId;
    // console.log(user);
    const address = req.session.addressId;
    // console.log("address" + address);
    const payment = req.body.payment;
    console.log(payment);
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
    if (payment === "cash") {
      console.log("cash called..");
      // const orderTopush = []
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
        
        await Order.updateOne({ user }, { $push: { orders: order } });
        console.log("Order pushed...");
      }
      await Cart.updateOne({ user }, {$set:{product:[]}});
      // res.redirect("/Delivery");
      res.json({cod:true})
    }
    else if(payment === 'online'){
      console.log(total)
      let orderDetails = await generateRazorpay("sdsdssd",total)
      let order = await Cart.updateOne({ user }, {$set:{product:[]}});
      console.log(orderDetails);
      res.json({online:1,order:orderDetails})
        // res.redirect("/Delivery");
    }
    


  //   //reducing the stock
  //   let product ='',count =0
  //   for(let i=0;i<cart.product.length;i++){
  //     product = ((cart.product[i].product_id).toString())
  //     count = cart.product[i].count
  //     await Product.findByIdAndUpdate({_id:product},{$inc:{stock:-count}})
  //   }
  } catch (error) {
    console.log(error);
  }

};



//order placed for online 
exports.paymentMethod = async(req,res)=>{
  try {
    
  } catch (error) {
    console.log(error.message);
  }
}













//cancel order
exports.cancelOrder  = async (req,res,next)=>{
try{
  const user = req.session.userId;
  const orderId = req.query._id;
  console.log(orderId);

  await Order.updateOne(
    { user, 'orders._id': orderId },
    {
      $set: {
        'orders.$.orderStatus': 5,
        'orders.$.orderDate': new Date()
      }
    }
  );

  res.redirect("/orders&returns");
}catch(error){
console.log(error);
next(error)
}
}







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
exports.changeOrder = async (req, res,next) => {
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
    next(error)
  }
};

//view details
exports.viewDetails = async (req, res,next) => {


  // const id = req.query.id;
  // console.log(id);
  
  // try {
  //   const order = await Order.findOne({ 'orders._id': id });
  
  //   if (!order) {
  //     return res.status(404).json({ message: 'Order not found' });
  //   }
  
  //   // Now, you can access the specific order within the "orders" array
  //   const foundOrder = order.orders.find(orderItem => orderItem._id.toString() === id);
  
  //   if (!foundOrder) {
  //     return res.status(404).json({ message: 'Order item not found' });
  //   }
  
  //   // Send the found order data as a JSON response
  //   res.status(200).json(foundOrder);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: 'Internal Server Error' });
  // }
  

  try {
    
    const id = req.query.id;
    console.log(id);
    const order = await Order.findOne({'orders._id':id}).populate('orders.product_id')
    
    const orderFound = order.orders.find(orderItem =>orderItem._id.toString()===id)
    console.log("orderfound",orderFound);
  
    res.render("admin/viewDetails", { orderFound });
    // console.log(selectedOrder);
  } catch (error) {
    console.log(error);
    next(error)
  }
 };

//orders and returns
exports.ordersAndReturns = async (req,res,next)=>{
  try {
    const user = req.session.userId;
    console.log(user);
    
    let orderData = await Order.findOne({user}).populate('orders.product_id')
    orderData = orderData?.orders.reverse()
    console.log(orderData);
    res.render('orders&returns',{orderData})
  } catch (error) {
    console.log(error);
    next(error)
  }
}

//orer
