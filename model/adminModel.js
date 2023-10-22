const mongoose = require('mongoose')
adminSchema = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }

})

module.exports = mongoose.model("Admin",adminSchema)