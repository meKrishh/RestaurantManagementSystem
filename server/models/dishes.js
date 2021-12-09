const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishesSchema = new Schema({
    creatorId: {
        type: String,
        trim: true
       },
    dishName: {
        type: String
       },
    createdBy:{
           type: String,
           default: 'basic',
           enum: ["basic", "supervisor", "admin"]
          }
})

const dishes = mongoose.model('dishes', dishesSchema);
module.exports = dishes;