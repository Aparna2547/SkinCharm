const mongoose = require('mongoose')
cartSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    product:[{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        count:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
        }
    }],
    isCouponApplied:{
        type : String
    }
})


module.exports = mongoose.model("Cart",cartSchema)