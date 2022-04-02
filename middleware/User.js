const User = require('../model/User');
const JwtService = require('../service/JwtService');
const ErrorResponse = require('../util/ErrorResponse');

exports.emailAddressOrNameExists = async(req,res,next)=>{
    const user = await User.find({
        $or:[
            {name : req.body.name},
            {email: req.body.email}
        ]
    })
    if(user.length!=0){
        return res.status(400).json({success:false ,message: "Username/Email already exist"});
    }
    next()
} 

exports.authUser= async(req,res,next)=>{
    const header = req.header('Authorization');
    if(!header){
        return next(new ErrorResponse('token not passed',400));
    }
    const token = header.split(' ')[1]
    const jwtservice = new JwtService();
    const result = jwtservice.checkJwtToken(token);
    if(!result.userid){
        return next(new ErrorResponse(result,400))
    }else{
        const user = await User.findById(result.userid)
        req.userid=user._id
        req.email=user.email 
        req.role=user.role
        next()
    }
}

exports.checkPermisson =(role) => (req,res,next)=>{
    console.log(role);
    console.log(req.role);
    console.log(!role.includes(req.role));
    if(!role.includes(req.role)){
        return next(new ErrorResponse("user not authorized",403));
    }else{
        next();
    } 
}