const User = require('../model/addressModel')
const Cart = require('../model/cartModel')
const Address = require('../model/addressModel')

const session = require('express-session')





//shipping address - get in cart side
exports.shippingAddress = async (req,res,next)=>{
    try {

        const user = req.session.userId;
        //console.log(user);
        const cartData = await Cart.findOne({user}).populate('product.product_id')
        const addressData = await Address.findOne({user})
        // console.log(addressData);
        // console.log(cartData);
        const total  = cartData?.product.reduce((acc,item)=>{
            const totalItem = item.price * item.count;
            return acc + totalItem
        },0)
        res.render('shippingAddress',{addressData,total})
            
    } catch (error) {
        console.log(error);
        next(error)
    }
}

//add address in cart side
exports.addAddressCart = async (req,res,next)=>{
    try {
        res.render('addAddress')
    } catch (error) {
        console.log(error);
        next(error)
    }
}

//adding address in cart side
exports.addAddressCartPost = async (req,res)=>{
    try {
        const user = req.session.userId
       // console.log(user);
        const userFound = await Address.findOne({user})
       //console.log(userFound)
       const {name,phone,address,locality,pincode,city,state} = req.body;
        if(!userFound){
            console.log("user not found");
             const newAddress = await new Address({
               user,
                address:[{
                    name,
                    phone,
                  address,
                    locality,
                    pincode,
                    city,
                    state
                }]
            })
            await newAddress.save()
            console.log("data saved");
        }
        else{
            console.log("userfound");
            await Address.updateOne({user},{
                $push:{address:{name,phone,address,locality,pincode,city,state}}
            })
            console.log("data pushed");
        }
        res.redirect('/shippingAddress')
      
    } catch (error) {
        console.log(error);
    }
}



//edit Address cart side
exports.editCartAddressLoad = async (req,res,next)=>{
    try {
        const user = req.session.userId;
        const id = req.query._id;
        console.log(id);
        const address = await Address.findOne({ user }, { address: { $elemMatch: { _id: id } } });
        console.log(address);
        res.render('editAddress',{address:address.address[0]})
    } catch (error) {
        console.log(error)
        next(error)
    }
}



//edit adress post - cart side
exports.editAddress = async (req,res)=>
{
    try {
        const id = req.body.id;
        const user = req.session.userId
        const {name,phone,address,locality,pincode,city,state} = req.body;
        // console.log(name,phone,address,locality,pincode,city,state);
        await Address.findOneAndUpdate({user,'address._id':id},{$set:{
            'address.$.name': name,
            'address.$.phone': phone,
            'address.$.address': address,
            'address.$.locality': locality,
            'address.$.pincode': pincode,
            'address.$.city': city,
            'address.$.state': state,
        }})
        res.redirect('/shippingAddress')
        console.log("edited");
        
    } catch (error) {
        console.log(error);
    }
}

//delete address -profile side side
exports.deleteCartAddress = async(req,res,next)=>{
    try {
        const user = req.session.userId
        const id = req.query._id;
        console.log(id);
        await Address.findOneAndUpdate({user,'address._id':id},{$pull:{address:{_id:id}}})
        res.redirect('/shippingAddress')
        console.log("pulled");
    } catch (error) {
        console.log(error);
        next(error)
    }
}


//selecting address
exports.addressSelector = async (req,res)=>{
    try {
        const user = req.session.userId;
        // console.log(user)
        const address = req.body.address;
        req.session.addressId= address
        console.log(req.session.addressId);
       return  res.redirect('/checkout')
   
    } catch (error) {
        console.log(error);
    }
}


//loading check out
exports.loadCheckOut = async (req,res,next)=>{
    try {
        const user = req.session.userId
        const cartData = await Cart.findOne({user}).populate('product.product_id')
        const addressData = await Address.findOne({user})
        const total  = cartData?.product.reduce((acc,item)=>{
            const totalItem = item.price * item.count;
            return acc + totalItem
        },0)
    
      res.render('checkout',{addressData,total})
    } catch (error) {
        console.log(error);
        next(error)
    }

}

//payment
exports.payment = async (req,res)=>{
    try {
        const user = req.session.userId
        const payment =req.body.payment
        console.log(payment + "-payment");
        req.session.paymentId = payment
        
    } catch (error) {
        console.log(error);
    }
}



//showing address page
exports.addressload = async (req,res,next)=>{
    try {
      const user = req.session.userId
      const address = req.session.addresId
      const addressData = await Address.findOne({user})
    //   console.log(addressData);
      res.render('addresspage',{addressData})
    } catch (error) {
      console.log(error);
      next(error)
    }  
  }


  

//editAddress profile
exports.editAddressProfileLoad = async (req,res,next)=>{
    try {
      const user = req.session.userId;
      const id = req.query._id;
      console.log(id);
      const address = await Address.findOne({ user }, { address: { $elemMatch: { _id: id } } });
    //   console.log(address);
      res.render('editAddressProfile',{address:address.address[0]})
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  

  
//edit address post
exports.editAddressProfile = async (req,res)=>{
    try {
      const id = req.body.id;
          const user = req.session.userId
          const {name,phone,address,locality,pincode,city,state} = req.body;
          // console.log(name,phone,address,locality,pincode,city,state);
          await Address.findOneAndUpdate({user,'address._id':id},{$set:{
              'address.$.name': name,
              'address.$.phone': phone,
              'address.$.address': address,
              'address.$.locality': locality,
              'address.$.pincode': pincode,
              'address.$.city': city,
              'address.$.state': state,
          }})
          res.redirect('/addresspage')
          
    } catch (error) {
      console.log(error);
      
    }
  }
  
  





  //Address in profile
  exports.addAddressProfileLoad = async (req,res,next)=>{
    try {
        res.render('addAddress')
    } catch (error) {
        console.log(error);
        next(error)
    }
}



//adding address
exports.addAddressProfile = async (req,res)=>{
    try {
        const user = req.session.userId
       // console.log(user);
        const userFound = await Address.findOne({user})
       //console.log(userFound)
       const {name,phone,address,locality,pincode,city,state} = req.body;
        if(!userFound){
            console.log("user not found");
             const newAddress = await new Address({
               user,
                address:[{
                    name,
                    phone,
                  address,
                    locality,
                    pincode,
                    city,
                    state
                }]
            })
            await newAddress.save()
            console.log("data saved");
        }
        else{
            console.log("userfound");
            await Address.updateOne({user},{
                $push:{address:{name,phone,address,locality,pincode,city,state}}
            })
            console.log("data pushed");
        }
        res.redirect('/addresspage')
      
    } catch (error) {
        console.log(error);
    }
}


//delete address -profile side side
exports.deleteAddress = async(req,res,next)=>{
    try {
        const user = req.session.userId
        const id = req.query._id;
        console.log(id);
        await Address.findOneAndUpdate({user,'address._id':id},{$pull:{address:{_id:id}}})
        res.redirect('/addresspage')
        console.log("pulled");
    } catch (error) {
        console.log(error);
        next(error)
    }
}
