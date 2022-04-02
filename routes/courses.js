const express= require('express')
const {getCourses, getCourse, createCourse, deleteCourse, updateCourse} = require('../controller/courses');
const route = express.Router({mergeParams:true})
const advanceSearch = require('../middleware/advanceSearch');
const Course = require('../model/Course');
const {authUser, checkPermisson } = require('../middleware/User')

route.get('/',advanceSearch(Course,('bootcamp')),getCourses)
route.get('/:id',getCourse)
route.post('/',authUser,checkPermisson(['publisher','admin']),createCourse)
route.delete('/:id',authUser,checkPermisson(['publisher','admin']),deleteCourse)
route.put('/:id',authUser,checkPermisson(['publisher','admin']),updateCourse)

module.exports=route