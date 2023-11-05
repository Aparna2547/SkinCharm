const mongoose = require('mongoose')
couponSchema = new mongoose.Schema({
    couponName : {
        type : String,
        required : true
    },
    minimumPurchase : {
        type : Number,
        required : true
    },
    maximumDiscount : {
        type :Number
    },
    expiryDate : {
        type : Date
    },
    showStatus : {
        type : Boolean,
        default:true
    },
    usedUser :{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User'
    }
})


module.exports = mongoose.model("Coupon",couponSchema)