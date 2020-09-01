const mongoose = require('mongoose');

const dabbaschema = mongoose.Schema({
    type: String,
    price: Number
});
const dabbamdl =  mongoose.model('dabaatypetb',dabbaschema);

const subschema = mongoose.Schema({
     type: String
 });
 const submdl =  mongoose.model('subtypetb',subschema);

 const dishschema = mongoose.Schema({
    type: String,
    price:Number
});
const dishmdl =  mongoose.model('dishtypetb',dishschema); 
module.exports = { dabaatypetb: dabbamdl, subtypetb: submdl, dishtypetb : dishmdl};