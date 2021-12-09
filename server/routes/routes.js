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
router.delete('/user/:userId', userController.deleteUser)  //API to delete user

module.exports = router;
