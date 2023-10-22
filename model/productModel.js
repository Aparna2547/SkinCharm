const mongoose = require('mongoose')
productSchema = new mongoose.Schema({
    image:{
        type:Array
    },
    productname:{
        type:String
    },
    category:{
        // type:String
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    brand:{
        type : String
    },
    actualPrice:{
        type:Number
    },
    sellingPrice:{
        type:Number
    },
    stock:{
        type:Number
    },
    description:{
        type:String
    },
    isListed:{
        type:Boolean,
        default:true
    },
    addedDate:{
        type: Date 
    }

})

module.exports = mongoose.model("Product",productSchema)