const { roles } = require('../roles')
const User = require('../models/userModel')
const Restaurants = require('../models/Restaurants')
const createdByCollection = require('../models/createdByCollection') 
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const express = require('express')
const app =express()
app.use(bodyParser.urlencoded({ extended: true }))
const cookieParser = require('cookie-parser')
app.use(cookieParser());

async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}

const validateEmail = async email => {
  let user = await User.findOne({ email });
  return user ? false : true;
};


exports.signup = async (req, res, next) => {
 try {
  const { email, password,createdBy, role } = req.body
  const { Item,name } = req.body

// validate the email
let emailNotRegistered = await validateEmail(email);
if ( !emailNotRegistered ) {
  return res.status(400).json({
    message: `Email is already registered.`,
    success: false
  });
}

else{
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ email, password: hashedPassword,
        createdBy: createdBy || "basic", role: role || "basic" });
  const myUser = new Restaurants({ Item, createdBy: createdBy || "basic", name , role: role || "basic" });
  const accessToken = jwt.sign( { userId: newUser._id }, process.env.JWT_SECRET, {  expiresIn: "15d" } );
  newUser.accessToken = accessToken;
  myUser.accessToken = accessToken;
  await newUser.save();
  await myUser.save();
  //User.insertOne(newUser)
  res.json({
   data: newUser,
   accessToken
  })
}
  
 } 

 catch (error) {
  next(error)
 }
}


//Login
exports.login = async (req, res, next) => {
 try {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)  return next(new Error('Email does not exist'));
  const validPassword = await validatePassword(password, user.password);
  if (!validPassword) return next(new Error('Password is not correct'))
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {  expiresIn: "15d"  });
  await User.findByIdAndUpdate(user._id, { accessToken })
  res.status(200).json({
   data: { email: user.email, role: user.role },
   accessToken
  })
  }
  catch (error) {
   next(error);
  }
} 


exports.getUsers = async (req, res, next) => {
if(roles == 'admin'){
 users = await User.find({ })
 }
else{
const ids =  res.locals.loggedInUser._id   //61acca73d4170276eb737654  
const emails = await createdByCollection.find({ creatorId: ids})  
res.status(200).json({
  data: emails
 });
}
}


exports.getDishes = async (req ,res, next) => {
  if(roles == 'admin'){
    users = await Restaurants.find({ })
    }
   
   else{
   const ids =  res.locals.loggedInUser._id   //61acca73d4170276eb737654  
   const restaurants = await Restaurants.find({ createdBy: "supervisor"})  
   res.status(200).json({
     data: restaurants
    });
   }
  }


exports.getSubAdmins = async (req , res, next) =>{
 const SubAdmins = await User.find( { role:"supervisor" } );
 res.status(200).json({
  data : SubAdmins
  });
}


exports.getRestaurants = async (req , res) =>{
  if(roles == 'admin'){
    users = await User.find({ })
    }
   
   else{
   const ids =  res.locals.loggedInUser._id   //61acca73d4170276eb737654  
   const emails = await createdByCollection.find({ creatorId: ids})  
   res.status(200).json({
     data: emails
    });
   } 
  
}


exports.getUser = async (req, res, next) => {
 try {
  const user = await User.findById(res.locals.loggedInUser._id);
  if (!user) return next(new Error('User does not exist'));
   res.status(200).json({
   data: user
  });
 }
 catch (error) {
  next(error)
 }
}


exports.createRestaurants = async(req,res,next) => {
try{
console.log(res.locals.loggedInUser)
const { item,createdBy,restaurantName } = req.body
const createdRestaurants = new Restaurants({ item, createdBy: createdBy || "basic", restaurantName})
const createdByRestaurants = new createdByCollection({ creatorId: res.locals.loggedInUser._id,
   restaurantName: restaurantName , createdBy: res.locals.loggedInUser.createdBy })
const accessToken = jwt.sign( { userId: createdRestaurants._id }, process.env.JWT_SECRET, { expiresIn: "15d" } )
createdRestaurants.accessToken = accessToken
createdByRestaurants.accessToken = accessToken
await createdRestaurants.save()
await createdByRestaurants.save()
res.json({
data: createdRestaurants,createdByRestaurants
})
}
catch(error){
 next(error)
}
}


exports.createUser = async(req,res,next) => {
 
try{
    const { email,password,role,createdBy }  = req.body
    const hashedPassword = await hashPassword(password)
    //console.log(res.locals.loggedInUser) 
 
let emailNotRegistered = await validateEmail(email);
if ( !emailNotRegistered )
{
  return res.status(400).json({
    message: `Email is already registered.`,
    success: false
  });
}

else
{
 const createdUser = new User({ email, password: hashedPassword,
    role: role || "basic" , createdBy: createdBy || "basic"})
 const createdByUser = new createdByCollection({ creatorId: res.locals.loggedInUser._id, userEmail: email ,
   createdBy: res.locals.loggedInUser._createdBy })
 const accessToken = jwt.sign( { userId: createdUser._id }, process.env.JWT_SECRET, {  expiresIn: "15d"} )
 createdUser.accessToken = accessToken
 createdByUser.accessToken = accessToken
 await createdUser.save()
 await createdByUser.save()
 res.json({
  data: createdUser,createdByUser,
  accessToken
 })
}

  }
  
  catch(error){
   next(error)
  }

}


exports.createSubAdmins = async(req,res,next) => {

  const { email,password,createdBy }  = req.body
  const hashedPassword = await hashPassword(password)
  if(res.locals.loggedInUser.role == 'admin'){
  
  try{
      //console.log(res.locals.loggedInUser) 
     let emailNotRegistered = await validateEmail(email);
  if ( !emailNotRegistered )
  {
    return res.status(400).json({
      message: `Email is already registered.`,
      success: false
    });
  }
  
  else
  {
   const createdUser = new User({ email, password: hashedPassword,
      role: role || "supervisor" , createdBy: createdBy || "basic"})
   const createdByUser = new createdByCollection({ creatorId: res.locals.loggedInUser._id, userEmail: email ,
      createdBy: res.locals.loggedInUser.createdBy })
   const accessToken = jwt.sign( { userId: createdUser._id }, process.env.JWT_SECRET, {  expiresIn: "15d"} )
   createdUser.accessToken = accessToken
   createdByUser.accessToken = accessToken
   await createdUser.save()
   await createdByUser.save()
   res.json({
    data: createdUser,createdByUser,
    accessToken
   })
  }
  
    }
    
    catch(error){
     next(error)
    }
    
  }

  else{
    return res.status(400).json({
      message: `Logged in user must be admin to create sub-admin`,
      success: false
    });
  }

}


exports.updateUser = async (req, res, next) => {
 try {
  const update = req.body
  const userId = req.params.userId;
  await User.findByIdAndUpdate(userId, update);
  const user = await User.findById(userId)
  res.status(200).json({
   data: user,
   message: 'User has been updated'
  });
 } catch (error) {
  next(error)
 }
}


exports.deleteUser = async (req, res, next) => {
 try {
  const userId = req.params.userId;
  await  User.findByIdAndDelete(userId);
  res.status(200).json({
   data: null,
   message: 'User has been deleted'
  });
 } catch (error) {
  next(error)
 }
}


exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   //console.log(permission.granted);
   //console.log(req.user.role)
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}


// exports.getCookies = async(req, res, next) => {
//   res.cookie("userData", res.locals.loggedInUser._id)
//   res.send(req.cookies)
// }


exports.allowIfLoggedin = async (req, res, next) => { 
  try {
  const user =  res.locals.loggedInUser.email
 
  if (!user)
    return res.status(401).json({
    error: "You need to be logged in to access this route"
   })
   //req.user = user
   next()
  }

  catch (error) {
   next(error)
  }

}


//Route for destroying cookie
exports.logout = async (req, res)=>{
  //it will clear the userData cookie

  res.clearCookie()
  console.log("Logout cokies are :"+req.cookies)
  
  res.status(200).json({
    message: 'User has been logged out'
   })
 
     }


// exports.logout = async (req, res) => {
// console.log(res.locals.loggedInUser._id)
// const a = res.locals.loggedInUser
// const authHeader = req.headers["x-access-token"].value
// console.log( authHeader )
// const accessToken = jwt.sign({ userId: a._id } , process.env.JWT_SECRET, { expiresIn: '1s' } );

// const accessToken = jwt.sign({ authHeader } , process.env.JWT_SECRET ,  { expiresIn: '1s' } );
//  await User.findByIdAndUpdate(a._id, { accessToken })
//   res.status(200).json({
//     data: { 
//       accessToken
//    }})
// }

 

// exports.verifyJwtToken = app.use( async (req, res, next) => {
//   if (req.headers["x-access-token"]) {
//      const accessToken = req.headers["x-access-token"];
//      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
//      // Check if token has expired
//      if ( exp < Date.now().valueOf() / 10000 ) { 
//       return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
//      } 
//      console.log("userId:  "+userId)
//      res.locals.loggedInUser = await User.findById(userId);
     
//      next(); 
//        }
  
//   else { 
//     console.log(req.headers["x-access-token"])
//     next(); 
//   } 
//  })

