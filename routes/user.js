const express = require('express')
const router= express.Router()
const {registerUser, loginUser ,forgetPassword, resetPassword, updatePassword} = require('../controller/User')
const { emailAddressOrNameExists, authUser} = require('../middleware/User')
const { userRegisterationValidator, userLoginValidator } = require('../Validator/User')


router.post('/',userRegisterationValidator,emailAddressOrNameExists,registerUser)
router.post('/login',userLoginValidator,loginUser)
router.post('/forgotpassword',forgetPassword)
router.post('/resetpassword/',resetPassword)
router.post('/updatePassword',authUser,updatePassword)
module.exports = router