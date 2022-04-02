const ErrorResponse = require("../util/ErrorResponse")

const errorHandler = (erro, req, res, next)=>{
    // for developer
    let error= erro
    if(erro.name==="CastError"){
        const message = `resourse not found with id of ${error.value}`
        error= new ErrorResponse(message , 404)
    }

    if(erro.code===11000){
        const message =` duplicated value passed error`
        error= new ErrorResponse(message , 404)
    }

    if(erro.name==="ValidationError"){
        const message = Object.values(erro.errors).map(val=> val.message)
        error= new ErrorResponse(message , 404)
    }
    //console.log(erro.stack)

    res.status(error.statusCode || 500).json({success: false , error: error.message})
}

module.exports= errorHandler