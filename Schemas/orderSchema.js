const mongoose = require('mongoose');

const dabbaschema = mongoose.Schema({
   // _id : {type: mongoose.Schema.Types.ObjectId, default: new mongoose.Types.ObjectId()},
    type: String,
    price: Number
});
const dabbamdl =  mongoose.model('dabaatypetb',dabbaschema);
module.exports = { dabaatypetb: dabbamdl };