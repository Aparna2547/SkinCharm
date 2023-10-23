const express = require('express')
const mongoose = require('mongoose')
const userRoute = express();
const userController = require('../Controller/usercontroller')
const path = require('path')
const nocache = require('nocache')
const cartController = require('../Controller/cartController')
const addressController = require('../Controller/addressController')
const wishlistController = require('../Controller/wishlistController')
const orderController = require('../Controller/orderController')
const userAuth = require('../middlewares/userAuth')


// const session = require(express-session)

//set view
userRoute.set('views','./views/user')


//login
userRoute.get('/login',nocache(),userAuth.isLogout,userController.loadLogin)
userRoute.post('/login',userController.Login)


//register
userRoute.post('/register',userController.signUp)
userRoute.get('/register',userController.LoadRegister)


//otp
userRoute.get('/verifyOtp',userController.loadOtp)
userRoute.post('/verifyOtp',userController.verifyOtp)


//home page
userRoute.get("/",userController.LoadHome)


//shop page
userRoute.get("/shop",userController.LoadShopPage);

//single page
userRoute.get('/singleProductpage',userController.singleProduct)



//cart loading page
userRoute.get('/cart',userAuth.isLogin,cartController.loadCart)
//add to cart cart routing -POST
userRoute.get('/add_cart',cartController.addToCart)


//wishlist
userRoute.get('/wishlist',userAuth.isLogin,wishlistController.loadWishList)

//add to wishlist
userRoute.get('/add_wishlist',userAuth.isLogin,wishlistController.addtoWishlist)

//delete items from wishlist
userRoute.get('/wishlistDelete',userAuth.isLogin,wishlistController.wishlistDelete)

//addto wishlist in shop page
userRoute.get('/addToWishlist',userAuth.isLogin,wishlistController.addtoWishlistinShop)

//adding product to cart from wishlist
userRoute.get('/addToCart',userAuth.isLogin,cartController.addToCartWishlist)



// change  items count in cart
userRoute.post('/changeCount',cartController.changeCount)

//delete items from cart
userRoute.get('/cartDelete',cartController.cartDelete)



//shippingaddress in cart side
userRoute.get('/shippingAddress',userAuth.isLogin,addressController.shippingAddress)

//add address  in cart side
userRoute.get('/addAddressCart',userAuth.isLogin,addressController.addAddressCart)

//add address POST in cartside
userRoute.post('/addAddressCart',userAuth.isLogin,addressController.addAddressCartPost)

//edit address in get 

//delete address in cart side
userRoute.get('/deleteCartAddress',userAuth.isLogin,addressController.deleteCartAddress)



//add address in get in profilepage
userRoute.get('/addAddress',addressController.addAddressProfileLoad)

//add address - post in profile
userRoute.post('/addAddress',addressController.addAddressProfile)

//edit cart addres in cart side
userRoute.get('/editCartAddress',userAuth.isLogin,addressController.editCartAddressLoad)
userRoute.post('/editAddress',addressController.editAddress)

//delete address
userRoute.get('/deleteAddress',userAuth.isLogin,addressController.deleteAddress)

//checkout page
userRoute.get('/checkout',userAuth.isLogin,addressController.loadCheckOut)


//selecting address
userRoute.post('/addressSelected',userAuth.isLogin,addressController.addressSelector)

//place order
userRoute.get('/placeOrder',nocache(),orderController.loadPlaceOrder)

//post
userRoute.post('/checkOut',orderController.orderPlace)


//verifypayment for razor pay
userRoute.post('/verifyPayment',orderController.verifyPayment)
//get for delivery
userRoute.get('/orderSuccess',nocache(),userAuth.isLogin,orderController.Delivery)

//payment - Post
userRoute.post('/payment',nocache(),addressController.payment)

//payment - get onilne
// userRoute.get('/payment',orderController.paymentMethod)




//user profile page rendering
userRoute.get('/Profile',userAuth.isLogin,userController.loadUserProfile)

//user profile page - POST
userRoute.post('/Profile',userController.profile)

//user edit profile
userRoute.get('/editProfile',userAuth.isLogin,userController.LoadUserEditProfile)
userRoute.post('/editProfile',userController.editProfile)

//Orders and returns
userRoute.get('/orders&returns',userAuth.isLogin,orderController.ordersAndReturns)

//address page
userRoute.get('/addresspage',userAuth.isLogin,addressController.addressload)

//add address profile
userRoute.post('/addAddressprofile',userAuth.isLogin,addressController.addAddressProfile)


//editAddress profile
userRoute.get('/editAddressProfile',userAuth.isLogin,addressController.editAddressProfileLoad)

//editaddress -post
userRoute.post('/editAddressProfile',addressController.editAddressProfile)

//view Order details in user side
userRoute.get('/orderDetails',userAuth.isLogin,orderController.viewDetailsUser)

//cancel order
userRoute.get('/cancelOrder',userAuth.isLogin,orderController.cancelOrder)

//user logout
userRoute.get('/logout',nocache(),userController.userLogOut) 



//error 404 page
userRoute.use((error,req,res,next)=>{
    console.log(error.message);
    res.status(error.status || 404).render('user/404')
})

module.exports = userRoute
