const {body} = require('express-validator')
exports.userRegisterationValidator = [
  body("name").not().isEmpty().bail().withMessage("name should not be empty").isLength({min:4,max:10}).withMessage("length should be between 5-10"),
  body("email").isEmail(),
  body('password').not().isEmpty().bail().withMessage("password shoould not be empty").isLength({min :4,max:10}).withMessage("password with length")
]

exports.userLoginValidator=[
  
  body('password').not().isEmpty().bail().withMessage("password shoould not be empty").isLength({min :4,max:10}).withMessage("password with length")

]