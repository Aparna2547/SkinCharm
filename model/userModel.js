const mongoose = require('mongoose')
userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    email:{
    type: String
    },
    password:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default : false,
        required:true
    },
    joinedDate:{
        type:Date,
    },
    is_admin:{
        type:Number
    },
    wallet :{
        type : Number,
        default :0
    },
    walletApplied :{
        type:Boolean,
        default :false
    },
    walletHistory:[{
        transactionType: String,
        method: String,
        amount: Number,
        date: Date,
    }]  
    
})

module.exports =mongoose.model("User",userSchema)