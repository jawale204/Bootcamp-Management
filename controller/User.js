const { validationResult } = require("express-validator")
const bcrypt = require('bcrypt')
const User = require('../model/User')
const JwtService = require('../service/JwtService')
const ErrorResponse = require("../util/ErrorResponse")
const crypto = require('crypto')
const { sendMail } = require("../service/Email")

exports.registerUser = async(req,res,next)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json(errors)
   }
   try{
    const salt = await   bcrypt.genSalt(10)

    req.body.password = await bcrypt.hash(req.body.password,salt)

    const {name, email,password} = {...req.body}

    const obj = {
      name,
      email,
      password
    }
 
    const user = await User.create(obj);
    let jwtservice = new JwtService();
    const token = jwtservice.createJwtToken(user._id,email,user.role);


    return res.status(201).json({succes:true,data : "user created",token:token})
    
   }catch(e){
     next(e)
   }

}

exports.loginUser = async(req,res,next)=>{
  const error = validationResult(req);
  console.log(req.userid,req.email);
  if(!error.isEmpty){
    return res.status(400).json(errors) 
  }
  try{
        const user =await User.find({$or:[
          { name : req.body.name},
          { email: req.body.email}
        ]}).select('password email role');
 
        if(user.length==0){
          return next(new ErrorResponse(`User not found`,400))
        }
       
        const matched = await bcrypt.compare(req.body.password,user[0].password);
        if(!matched){
          return next(new ErrorResponse("incorrect password",400));
        }

        const jwtservice = new JwtService();
        
        const token = jwtservice.createJwtToken(user[0]._id,user[0].email,user[0].role);

        return res.status(200).json({succes:true , token: token});

  }catch(e){
    next(e)
  }
}

exports.forgetPassword = async (req,res,next)=>{
    const user =await  User.findOne({email : req.body.email})
    if(!user){
      return next(new ErrorResponse('user not found',400))
    }
    try{
          const resetToken = crypto.randomBytes(20).toString('hex');
          const hash = crypto.createHash('sha256').update(resetToken).digest('hex'); 
          
          user.passwordResetCode= hash;
          user.passwordResetExpire = Date.now()+ 10*60*1000;
          
          await user.save();

          const url =`${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`
          const text =`please copy this reset code to change password ${resetToken}`;
          const options ={
              to:user.email,
              subject:"reset password",
              text
           }
          try{
                  const respo =await sendMail(options);
                  console.log(respo);
                  res.status(200).json({success:true,data:"emailsend"})
                }catch(e){
                  user.passwordResetCode=undefined
                  user.passwordResetExpire=undefined
                  user.save()
                  res.status(404).json({success:true,data:"email not send"})
                }
          }catch(e){
            next(e)
           }
  
}

exports.resetPassword= async(req,res,next)=>{
  try {
    const hash = crypto.createHash('sha256').update(req.body.id).digest('hex');
    const user = await User.findOne({passwordResetCode:hash})
    if(!user) return res.status(400).json({succes:false ,data:"invalid token"})
    if(user.passwordResetExpire < Date.now()){
      res.status(400).json({succes:false , data: "link expired"})
    }
    const salt =await  bcrypt.genSalt(10);

    user.password = await bcrypt.hash(req.body.password,salt);

    user.passwordResetCode=undefined
    user.passwordResetExpire=undefined

    user.save();
    return res.json(user);
  } catch (e) {
    next(e);
  }
}

exports.updateEmail = async(req,res,next) =>{
  try{
      const user = await User.findByIdAndUpdate(req.userid,{email:req.body.email});
      if(!user){
          return res.status(400).json({succes:false, data: "user not found"})
      }
      return res.status(400).json({succes:false, data: "email updated"})
  }catch(e){
    next(e)
  }
}

exports.updateUsername = async(req,res,next) =>{
  try{
      const user = await User.findByIdAndUpdate(req.userid,{email:req.body.username});
      if(!user){
          return res.status(400).json({succes:false, data: "user not found"})
      }
      return res.status(400).json({succes:false, data: "email updated"})
  }catch(e){
    next(e)
  }
}

exports.updatePassword = async(req,res,next) =>{
  try{
       const user =await User.findById(req.userid).select('password email role');
 
        if(!user){
          return next(new ErrorResponse(`User not found`,400))
        }
        const matched = await bcrypt.compare(req.body.password,user.password);
        if(!matched){
          return next(new ErrorResponse("incorrect password",400));
        }

        const salt =await  bcrypt.genSalt(10);

        user.password = await bcrypt.hash(req.body.newPassword,salt);

        await user.save()
        return res.status(400).json({success:true, data: "password updated"})
  }catch(e){
    next(e)
  }
}