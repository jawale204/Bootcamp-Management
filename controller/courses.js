const Bootcamp = require('../model/Bootcamps')
const Course = require('../model/Course')
const ErrorResponse = require('../util/ErrorResponse')

//desc gets all courses
//access public
//route "/api/v1/courses"
//route "/api/v1/bootcamp/:bootcampId/courses"
exports.getCourses= async(req,res,next)=>{
    try{
        if(req.params.bootcampId){
            const courses = await Course.find({bootcamp: req.params.bootcampId}).populate('bootcamp',select="name")
            return res.status(200).json({success: true,count: courses.length, data: courses})
        }else{
            return res.status(200).json(res.advanceSearch)
        }
        
        
    }catch(err){
        next(err)
    }
}

//desc gets all courses
//access public
//route "/api/v1/course/:id"
exports.getCourse = async(req,res,next) =>{
    try {
        const course = await Course.findById(req.params.id).populate('bootcamp',select="title description")
        if(!course){
            return next(new ErrorResponse(`Course with id ${req.params.id} not found`,404))
        }
        return res.status(200).json({success: true, data: course})
    } catch (err) {
        next(err)
    }
}

//desc create a course
//access private
//route post "/api/v1/bootcamp/:bootcampId/courses"
exports.createCourse= async(req,res,next)=>{
    try {
        req.body.bootcamp =  req.params.bootcampId
        req.body.user=req.userid;
        const bootcamp = await Bootcamp.findById(req.params.bootcampId)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp with id ${req.params.bootcampId} not found`,404))
        }
    
        const course = await Course.create(req.body)
    
        res.status(200).json({success:true,body: course})
    } catch (err) {
        next(err)
    }  
}

//desc to update a course
//route api/v1/course
//access private
exports.updateCourse=async (req, res, next)=>{
    try{
        const cour=await Course.findById(req.params.id)

        if(cour.user.toString()!==req.userid.toString()){
            return next(new ErrorResponse('cannot update because not owner',403));
        }
        const course = await Course.findByIdAndUpdate(req.params.id, req.body,Option={
            new: true
        })
        if(!course){
            next(new ErrorResponse(`Course with id ${req.params.id} not found`,404))
        }

        return res.status(200).json({success:true, data : course})
    }catch(err){
        next(err)
    }
}

//desc to update a course
//route api/v1/course
//access private
exports.deleteCourse=async (req,res, next)=>{
    try{
        const course=await Course.findById(req.params.id)

        if(course.user.toString()!==req.userid.toString()){
            return next(new ErrorResponse('cannot update because not owner',403));
        }
        await Course.findByIdAndDelete(req.params.id)
        
        return res.status(200).json({success:true, data : {}})
    }catch(err){
        next(err)
    }
}