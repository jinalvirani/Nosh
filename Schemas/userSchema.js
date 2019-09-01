const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  //  _id: { type:mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId()},
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    gender:String,
    contactno: Number,
    city:String,
    address:String,
    notes:String
});
const usermdl= mongoose.model('usertb',userSchema);
module.exports = {usertb:usermdl};