const NodeGeocoder = require('node-geocoder')

const options ={
    provider:"mapquest" ,
    //process.env.NODE_GEOCODER_PROVIDER,
    apiKey:"zYUuGa5zIwhZqgvv05okG9dvS7JcF4A4" ,
    //process.env.NODE_GEOCODER_API_KEY,
    formatter: null,
    httpAdapter: "https"
}

const geocoder = NodeGeocoder(options)

module.exports= geocoder