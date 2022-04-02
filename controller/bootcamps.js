const path = require('path')
const Bootcamp = require('../model/Bootcamps')
const ErrorResponse = require('../util/ErrorResponse')
const geocoder = require('../util/Geocoder')

//desc gets all bootcamps
//access public
exports.getBootCamps = async (req,res,next) =>{
    try {
        return res.status(200).json(res.advanceSearch)
    } catch (err) {
        next(err) 
    }
}

//desc get a bootcamp
//access public
exports.getBootCamp = async(req,res,next) =>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id).populate('courses',select='title description');
        if(!bootcamp){
           return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404)) 
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (err) {  
        next(err)
    }
    
}
//desc updates a bootcamp
//access private
exports.updateBootCamp = async(req,res,next) =>{
    try {
        const boot = await Bootcamp.findById(req.params.id)
        //console.log(boot.user.toString(),req.userid.toString())
        if(boot.user.toString()!==req.userid.toString()){
            return next(new ErrorResponse('cannot update because not owner',403));
        }
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body ,{
            runValidators:true,
            new: true
        })
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))
        }
        res.status(200).json({success: true, data: bootcamp})
    } catch (err) {
        next(err)
    }
    
}

//desc create a bootcamp
//access private
exports.createBootCamp = async (req,res,next) =>{
    try {
        req.body.user= req.userid;
        const bootcamp =  await Bootcamp.create(req.body)
        res.status(201).json({success: true, data:bootcamp})
    } catch (err) {
        next(err)
    }
}

//desc delete bootcam
//access private
exports.deleteBootCamp = async(req,res,next) =>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        
        if(bootcamp.user.toString()!==req.userid.toString()){
            return next(new ErrorResponse('cannot update because not owner',403));
        }
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))
        }
        await bootcamp.remove()
        res.status(200).json({success: true, data:{}})   
    } catch (err) {
        next(err)
    }
}

//desc get bootcam in radius
//access private
exports.getBootCampsInRadius = async(req,res,next) =>{
    try {
       let {zipcode , radius}= {...req.params}
       const loc = await geocoder.geocode(zipcode)
       const bootcamps= await Bootcamp.find( {
        location: {
             $geoWithin: { 
                 $centerSphere: [ [loc[0].longitude , loc[0].latitude ],radius/3963 ]
                 } 
            }
        } )
        res.status(200).json({success:true,count:bootcamps.length,data:bootcamps})
    } catch (err) {
        next(err)
    }
}

exports.uploadBootCampImage=async(req,res,next)=>{
    
    const bootcamp = await Bootcamp.findById(req.params.id)

    if(bootcamp.user.toString()!==req.userid.toString()){
        return next(new ErrorResponse('cannot update because not owner',403));
    }

    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`,404))
    }
    if(!req.files){
        return res.status(400).json({success:false,msg:"please upload a imagae file"})
    }
    
   let imgfile=req.files['']
   if(!imgfile.mimetype.startsWith("image")){
    return res.status(400).json({success:false,msg:"please upload a image with jpg/jpeg format file"})
   }
   if(!imgfile.size>process.env.MAX_UPLOAD_SIZE){
    return res.status(400).json({success:false,msg:"image size limmit is 1 mb"})
   }

    imgfile.name= `photo_${bootcamp._id}${path.parse(imgfile.name).ext}`;

   imgfile.mv(`${process.env.FILE_UPLOAD_PATH}/${imgfile.name}`,async (err)=>{
       if(err){
        return next(new ErrorResponse(`error while storing file`,500))
       }
       await Bootcamp.findByIdAndUpdate(req.params.id,{photo : imgfile.name})
       return res.status(200).json({success:true,data: imgfile.name})
   })
   


}