const Banner = require('../model/bannerModel')

//banner loading page
exports.viewBanners = async (req,res)=>{
    try {
        const banner = await Banner.findOne({})
        res.render('admin/banner',{banner})
    } catch (error) {
        console.log(error);
    }
}

exports.addbanner = async (req,res)=>{
    try {
       const banners = req.files
      const data =  await Banner.updateOne({},{$push:{images:{$each:banners}}},{upsert:true})
      console.log(data);
      res.redirect('/admin/banner')

    } catch (error) {
        console.log(error);
    }
}

//delete banner
exports.deleteBanner = async (req,res)=>{
    try {
        console.log("hii");
        const banner = req.query.filename;
        console.log(banner);
    } catch (error) {
        console.log(error.message);
    }
}