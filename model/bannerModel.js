const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    images:{
        type:Array,
        maxItems:4
    }
})

module.exports = mongoose.model('Banner',bannerSchema);