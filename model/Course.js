const mongoose = require('mongoose');
const Bootcamp = require('./Bootcamps')


const CourseScheme = new mongoose.Schema({
    title:{
        type: String,
        required: [true,'title is required'],
        max: 50,
        trim:true
    },
    description:{
        type:String,
        required: [true, 'descripyion is required'],
        max:500
    },
    weeks:{
        type : Number,
        required: [true,'weeks is required']
    },
    tuition:{
        type: Number,
        required:[true,'tution is required'],
    },
    minimumSkill:{
        type: String,
        required:[true, 'minimum Skills required'],
        enum:['beginner','intermediate','advance']
    },
    scholarshipAvailable:{
        type: Boolean,
        default:false
    },
    bootcamp:{
        type: mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// CourseScheme.virtual('Bootcamp',{
//   ref: 'Bootcamp',
//   localField: 'bootcamp',
//   foreignField: '_id',
//   justOne: true  
// })
CourseScheme.statics.getAverageTuition = async function(id){

    const doc= await this.aggregate([
        {
            $match :{ bootcamp : id}},
        {
            $group :{_id: "$bootcamp",averageCost : {$avg: '$tuition'}}
        }
    ])
    console.group(doc)
    await Bootcamp.findByIdAndUpdate(id,{averageCost : doc[0].averageCost})

}

CourseScheme.post('save', async function savef(){
    console.log("save called")
    await this.constructor.getAverageTuition(this.bootcamp)
})

module.exports= mongoose.model('Course',CourseScheme)

