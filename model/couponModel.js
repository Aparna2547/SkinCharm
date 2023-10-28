const mongoose = require('mongoose')
couponSchema = new mongoose.Schema({
    couponName : {
        type : String,
        required : true
    },
    mininumPurchase : {
        type : Number,
        required : true
    },
    MaximumDiscount : {
        type :Number
    },
    expiryDate : {
        type : Date
    },
    showStatus : {
        type : Boolean
    },
    usedUser :{
        type : mongoose.Schema.Types.ObjectId,
        ref :'User'
    }
})


module.exports = mongoose.model("Coupon",couponSchema)