const router = require("express").Router();
// const user = require("../models/user");
const User = require('../models/user');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require("../models/user");
const checkAuth = require('../models/middleware/check-auth')

router.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password, 10,(err,hash)=>{
      if(err){
       return res.json({success: false, message:"sorry cant process because "+err})
        // console.log(+err)
      }else{
        const user = new User({
            displayName :req.body.displayName,
            email : req.body.email,
            password : hash,
           })
           user.save()
           .then((_)=>{
            res.json({success:true , message:"Account has been created"})
            
           })
           .catch((err)=>{
        
            res.json({success:false, message:"Email Id already exist\n"+err})
           })
        
      }
    })

  
}),

router.post("/login",(req,res)=>{
    User.find({email:req.body.email}).exec().then((result)=>{
        if(result.length<1){
            return res.json({success:false,message:"User not found"})
        }
        const user=result[0];
        bcrypt.compare(req.body.password,user.password, (err,ret)=>{
            if(ret){
                const payload = {
                    // userId : this._id,
                    userId : user._id,
                }
               const token = jwt.sign(payload,"webBatch");
                return res.json({success:true,token:token,message:"Login Successful"})
            }else{
                return res.json({success:false,message:"Login failed please check your credentials"})
            }
        })

    }).catch(err=>{
        res.json({success : false,message : "auth failed"+err})
    })

}),
router.get('/profile',checkAuth,(req,res)=>{
    const userId = req.userData.userId;
    User.findById(userId).exec().then((result)=>{
        res.json({success:true,data:result})

    }).catch(err=>{
        res.json({success:false,message:"server error"+err})
    })

})

module.exports = router;
