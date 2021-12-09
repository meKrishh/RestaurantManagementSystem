const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const userController = require('../controllers/userController');
const { roles } = require('../roles');
router.get('/restaurants', userController.allowIfLoggedin , userController.getRestaurants)
router.get('/users', userController.allowIfLoggedin, userController.getUsers)
router.get('/getSubAdmins', userController.allowIfLoggedin, userController.getSubAdmins)
router.get('/getDishes', userController.allowIfLoggedin, userController.getDishes)
router.get('/logout', userController.allowIfLoggedin, userController.logout)
router.post('/createUser', userController.createUser)
router.post('/createRestaurants',  userController.allowIfLoggedin, userController.createRestaurants)
//router.post('/createDishes',userController.allowIfLoggedin, userController.createDishes)
router.post('/createSubAdmins',userController.allowIfLoggedin, userController.createSubAdmins)
router.post('/login',  userController.login)
router.post('/signup', userController.signup)


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