const adminRoute = require("../Router/userRouter");
const adminController = require("../Controller/adminController");
const Admin = require("../model/adminModel");
const User = require('../model/userModel')
const Category = require('../model/categoryModel')
const Product = require("../model/productModel")
const session = require("express-session");
const bcrypt = require('bcrypt')



//rendering login page
exports.loadLogin = async (req, res) => {
    try {
      //warning messages
      var context = req.app.locals.specialcontext;
      req.app.locals.specialcontext =null
      res.render('admin/adminlogin');
    } catch (error) {
      console.log(error);
    }
  };


  //rendering home page
  exports.LoadHome = async (req,res)=>{
    try {

          //for warning mesage
    var context = req.app.locals.specialContext
    req.app.locals.specialContext = null

        res.render('admin/home')
    } catch (error) {
        console.log(error);
    }
  }

//login page -POST admin side

exports.Login = async(req,res)=>{
     try {
     const email = req.body.email
     const password = req.body.password
      console.log(email,password);
      const adminFound = await Admin.findOne({email})
      console.log(adminFound);
      if(adminFound){
      const passwordMatch = await bcrypt.compare(password,adminFound.password)
       if(passwordMatch ){
             req.session.adminId = adminFound._id
          // req.session.admin=Admin.email;
            res.redirect('/admin/home')
            console.log("welcome to home");
        }
        else{
          req.app.locals.specialcontext="User not found"
            res.redirect('/admin')
            console.log("admin mot found");
        }

      }
      else{
        req.app.locals.specialContext = "No details"
        res.redirect('/admin',)
        console.log("admin not found");
      }

    } catch (error) {
        console.log(error);
    }
}

//admin side user page rendering

exports.loadUser = async(req,res)=>{
  try {

    // //for warning message
    var context = req.app.locals.specialContext;
    req.app.locals.specialContext = null;
     //search in the home
    

    var search =""
    if(req.query.search){
     search = req.query.search || ''
    }
    console.log(search);  



    var page = 1;
    if(req.query.page){
      page = req.query.page;
    }

    const limit = 3

     const userData = await User.find({
       username:{ $regex: '^' + search , $options: 'i'}
    }).limit(limit*1).skip((page-1)*limit)
    console.log(userData);

    const userCount = await User.find({
      username: { $regex: '^' + search,$options:'i'}
    }).countDocuments()
    if(userData){
      // console.log(userData);
        res.render('admin/userpage',{
          userData,
          totalPages : Math.ceil(userCount/limit),
          currentPage:page,
          search
        });
      }
      else{
        req.app.locals.specialContext = "user not found"
        res.render('admin/userpage', { userData, context });
      }
  } catch (error) {
    console.log(error);
  }
}


//block and unblock user in admin

exports.blockUser = async(req,res)=>{
  try {
    const id = req.query.id
    console.log(id);
    // find user by Id from the db
    const user = await User.findOne({_id:id})
    console.log(user);


    if(user.isBlocked==false){
      await User.updateOne({_id:id},{$set:{isBlocked:true}})
      res.redirect('/admin/user')
    }
    else{
      await User.updateOne({_id:id},{$set:{isBlocked:false}})
      res.redirect('/admin/user');
    }
  } catch (error) {
    console.log(error)
  }
}





//logout
exports.adminLogout = async(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
      res.send("Error")
    }
    else{
      res.redirect('/admin')
    }
  })
}
