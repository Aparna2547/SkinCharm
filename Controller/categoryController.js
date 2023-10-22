const Admin = require('../model/adminModel')
const Category = require('../model/categoryModel')
const Product = require('../model/productModel')
const session = require('express-session')
const bcrypt = require('bcrypt')


// to get all categories \\page rendering
exports.category = async(req,res)=>{
    try {
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
  
       const Data = await Category.find({
         category:{ $regex: '^' + search , $options: 'i'}
      }).limit(limit*1).skip((page-1)*limit)
      console.log(Data);
  
      const categoryCount = await Category.find({
        category: { $regex: '^' + search,$options:'i'}
      }).countDocuments()
      if(Data){
        // console.log(userData);
          res.render('admin/category',{
            Data,
            totalPages : Math.ceil(categoryCount/limit),
            currentPage:page,
            search
          });
        }
        else{
          req.app.locals.specialContext = "user not found"
          res.render('admin/category', { Data, context });
        }
  



      // const Data = await Category.find({})
      // res.render('admin/category',{Data})
      // console.log(Data);
    } catch (error) {
      console.log(error);
    }
  }
  

//adding new Category-GET
exports.loadnewCategory = async (req,res)=>{
    try {
      res.render('admin/newCategory')
    } catch (error) {
      console.log(error);
    }
  }
  

  
//add new category-POST
exports.addNewCategory = async (req,res)=>{
    try {
      const category = req.body.category;
   //   console.log(category)
      const image = req.file.filename
      console.log(image);
      //save data
      const newCategory = new Category({
        category,
        image
      })
      console.log("Data entered");
      await newCategory.save();
      res.redirect('/admin/category')
      
    } catch (error) {
      console.log(error)
    }
  }

  
//edit category -GET
exports.loadedit = async (req,res)=>{
    try {
      const id = req.query._id;
      console.log(id);
      const editData = await Category.findOne({_id:id})
      if(editData){
        res.render('admin/editCategory',{cat:editData})
      }
    } catch (error) {
      console.log(error);
    }
  }

  //edit category -POST
exports.editCategory = async(req,res)=>{
    try {
      const id =req.body.id;
      const {category} =req.body;
      // console.log(id,category,image);
      const Data = await Category.findOne({_id:id})
      const image = req.file?.filename || Data.image
      if(Data){
        await Category.findByIdAndUpdate({_id:id},{$set:{category,image}})
        // console.log(Data);
        res.redirect('/admin/category')
      }else{
        console.log("not edit data..");
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  //delete image
  exports.deleteCatImg = async (req,res)=>{
    try {
      const id = req.query.id;
      console.log("id"+id);
      // const image = req.file.filename;
      // console.log("image" + image);
      await Category.findByIdAndUpdate({_id:id},{$unset:{image:null}})
      res.redirect(`/admin/editCategory?_id=${id}`)
      console.log("completed");
    } catch (error) {
      console.log(error);
    }
  }


  //load Brand
exports.loadBrand =async (req,res)=>{
    try {
      res.render('admin/addBrand')
    } catch (error) {
      console.log(error);
    }
  }
  
  //add Brand
exports.addBrand= async  (req ,res )=>{
    try {
      const brand = req.body.brandname;
      console.log("brandname "+  brand);
      const addbrand = await Category.updateMany({},{$push:{brands:brand}})
      // console.log(addbrand);
      res.redirect('/admin/category')
    } catch (error) {
      console.log(error);
    }
  }

  //list category
exports.listCategory = async (req,res)=>{
    try {
      const id = req.query.id;
      console.log(id)
      const catData = await Category.findOne({_id:id})
      if(catData.isListed == true){
        await Category.updateOne({_id:id},{$set:{isListed:false}})
      }else{
        await Category.updateOne({_id:id},{$set:{isListed:true}})
      }
      // console.log(catData);
      console.log("list changed");
      res.redirect('/admin/category')
    } catch (error) {
      console.log(error);
    }
  }