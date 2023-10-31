const userRoute = require("../Router/userRouter");
const userController = require("../Controller/usercontroller");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Address = require("../model/addressModel");
const Category = require("../model/categoryModel");
const Product = require("../model/productModel");
const Wishlist = require("../model/wishlistModel");
const Order = require("../model/orderModel");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");

const authToken = process.env.AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const accountId = process.env.ACC_SID;
const client = require("twilio")(accountId, authToken);

//rendering login page
exports.loadLogin = async (req, res) => {
  try {
    //warning mesage
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = null;

    res.render("login", { context });
  } catch (error) {
    console.log(error);
  }
};

let d;
//login page
exports.Login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    console.log(mobile, password);
    const userFound = await User.findOne({ mobile });
    d = mobile;
    if (userFound) {
      // console.log("user found,,,,");
      if (userFound.isBlocked == true) {
        req.app.locals.specialContext = "You have been blocked.";
        return res.redirect("/login");
      }
      const hashedpassword = userFound.password;
      const pswdmatch = await bcrypt.compare(password, hashedpassword);
      console.log(pswdmatch);
      if (pswdmatch) {
        req.session.userId = userFound._id;
        // console.log("jjj"+req.session.userId);
        return res.redirect("/");
      } else {
        req.app.locals.specialContext =
          "mobile number and password are invalid";
        res.redirect("/login");
      }
    } else {
      req.app.locals.specialContext = "There is no login details..";
      res.redirect("/login");
      console.log("login not match");
    }
  } catch (error) {
    console.log(error);
  }
};

//rendering signup page
exports.LoadRegister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error);
  }
};

//Signup page
let details;
exports.signUp = async (req, res) => {
  try {
    const { username, mobile, email, password } = req.body;
    details = { username, mobile, email, password };
    console.log(username, mobile, password);
    const findUser = await User.findOne({ mobile });
    if (findUser) {
      req.app.locals.specialContext = "Mobile number already exist";
      res.redirect("/login");
      console.log("user already exists");
    } else {
      client.verify.v2.services(serviceId).verifications.create({
        to: `+91${mobile}`,
        channel: "sms",
      });
      req.session.otpPageForSignUp = true;
      //res.redirect("/otp");
      console.log(req.session.otpPageForSignUp);
      res.redirect(`/verifyOtp?mobile=${mobile}`);
    }
  } catch (error) {
    console.log(error);
  }
};

//rendering otp page
exports.loadOtp = async (req, res) => {
  try {
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = null;
    if (req.session.otpPageForSignUp == true) {
      res.render("otp", { context });
    } else {
      res.redirect("/register");
    }
  } catch (error) {
    console.log(error);
  }
};

//otp verify
exports.verifyOtp = async (req, res) => {
  try {
    const { username, mobile, password } = details;
    const { otp } = req.body;
    const ver_check = await client.verify.v2
      //Checking the otp is correct
      .services(serviceId)
      .verificationChecks.create({ to: `+91${mobile}`, code: otp });
    if (ver_check.status === "approved") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        mobile,
        password: hashedPassword,
        joinedDate: new Date(),
      });
      console.log("data got it");
      const userData = await newUser.save();
      if (userData) {
        // req.app.locals.specialContext = "Registration successful. Please login";
        res.redirect("/");
        console.log("registartion successful");
      }
    } else {
      console.log("otp error");
      req.app.locals.specialContext = "invalid otp";
      res.redirect("/otp");
    }
  } catch (error) {
    console.log(error);
  }
};

//rendering home page
exports.LoadHome = async (req, res, next) => {
  try {
    const category = await Category.find({ isListed: true });
    res.render("index", { category });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//shop page rendering
exports.LoadShopPage = async (req, res, next) => {
  try {
    const user = req.session.userId;

    
    //get users wishlist
    const wishlist = await Wishlist.findOne({ user });
    console.log("wishlist",wishlist);


// //for wishlisted in shop page
//         //taking wishlisted items id as strings
let productIdsAsString = [];

if (user) {
    const wishlisted = await Wishlist.findOne({ user });
    if (wishlisted && wishlisted.product && wishlisted.product.length > 0) {
        // Assuming that product_id is stored as ObjectId in the database
        productIdsAsString = wishlisted.product.map(item => item.product_id.toString());
    }
}

// Now you can use the productIdsAsString array as needed.


//         let productIdsAsString = []
//         const wishlisted = await Wishlist.findOne({user})
//         if(user && wishlisted){
//             productIdsAsString = wishlisted.product.map(item => item.product_id.toString());
//         }
  
    //category for listing
    const category = await Category.find({ isListed: true });

    //filter
    //category filter
    let categorySelected = req.query.category || "";
    let categoryFind = await Category.find(
      { category: { $in: categorySelected } },
      { _id: 1 }
    );
    if (!categoryFind.length) {
      categoryFind = await Category.find({}, { _id: 1 });
    }

    let categoryStrings = categoryFind.map((val) => val._id.toString());
    let categoryToFront = req.query.category || "";

    //brands filter
    //for db search
    let brandSelected = req.query.brand || category[0].brands;
    //for front end check box selection
    let brandsToFront = req.query.brand || "";

      //sort by price setting
      let sort = req.query.sort || {addedDate : 1}
    //   console.log(sort);
      let sortToFront = sort
      if(sort == 1){
          sort = {sellingPrice:1} 
      }else if(sort == -1){
          sort = {sellingPrice:-1}
      }


    //search filter
    let search = req.query.search || ''


    //pagination
    let limit = 6;
    const page = req.query.page || 1;



  const products = await Product.find({
      isListed: true,
      brand: brandSelected,
      category: categoryStrings,
      $or:[
        {productname:{$regex:search,$options:'i'}},
        {brands :{$regex:search,$options:'i'}}
      ]
    }).limit(limit*1).skip((page-1)*limit).sort(sort);

    
  const productsCount = await Product.find({
    isListed: true,
    brand: brandSelected,
    category: categoryStrings,
    $or:[
      {productname:{$regex:search,$options:'i'}},
      {brands :{$regex:search,$options:'i'}}
    ]
  }).countDocuments()


    res.render("shop", {
      products,
      category,
      wishlist,
      brands: category[0].brands,
      brandsToFront,
      categoryToFront,
      search,
      sortToFront,
      page,
      limit,
      totalPages: Math.ceil(productsCount/limit),
      productIdsAsString
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//single page
exports.singleProduct = async (req, res, next) => {
  try {
    const user = req.session.userId;
    const id = req.query.id;
    let productFound, wishlistFound;
    if (user) {
      productFound = await Cart.findOne(
        { user },
        { product: { $elemMatch: { product_id: id } } }
      );
      wishlistFound = await Wishlist.findOne(
        { user },
        { product: { $elemMatch: { product_id: id } } }
      );
    }
    console.log(productFound);

    console.log("id of single page" + id);
    const singleProduct = await Product.findById({ _id: id }).populate(
      "category"
    );
    //  console.log("singleproduct data"+singleProduct);
    if (singleProduct) {
      res.render("singleproduct", {
        singleProduct,
        productFound,
        wishlistFound,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// user profile page -GET
exports.loadUserProfile = async (req, res, next) => {
  try {
    const mobile = d;
    console.log(mobile);
    const user = await User.findOne({ mobile });
    // req.session.userId = user._id
    console.log(user);
    res.render("userProfile", { user });
    console.log("rendering userprofile.....");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// user profile page - POST
exports.profile = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

//load edit profile - GET
exports.LoadUserEditProfile = async (req, res, next) => {
  try {
    const id = req.query._id;
    console.log(id);
    const editData = await User.findOne({ _id: id });
    console.log(editData);
    res.render("editProfile", { data: editData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//edit profile -POST
exports.editProfile = async (req, res) => {
  try {
    const id = req.body.id;
    // console.log("id of the id"+id)
    const { name, mobile, email } = req.body;
    // console.log(name,mobile,email);
    const data = await User.findOne({ _id: id });
    if (data) {
      await User.findByIdAndUpdate(
        { _id: id },
        { $set: { name, mobile, email } }
      );
      console.log("User profile edited..." + data);
      res.redirect("/Profile");
    } else {
      console.log("not edited data");
    }
  } catch (error) {
    console.log(error);
  }
};

//user logout
exports.userLogOut = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      } else {
        res.redirect("/login");
        console.log("User logged out");
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
