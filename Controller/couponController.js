const Coupon = require('../model/couponModel')
const User = require('../model/userModel')
const session = require('express-session')
const Cart = require('../model/cartModel')


//coupon page rendering
exports.loadCouponPage = async (req,res) =>{
    try {
          //warning messages
    var context = req.app.locals.specialcontext;
    req.app.locals.specialcontext = null;

    const data = await Coupon.find({})
    console.log(data);
        res.render("admin/coupon",{data})
    } catch (error) {
        console.log(error);
    }
}

//add coupon -post
exports.addCoupon = async (req,res)=>{
    try {
        const {couponName,minimumPurchase,maximumDiscount,expiryDate} = req.body
        console.log(couponName,minimumPurchase,maximumDiscount,expiryDate);

        const newCoupon = new Coupon({
            couponName,
            minimumPurchase:minimumPurchase,
            maximumDiscount: maximumDiscount,
            expiryDate
        })
        await newCoupon.save();
        console.log("data entered");
        req.app.locals.specialcontext = "coupon added";
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log(error);
    }
}

//edit coupon
exports.editCouponLoad  = async(req,res)=>{
    try {
        const id = req.query._id;
        console.log(id);
        const data = await Coupon.findOne({_id:id})
        console.log(data);
        res.render('admin/editCoupon',{data})
    } catch (error) {
        console.log(error);
    }
}

//edit coupon -post
exports.editCoupon = async (req,res)=>{
    try {
        const id = req.body.id;
        console.log(id);
        const {couponname,minimumPurchase,maximumDiscount,expiryDate} = req.body;
        console.log(couponname,minimumPurchase,maximumDiscount,expiryDate);

        await Coupon.updateOne({_id:id},{
            $set:{
                couponName: couponname,
                minimumPurchase,
                maximumDiscount,
                expiryDate
            }
        })
        console.log("data changed");
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log(error);
    }
}

//deleteCoupon
exports.deleteCoupon = async (req,res)=>{
    try {
        const id = req.query._id
        console.log(id);
       const data =  await Coupon.findOne({_id:id})
      if(data.showStatus == true){
        await Coupon.updateOne({_id:id},{$set:{showStatus:false}})
      }else{
        await Coupon.updateOne({_id:id},{$set:{showStatus:true}})
      }

       
   

    } catch (error) {
        console.log(error);
    }
}

exports.getCoupon = async (req, res) => {
    try {
        const user = req.session.userId;

        // const getCart = await Cart.findOne({ user }).populate('product.product_id');
        // const cart = getCart.product;
        let totalAmount = 0;
        let currentDate = new Date();

        const cartData = await Cart.findOne({user}).populate('product.product_id')
        // console.log(cartData);
        const cart = cartData.product;
        const total = cartData?.product.reduce((acc,item)=>{
            const totalItem = item.price * item.count;
            return acc + totalItem
        },0)


        const coupon = req.body.coupon;
        const couponFound = await Coupon.findOne({couponName:coupon})
        if(couponFound){
            if(couponFound.expiryDate < currentDate){
                res.json({message:"coupon expired"})
            }
            else if(total<couponFound.minimumPurchase){
                res.json({message:"minimum purchase required"})

            }
            else{
                await Cart.updateOne({user},{$set:{isCouponApplied:couponFound.couponName}})
            }
        }      


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
