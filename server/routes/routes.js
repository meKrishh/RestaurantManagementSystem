const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController');
const { roles } = require('../roles');
router.get('/restaurants', userController.allowIfLoggedin , userController.getRestaurants) //API to fetch a list of all restaurants
router.get('/users', userController.allowIfLoggedin, userController.getUsers)  //API for admin/sub-admin to list all users
router.get('/getSubAdmins', userController.allowIfLoggedin, userController.getSubAdmins)  //API for admin to list all sub-admins
router.get('/getDishes', userController.allowIfLoggedin, userController.getDishes)  //API to fetch dishes for a given restaurant
router.post('/createUser', userController.createUser)  //API for admin/sub-admin to create user
router.post('/createRestaurants',  userController.allowIfLoggedin, userController.createRestaurants)  //API for admin/sub-admin to create Restaurants
router.post('/createSubAdmins',userController.allowIfLoggedin, userController.createSubAdmins)  //API for admin/sub-admin to create sub admins
router.post('/login',  userController.login)  //API for login
router.post('/signup', userController.signup)  // API for signup
router.get('/logout', userController.allowIfLoggedin, userController.logout)  //API for logout



//router.put("/logout",userController.allowIfLoggedin,userController.logout);


// router.get('/supervisor',userController.getSupervisors)

// router.post('/admin/restaurants',userController.CreateAdminRestaurants)

// router.post('/supervisor/restaurants',userController.CreateSupervisorRestaurants)

// router.post('/createSupervisor',userController.createSupervisor)


router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

//router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);  
//router.get('/users',  userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

//router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);   
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
