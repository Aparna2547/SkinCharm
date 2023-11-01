const adminRoute = require("../Router/userRouter");
const adminController = require("../Controller/adminController");
const Admin = require("../model/adminModel");
const User = require("../model/userModel");
const Category = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const session = require("express-session");
const bcrypt = require("bcrypt");

//rendering login page
exports.loadLogin = async (req, res) => {
  try {
    //warning messages
    var context = req.app.locals.specialcontext;
    req.app.locals.specialcontext = null;
    res.render("admin/adminlogin");
  } catch (error) {
    console.log(error);
  }
};

//rendering home page
exports.LoadHome = async (req, res) => {
  try {
    //for warning mesage
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = null;

    //ORDERS
    //for finding total orders
    let totalOrders = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $group: {
          _id: null,
          totalOrder: { $sum: 1 },
        },
      },
    ]);
    let count;
    totalOrders.length > 0 ? (count = totalOrders[0].totalOrder) : 0;
    // console.log("totalOrders",count);

    //for deliveed products
    let deliveredProduct = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $match: {
          "orders.orderStatus": 4,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
        },
      },
    ]);
    let deliveredprdt;
    deliveredProduct.length > 0
      ? (deliveredprdt = deliveredProduct[0].totalCount)
      : 0;
    // console.log("delivered products",deliveredprdt);

    //for cancelled products
    let cancelledProduct = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $match: {
          "orders.orderStatus": { $in: [5, 6] },
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalPrice: { $sum: "$orders.price" },
        },
      },
    ]);

    let cancelledprdt, cancelcash;
    cancelledProduct.length > 0
      ? (cancelledprdt = cancelledProduct[0].totalCount)
      : 0;
    cancelledProduct.length > 0
      ? (cancelcash = cancelledProduct[0].totalPrice)
      : 0;
    // console.log("cancelled product" , cancelledprdt ,"cash profit",cancelcash);
    //for counting all users
    let totalUser = await User.find({}).count();

    //for counting the blocked users
    let blockedUser = await User.find({ isBlocked: true }).count();

    //for finding recent users
    let recentUser = await User.count({
      $expr: {
        $eq: [{ $month: "$joinedDate" }, new Date().getMonth() + 1],
      },
    });

    //Total Profit including cancelled order
    let totalProfit = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $match: {
          "order.orderStatus": { $nin: [5, 6] },
        },
      },
      {
        $group: {
          _id: null,
          totalOrderPrice: { $sum: "$orders.price" },
        },
      },
    ]);
    let total;
    totalProfit.length > 0 ? (total = totalProfit[0].totalOrderPrice) : 0;
    // console.log("total Profit: ",total);

    // getting total profit excluding cancelled order
    let finalProfit = total - cancelcash;
    // console.log("final profit",finalProfit);

// total profit 
    let profit = (finalProfit*12)/100;
    console.log("cancelcash"+cancelcash);

   


    res.render("admin/home", {
      totalOrders: count,
      deliveredProduct: deliveredprdt,
      cancelledProduct: cancelledprdt,
      totalUser,
      blockedUser,
      recentUser,
      finalProfit,
      profit,
      cancelcash
    });
  } catch (error) {
    console.log(error);
  }
};

//salesREPORT loading page
// exports.salesReportLoad = async (req,res)=>{
//   try {
//    res.render('admin/salesReport')
//   } catch (error) {
//     console.log(error);
//   }
// }





//salesREPORT
exports.salesReport = async (req, res) => {
   try {
    let startDate = req.body.startDate
    let startDateISO = new Date(startDate)
    let endDate = req.body.endDate
    let endDateISO = new Date(endDate)
    console.log(startDate,startDateISO);

  
  const sales = await Order.aggregate([
    {
        $match: {
            "orders.orderStatus": 4,
            "orders.orderDate": {
                $gte: startDateISO,
                $lte: endDateISO
            }
        }
    },
    {
        $unwind: "$orders"
    },
    {
        $lookup: {
            from: "users", // Replace with the actual name of the user collection
            localField: "user",
            foreignField: "_id",
            as: "userDetails"
        }
    },
    {
        $addFields: {
            paymentMethod: "$orders.payment",
            userName: { $arrayElemAt: ["$userDetails.username", 0] },
            amount: { $multiply: ["$orders.price", "$orders.count"] },
            date: "$orders.orderDate",
            // category: "$orders.category"
        }
    },
    {
        $project: {
            _id: "$_id", // Use the main document's _id as orderId
            paymentMethod: 1,
            userName: 1,
            amount: 1,
            date: 1,
            // category: 1
        }
    }
]);    
  console.log(sales);

        res.render('admin/salesReport', { sales, startDate, endDate })
    } catch (error) {
        next(error)
    }

};

//login page -POST admin side

exports.Login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email,password);
    const adminFound = await Admin.findOne({ email });
    // console.log(adminFound);
    if (adminFound) {
      const passwordMatch = await bcrypt.compare(password, adminFound.password);
      if (passwordMatch) {
        req.session.adminId = adminFound._id;
        // req.session.admin=Admin.email;
        res.redirect("/admin/home");
        console.log("welcome to home");
      } else {
        req.app.locals.specialcontext = "User not found";
        res.redirect("/admin");
        console.log("admin mot found");
      }
    } else {
      req.app.locals.specialContext = "No details";
      res.redirect("/admin");
      console.log("admin not found");
    }
  } catch (error) {
    console.log(error);
  }
};

//admin side user page rendering

exports.loadUser = async (req, res) => {
  try {
    // //for warning message
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = null;
    //search in the home

    var search = "";
    if (req.query.search) {
      search = req.query.search || "";
    }
    console.log(search);

    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }

    const limit = 3;

    const userData = await User.find({
      username: { $regex: "^" + search, $options: "i" },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    // console.log(userData);

    const userCount = await User.find({
      username: { $regex: "^" + search, $options: "i" },
    }).countDocuments();
    if (userData) {
      // console.log(userData);
      res.render("admin/userpage", {
        userData,
        totalPages: Math.ceil(userCount / limit),
        currentPage: page,
        search,
      });
    } else {
      req.app.locals.specialContext = "user not found";
      res.render("admin/userpage", { userData, context });
    }
  } catch (error) {
    console.log(error);
  }
};

// //block and unblock user in admin


exports.blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("id of the catgory"+id);
    // find user by Id from the db
    const user = await User.findOne({ _id: id });
    // console.log(user);

    if (user.isBlocked == false) {
      await User.updateOne({ _id: id }, { $set: { isBlocked: true } });
      res.redirect("/admin/user");
    } else {
      await User.updateOne({ _id: id }, { $set: { isBlocked: false } });
      res.redirect("/admin/user");
    }
  } catch (error) {
    console.log(error);
  }
};

//logout
exports.adminLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.redirect("/admin");
    }
  });
};
