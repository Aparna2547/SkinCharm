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
    }
})

module.exports =mongoose.model("User",userSchema)