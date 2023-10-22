const User = require('../model/userModel')
exports.isLogin= async(req,res,next)=>{

    try{
        if(req.session.userId){
            const user = await User.findById({_id:req.session.userId})
            if(user.isBlocked == true){
                req.session.destroy();
                res.redirect('/login')
            }else{
                next()
            }
           
        }
        else{
            res.redirect('/login')
        }
    }catch(error){
        console.log(error.message);
    }
}

exports.isLogout= async(req,res,next)=>{

    try{

        if(req.session.userId){
            res.redirect('/login')
        }
       else{
        next();
       }

    }catch(error){
        console.log(error.message);
    }
}

