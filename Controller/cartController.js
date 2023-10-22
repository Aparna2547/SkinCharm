const userRoute = require("../Router/userRouter");
const User = require('../model/userModel')
const Product = require('../model/productModel')
const session = require('express-session')
const Cart =  require('../model/cartModel');
const Wishlist = require('../model/wishlistModel')
const { singleProduct } = require("./usercontroller");
const e = require("express");


exports.loadCart = async (req,res,next)=>{
    try {
        //wraning mesage
        var context = req.app.locals.specialContext
        req.app.locals.specialContext = ""
        //we need an user to logged in to go cart
        const user = req.session.userId
        const cartData = await Cart.findOne({user}).populate('product.product_id')
        // console.log(cartData);
        const total = cartData?.product.reduce((acc,item)=>{
            const totalItem = item.price * item.count;
            return acc + totalItem
        },0)
     //   console.log("total in rendering vcart" + total);
        // console.log(cartData.product[0].product_id);
        res.render('cart',{cartData,total,context})
       console.log("rendering cartpage");
    } catch (error) {
        console.log(error);
        error(next);
    }
}

//add to cart
exports.addToCart = async (req,res)=>{
    try {
        //searching for the user
        const user = req.session.userId;
        if(!user){
            req.app.locals.specialContext = "Please Login"
          return res.redirect('/login')
        }
       // console.log("user "+user);

       //get the id by the query in a tag
        const productId = req.query.productId;
      //  console.log(productId);
        

      //finding the product by the product
        const product = await Product.findById(productId)
        //console.log("product of the yaearjosgio ................"+ product);


        //find the user already exist in the cart
        let userFound = await Cart.findOne({user})
        if(!userFound){
            //creating a new cart
            const newCart = new Cart({
                user,
                product:[{
                    product_id:productId,
                    count:1,
                    price:product.sellingPrice
                }]
            })
            await newCart.save();
        }else{
            //checking for already existing products in the cart
            await Cart.updateOne({user},{
                $push:{product:{product_id:productId,count:1,price:product.sellingPrice}}
            })
        }
        res.redirect(`/singleProductpage?id=${productId}`)
       
        

    } catch (error) {
        console.log(error);
    }
}



//change items count in the cart
exports.changeCount = async (req,res)=>{
    try {
        const itemId = req.query.itemId;
        const action = req.query.action;
        const user = req.session.userId;
        const product = await Cart.findOne({user},{product:{$elemMatch:{product_id:itemId}}}).populate('product.product_id')
        const allProduct = await Cart.findOne({user})
        console.log(allProduct);

        if(action==="plus"){
            let stock = product.product[0].product_id.stock;
            // console.log(stock);
            if(product.product[0].count++ >= 5){
                return res.json({status:'bag'})
            }else if(product.product[0].count++ > stock){
                return res.json({status:"stock"})
            }else{
                await Cart.updateOne({user,'product.product_id':itemId},{$inc : {'product.$.count':1}})
                const allProduct = await Cart.findOne({user})
                const total = allProduct.product.reduce((acc,item)=>{
                    const itemTotal = (item.price * item.count)
                    return acc + itemTotal
                },0)
                console.log("Total price"+total);
                let price = product.product[0].price
                // console.log(price);
                return res.json({status:'done',total,price})
            }
        }
        
        else if(action=== 'minus'){
            if(product.product[0].count>1){
                await Cart.updateOne({user,'product.product_id':itemId},{$inc : {'product.$.count':-1}})
                const allProduct = await Cart.findOne({user})
                const total = allProduct.product.reduce((acc,item)=>{
                    const itemTotal = (item.price * item.count)
                    return acc + itemTotal
                },0)
                let price = product.product[0].price
                return res.json({status: 'minus',total,price})
            }
        }
        console.log("hello"+itemId,action);
    } catch (error) {
        console.log(error);
    }
}



//deleting items in the cart
exports.cartDelete = async (req,res,next)=>{
    try {
        const id = req.query.productId;
        console.log(id)
        const product = await Product.findOne({_id:id})
       // console.log(product);
        const deleteItem = await Cart.findOneAndUpdate({user:req.session.userId},{
            $pull:{product:{product_id:id}}
        })
        console.log(deleteItem);
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
        error(next)
    }
}

//adding cart items from wishlist
exports.addToCartWishlist = async (req,res,next)=>{
    try {
        const user = req.session.userId;
        if(!user){
            req.app.locals.specialContext = "Please Login"
            return res.redirect('/login')
        }
            //get the id by the query in a tag
            const productId = req.query.productId;
              console.log(productId);
        
      //finding the product by the product
      const product = await Product.findById(productId)
      //console.log("product of the yaearjosgio ................"+ product);
      
        //find the user already exist in the cart
        let userFound = await Cart.findOne({user})
        if(!userFound){
            //creating a new cart
            const newCart = new Cart({
                user,
                product:[{
                    product_id:productId,
                    count:1,
                    price:product.sellingPrice
                }]
            })
            await newCart.save();
        }else{
            //checking for already existing products in the cart
            await Cart.updateOne({user},{
                $push:{product:{product_id:productId,count:1,price:product.sellingPrice}}
            })
        }
        res.redirect('/wishlist')
        
    } catch (error) {
        console.log(error.message);
        error(next)
    }
}