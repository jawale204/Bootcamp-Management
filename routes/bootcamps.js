
const express= require('express')
const { getBootCamp, createBootCamp, deleteBootCamp, updateBootCamp, getBootCamps, getBootCampsInRadius, uploadBootCampImage } = require('../controller/bootcamps')
const router = express.Router()
const courseRouter = require('./courses')
const advanceSearch = require('../middleware/advanceSearch')
const Bootcamp = require('../model/Bootcamps')
const {authUser, checkPermisson} = require('../middleware/User')

router.use("/:bootcampId/courses",courseRouter)
router.route("/").post(authUser,checkPermisson(['publisher','admin']),createBootCamp)
router.route("/:id").get(getBootCamp)
router.route("/:id").delete(authUser,checkPermisson(['publisher','admin']),deleteBootCamp)
router.route("/:id").put(authUser,checkPermisson(['publisher','admin']),updateBootCamp)
router.get('/radius/:radius/:zipcode',getBootCampsInRadius)
router.post('/:id/photo',authUser,checkPermisson(['publisher','admin']),uploadBootCampImage)
router.get("/",advanceSearch(Bootcamp,('courses')),getBootCamps)
module.exports = router