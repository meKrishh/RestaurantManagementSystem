// server/models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantsSchema = new Schema({
 
    item: {
    type: String
    },
    createdBy: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "admin"]
    },
    restaurantName: {
        type: String,
        trim: true
       }
       
});

const Restaurants = mongoose.model('restaurants', RestaurantsSchema);
module.exports = Restaurants;