const mongoose = require('mongoose')
const slugify = require('slugify');
const geocoder = require('../util/Geocoder');

const BootcampSchema = new mongoose.Schema({
    name :{
        type:String,
        unique: true,
        maxlength: [50,`name cannot be more than 50 character`],
        trim: true,
        required:[true, `name is required`]
    },
    slug: String,
    description: {
        type:String,
        maxlength: [500,`description cannot be more than 500 character`],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with Http or Https'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email adress'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an adress']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
            // required:true
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            // required:true
        },
        formattedAdress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    carrers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.png'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
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

//for slug
BootcampSchema.pre('save',function(next){
    console.log("bootcamp added with name",this.name)
    this.slug = slugify(this.name, {lower: true})
    next()
})

//creating virtual
BootcampSchema.virtual('courses',{
    foreignField: 'bootcamp',
    justOne: false,
    localField : '_id',
    ref: 'Course'
})


//delete courses of a bootcamp
BootcampSchema.pre('remove',async function(next){
    await this.model('Course').deleteMany({bootcamp: this._id})
    next()
})

//geocoder 
BootcampSchema.pre('save',async function(next){
    console.log(process.env.NODE_GEOCODER_PROVIDER)
    const loc = await geocoder.geocode(this.address)
    console.log(loc)

    this.location ={
        type: 'Point',
        coordinates:[loc[0].longitude, loc[0].latitude],
        formattedAdress: loc[0].formattedAdress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcodeCode,
        country: loc[0].countryCode
    }
    next()
})

module.exports = mongoose.model('Bootcamp',BootcampSchema)