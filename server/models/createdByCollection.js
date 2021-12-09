const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createdBySchema = new Schema({
    creatorId: {
        type: String,
        trim: true
       },
    userEmail: {
        type: String
       },
    createdBy:{
           type: String,
           default: 'basic',
           enum: ["basic", "supervisor", "admin"]
          }
})

const createdByCollection = mongoose.model('createdByCollection', createdBySchema);
module.exports = createdByCollection;