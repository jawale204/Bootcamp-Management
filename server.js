const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const app= express();
const errorHandler = require('./middleware/error')
const fileUpload= require('express-fileupload')
const path= require('path')
//route files
const bootcamps = require('./routes/bootcamps');
const courses= require('./routes/courses') 
const user= require('./routes/user')
const connectDB = require("./config/db");
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp= require('hpp')
const cors= require('cors')
const rateLimit= require('express-rate-limit')

//dotenv config
dotenv.config({path: './config/config.env' })

//db connection
connectDB()

//helmet 
app.use(helmet())



//logger
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//static folder
app.use(express.static(path.join(__dirname,"public")))
//body parse
app.use(express.json())

//xss
app.use(xss())

//fileupload middleware
app.use(fileUpload())

//http parameter pollution prevention
app.use(hpp())

//cors
app.use(cors())

//limiter
const limiter = rateLimit({
    windowMs: 10*60*1000,
    max:100
})

app.use(limiter)

//mount route
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/course',courses)
app.use('/api/v1/user',user)

//middleware for error handling
app.use(errorHandler)




//setting port
const PORT=process.env.PORT || 5000



// cmd "npm run dev" to start server in dev mode with nodemon
// cmd "node start" to start server in production mode 

const server = app.listen(PORT,console.log(`server started in environment ${process.env.NODE_ENV} on port ${PORT}`))

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error :${err.message}`)
    server.close(()=>process.exit(1))
})