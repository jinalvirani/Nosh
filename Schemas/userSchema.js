const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    gender:String,
    contactno: Number,
    city:String,
    address:String,
    walletid: {type:mongoose.Schema.Types.ObjectId, ref:'wallettb'},
});
const usermdl= mongoose.model('usertb',userSchema);

const wallet =  mongoose.Schema({
  balance : {type : Number, default:0},
  transactions:{type: [String], default:null}
});
const walletmdl = mongoose.model('wallettb',wallet);

const transactionShema = mongoose.Schema({
  amt : Number,
  date: {type:Date, default:new Date()},
  msg: String,
  subtype:String,
  deductionType:{type:Number, default:0}
});
const transactionmdl = mongoose.model('transactiontb',transactionShema);
module.exports = {usertb:usermdl, wallettb:walletmdl, transactiontb:transactionmdl};