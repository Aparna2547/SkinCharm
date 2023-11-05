    const mongoose = require('mongoose')
    orderSchema = new mongoose.Schema({
        user :{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        orders:[{
            product_id: {
                type : mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            count : {
                type:Number
            },
            price:{
                type:Number
            },
            address:{
                type:Object
            },
            payment:{
                type:String
            },
            orderDate:{
                type : Date
            },
            orderStatus:{
                type:Number,
                default : 1
            }
        }]
    })

    module.exports = mongoose.model("Order",orderSchema)