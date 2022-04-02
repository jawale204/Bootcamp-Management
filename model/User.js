const mongoose= require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        require:[true,"name is required"],
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email adress'
        ],
        unique: true,
        required :[
            true,"please provide"
        ]
    },
    password:{
        type: String,
        minlength:[6,'minimum password length is 6'],
        require:[true,"password is required"],
        select: false
    },
    passwordResetCode :String,
    passwordResetExpire: Date,
    createdAt:{
        type: Date,
        default : Date.now  
    },
    role:{
        type:String,
        enum :['user','admin','publisher'],
        default: 'user',
    }
})

module.exports = mongoose.model('User',UserSchema)