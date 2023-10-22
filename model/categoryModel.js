const mongoose = require('mongoose')
categorySchema = new mongoose.Schema({
    category:{
        type:String
    },
    brands:{
        type:Array
        },
    image:{
        type:String
    },
    isListed:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('Category',categorySchema)