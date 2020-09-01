const mongoose = require('mongoose');

const orderhome = mongoose.Schema({
    userid: {type:mongoose.Schema.Types.ObjectId, ref:'usertb'},
    subid:{type:mongoose.Schema.Types.ObjectId, ref:'subtypetb'},
    typeid: {type:mongoose.Schema.Types.ObjectId, ref:'dabaatypetb'},
    quantity: Number,
    member: Number,
    deladd:String,
    pickupadd:String,
    time:String,
    notes:String,
    date:{type:Date, default: new Date()},
    status:{type:String, default:'placed'}
});
const orderhomemdl = mongoose.model('orderhometb',orderhome);

const ordershop = mongoose.Schema({
    userid: {type:mongoose.Schema.Types.ObjectId, ref:'usertb'},
    subid:{type:mongoose.Schema.Types.ObjectId, ref:'subtypetb'},
    typeid: {type:mongoose.Schema.Types.ObjectId, ref:'dishtypetb'},
    typeoffood: String,
    quantity: Number,
    deladd:String,
    time:{type:Date, default: new Date()},
    date:{type:Date, default: new Date()},
    status:{type:String, default:'placed'}
});
const ordershopmdl = mongoose.model('ordershoptb',ordershop);


module.exports = { orderhometb : orderhomemdl, ordershoptb : ordershopmdl};