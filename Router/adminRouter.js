const express = require('express')
const mongoose = require('mongoose')
const adminRoute = express()
const adminController = require('../Controller/adminController')
const categoryController = require('../Controller/categoryController')
const orderController = require('../Controller/orderController')
const path = require('path')
const multerMid = require('../middlewares/multerMiddleware')
const nocache = require('nocache')
const adminauth = require('../middlewares/adminAuth')
const productModel = require('../model/productModel')
const productController = require('../Controller/productController')
const couponController = require('../Controller/couponController')
const couponModel = require('../model/couponModel')
const bannerController = require('../Controller/bannerController')



//set view
// adminRoute.set('views','./views/admin')




//login
adminRoute.get('/',nocache(),adminauth.isadminLogout,adminController.loadLogin)

adminRoute.get('/home',adminauth.isadminLogin,adminController.LoadHome)
adminRoute.post('/home',adminController.Login)

//salesReport-GET
// adminRoute.get('/salesReport',adminauth.isadminLogin,adminController.salesReportLoad)

//salesReport post 
adminRoute.post('/salesReport',adminauth.isadminLogin,adminController.salesReport)



//user page
adminRoute.get('/user',adminController.loadUser)


//blockUser
adminRoute.get('/blockUser',adminController.blockUser)

//all categroy
adminRoute.get('/category',categoryController.category)

//add category
adminRoute.post('/newCategory',multerMid.upload.single('image'),categoryController.addNewCategory)

//newPCategory
adminRoute.get('/newCategory',categoryController.loadnewCategory)

//add brand
adminRoute.get('/addBrand',categoryController.loadBrand)
adminRoute.post('/addBrand',categoryController.addBrand)

//edit category
adminRoute.get('/editCategory',categoryController.loadedit)
adminRoute.post('/editCategory',multerMid.upload.single('image'),categoryController.editCategory)

//delete image catgory
adminRoute.get('/deleteCatImg',categoryController.deleteCatImg)
//list category
adminRoute.get('/listcategory',categoryController.listCategory)


//all products table
adminRoute.get('/product',productController.allProduct)
adminRoute.post('/addProduct',multerMid.upload.array('image',3),productController.addProduct)

//add new product
adminRoute.get('/addProduct',productController.loadAddProduct)


//edit Product
adminRoute.get('/editProduct',adminauth.isadminLogin,productController.loadProduct)
adminRoute.post('/editProduct',multerMid.upload.array('image',4),productController.editProduct)

//delete image in edit product
adminRoute.get('/deleteImg',productController.deleteProductImg)

//soft delete product
adminRoute.get('/listproduct',productController.listProduct)

//order
adminRoute.get('/orders',adminauth.isadminLogin,orderController.orderLoad)

//shipping status
adminRoute.get('/changeOrderStatus',adminauth.isadminLogin,orderController.changeOrder)

//view details
adminRoute.get('/viewDetails',adminauth.isadminLogin,orderController.viewDetails)


//COUPONS
//for coupons
adminRoute.get('/coupons',adminauth.isadminLogin,couponController.loadCouponPage)

//adding coupon
adminRoute.post('/addCoupon',adminauth.isadminLogin,couponController.addCoupon)

//editCoupon
adminRoute.get('/editCoupon',adminauth.isadminLogin,couponController.editCouponLoad)
//editCoupon - POST
adminRoute.post('/editCoupon',adminauth.isadminLogin,couponController.editCoupon)

//delete coupon
adminRoute.get('/deleteCoupon',adminauth.isadminLogin,couponController.deleteCoupon)


//BANNeR
adminRoute.get('/banner',adminauth.isadminLogin,bannerController.viewBanners)

//add banner
adminRoute.post('/addBanner',adminauth.isadminLogin,multerMid.upload.array('banner'),bannerController.addbanner)

//deleteBaner
adminRoute.get('/deleteBanner',adminauth.isadminLogin,bannerController.deleteBanner)
//logout
adminRoute.get('/adminLogout',adminController.adminLogout)
// adminRoute.post('/adminLogout',nocache(),adminController.adminLogout)


module.exports = adminRoute