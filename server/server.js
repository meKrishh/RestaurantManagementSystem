const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')
const User = require('./models/userModel')
const createdBy = require('./models/createdByCollection')
const Restaurants = require('./models/Restaurants')
const routes = require('./routes/routes.js')
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser());

require("dotenv").config({
 path: path.join(__dirname, "../.env")
})

const PORT = process.env.PORT || 3001
const dbURI = 'mongodb+srv://netninja:test1234@cluster0.lpmpa.mongodb.net/note-tuts?retryWrites=true&w=majority';
//const dbURI= 'mongodb+srv://netninja:test1234@cluster0.ulvle.mongodb.net/myDb?retryWrites=true&w=majority';
// mongodb+srv://netninja:<password>@cluster0.lpmpa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( result=> console.log('Mongodb connected successfully '))
  .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(async (req, res, next) => {
 if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
    // Check if token has expired
    if ( exp < Date.now().valueOf() / 10000 ) { 
     return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
    } 
    console.log("userId:  "+userId)
    res.locals.loggedInUser = await User.findById(userId);
    next(); 
   }
 
 else { 
  next(); 
 } 
});


app.use('/', routes);
app.listen(PORT, () => {
  console.log('Server is now listening on Port:', PORT)
})