//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ2ZTVhYWMyMzExNTIzMjMwNzZjYjA4IiwiaWF0IjoxNTY3NTEzMjYwfQ.BBwJcdNFd-rbynbFmaOsOLTHWIrh4xAHqHmVi9eYxx4
//miral = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ4YjJkYzU5ZjBlN2UwZDM4OWE4N2Y2IiwiaWF0IjoxNTY5NDAyMzA5fQ.K1f3Jwwv0P8sXMprOXVViwYa29brCqlK3HfAJrVK1Ks

const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const validate = require("../middleware/checktoken");
const joi = require('joi');

const {orderhometb,ordershoptb} = require('../Schemas/orderSchema');
const {dabaatypetb,subtypetb, dishtypetb} = require('../Schemas/adminSchema');
const { usertb,wallettb,transactiontb } = require("../Schemas/userSchema");
const mail=require('../middleware/mail');
//const dabbaValidate = require('../middleware/joimiddleware');

const router = express();
const con = process.env.dbconneection;

//---------------------------------------- order from home---------------------------//
router.post('/orderhometb',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const userid =jwt.verify(req.headers.token,process.env.tokenstring);
        
        const orderhome = new orderhometb({
            userid: userid.user_id,
            subid: req.body.subid,
            typeid: req.body.typeid,
            quantity: req.body.quantity,
            member: req.body.member,
            deladd: req.body.deladd,
            pickupadd: req.body.pickupadd, 
            time:req.body.time,
            notes:req.body.notes
        });
        const Schema = joi.object().keys({
            subid: joi.required(),
            typeid: joi.required(),
            quantity: joi.number().required(),
            member: joi.number().required(),
            deladd: joi.string().required(),
            pickupadd: joi.string().required(),
            time: joi.string().required(),
            notes:joi.string()
        });
        joi.validate(req.body,Schema, (validationerr,result) => {
            if(validationerr)
            {
                console.log(validationerr);
                res.status(422).json(validationerr);
            }
            else
            {
                
                //-------------------- wallet amt check---------------------
                dabaatypetb.find({_id:orderhome.typeid})
                .then((doc) => {
                    console.log(doc);
                    subtypetb.find({_id:orderhome.subid})
                    .then((doc1) => {
                        if(doc1[0].type === 'daily'){
                            price = doc[0].price * 1 * orderhome.quantity;
                        }
                        else if(doc1[0].type === 'yearly'){
                            price = doc[0].price * 365 * orderhome.quantity;
                        }
                        else if(doc1[0].type === 'monthly'){
                            price = doc[0].price * 30 * orderhome.quantity;
                        }
                        console.log(price);
                        usertb.find({_id:userid.user_id})
                        .then((userobj) => {
                            console.log(userobj);
                            wallettb.find({_id:userobj[0].walletid})
                            .then((walletobj) => {
                                //console.log(walletobj);
                                if(walletobj[0].balance<price)
                                {
                                    console.log("insuffi. amt");
                                    res.status(404).json({msg:'insuffi. amt'})
                                }
                                else
                                {
                                    orderhome.save()
                                    .then((orderobj) => {
                                        orderobj.__v=undefined; 
                                        const transactionUpdate = new transactiontb({
                                            amt : price,
                                            date: new Date(),
                                            msg: doc1[0].type + " " + doc[0].type +" Dabba service",
                                            subtype:doc1[0].type,
                                            deductionType:0
                                        });
                                        transactionUpdate.save()
                                        .then((transaction) => {
                                            wallettb.findByIdAndUpdate({_id:walletobj[0]._id},{balance: walletobj[0].balance-price,
                                                '$push':{transactions:transaction._id}
                                            })
                                            .then((walletupdate) => {
                                                console.log(walletupdate);
                                                console.log(orderobj);
                                                res.status(200).json(orderobj);
                                            })
                                            .catch((walletupdateerr) => {
                                                console.log(walletupdateerr);
                                                res.status(500).json(walletupdateerr);
                                            })
                                        })
                                        .catch((transactionErr) => {
                                            console.log(transactionErr);
                                            res.status(500).json(transactionErr);
                                        });
                                    })
                                    .catch((ordererr) => {
                                        console.log(ordererr);
                                        res.status(409).json(ordererr); 
                                    });
                                }
                            })
                            .catch((walleterr) => {
                                console.log(walleterr);
                            });
                        })
                        .catch((usererr) => {
                            console.log(usererr);
                        });
                        //res.status(200).json({'message':price});
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({'msg':'server error'})
                    });
                })
                .catch((errormain) => {
                    console.log(errormain);
                    res.status(500).json({'msg':'server error'})
                });
                //------------------------ end check----------------------------------

                // orderhome.save()
                // .then((orderobj) => {
                //     orderobj.__v=undefined;
                // //------------------email-----------------------------------
                // //    const mailobj = {
                // //     receiver:"jinalvirani79@gmail.com",
                // //     subject:"Nosh dabba service",
                // //     text:"your order Successfully placed. address = " + orderobj.deladd
                // // }
                // //   mail.sendMail(mailobj, function (err, rows) {
                
                // //       if (err) {
                // //           res.json(err);
                // //       } else {
                // //           //res.json(rows);
                // //           return res.json({
                // //               success: true,
                // //               msg: 'sent'
                // //           });
                // //       }
                // //   });
                // //----------------------------------------------------------
                //     console.log(orderobj);
                //     res.status(200).json(orderobj);
                // })
                // .catch((ordererr) => {
                //     console.log(ordererr);
                //     res.status(409).json(ordererr); 
                // });
            }
        });

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.get('/checkapi' , (request,response) => {
    
});

router.get('/orderhometb',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const userid =jwt.verify(req.headers.token,process.env.tokenstring);
        orderhometb.find({userid:userid.user_id},{'__v':0})
        .populate('subid',{'__v':0})
        .populate('typeid',{'__v':0})
        .exec((exeerr, orderobj) => {
            if(exeerr)
            {
                console.log(exeerr);
                res.status(409).json(exeerr);
            }
            else
            {
                console.log(orderobj);
                res.status(200).json(orderobj);
            }
        });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

//---------------------------------------- order form shop---------------------------//

// router.post('/imageupload',validate, (req,res) => {
//     mongoose.set('useFindAndModify',false);
//     mongoose.connect(con,{useNewUrlParser:true})
//     .then(() => {
//         if(!req.files || Object.keys(req.files).length === 0)
//         {
//             console.log('no file uploaded');
//             return res.status(404).json({msg:'no file uploaded'});
//         }
//         const img = req.files.image;
//         console.log(img);
//         img.mv(__dirname+'../../images/'+img.name, (mverr) =>{
//             if(mverr)
//             {
//                 console.log(mverr);
//             }
//             else
//             {
//                 console.log("image uploaded");
//             }                            
//         });  
//     })  
//     .catch((dberr) => {
//         console.log(dberr);
//         res.status(500).json(dberr);
//     });
// });

router.post('/ordershoptb',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const userid =jwt.verify(req.headers.token,process.env.tokenstring);
        const ordershop = new ordershoptb({
            userid: userid.user_id,
            subid: req.body.subid,
            typeid: req.body.typeid,
            typeoffood: req.body.typeoffood,
            quantity: req.body.quantity,
            deladd: req.body.deladd
        });
        const Schema = joi.object().keys({
            subid: joi.required(),
            typeid: joi.required(),
            typeoffood: joi.required(),
            quantity: joi.number().required(),
            deladd: joi.string().required()
        });
        joi.validate(req.body,Schema, (validationerr,result) => {
            if(validationerr)
            {
                console.log(validationerr);
                res.status(422).json(validationerr);
            }
            else
            {
                //------------------------wallet amt check------------------
                dishtypetb.find({_id:ordershop.typeid})
                .then((doc) => {
                    console.log(doc);
                    subtypetb.find({_id:ordershop.subid})
                    .then((doc1) => {
                        if(doc1[0].type === 'daily'){
                            price = doc[0].price * 1 * ordershop.quantity;
                        }
                        else if(doc1[0].type === 'yearly'){
                            price = doc[0].price * 365 * ordershop.quantity;
                        }
                        else if(doc1[0].type === 'monthly'){
                            price = doc[0].price * 30 * ordershop.quantity;
                        }
                        console.log(price);
                        usertb.find({_id:userid.user_id})
                        .then((userobj) => {
                            console.log(userobj);
                            wallettb.find({_id:userobj[0].walletid})
                            .then((walletobj) => {
                                //console.log(walletobj);
                                if(walletobj[0].balance<price)
                                {
                                    console.log("insuffi. amt");
                                    res.status(404).json({msg:'insuffi. amt'})
                                }
                                else
                                {  
                                    ordershop.save()
                                    .then((orderobj) => {
                                        orderobj.__v=undefined; 
                                        const transactionUpdate = new transactiontb({
                                            amt : price,
                                            date: new Date(),
                                            msg: doc1[0].type + " " + doc[0].type +" dish service",
                                            subtype:doc1[0].type,
                                            deductionType:0
                                        });
                                        transactionUpdate.save()
                                        .then((transaction) => {
                                            wallettb.findByIdAndUpdate({_id:walletobj[0]._id},{balance: walletobj[0].balance-price,
                                                '$push':{transactions:transaction._id}
                                            })
                                            .then((walletupdate) => {
                                                console.log(walletupdate);
                                                console.log(orderobj);
                                                res.status(200).json(orderobj);
                                            })
                                            .catch((walletupdateerr) => {
                                                console.log(walletupdateerr);
                                                res.status(500).json(walletupdateerr);
                                            })
                                        })
                                        .catch((transactionErr) => {
                                            console.log(transactionErr);
                                            res.status(500).json(transactionErr);
                                        });
                                    })
                                    .catch((ordererr) => {
                                        console.log(ordererr);
                                        res.status(409).json(ordererr); 
                                    });
                                }
                            })
                            .catch((walleterr) => {
                                console.log(walleterr);
                                res.status(500).json(walleterr);
                            });
                        })
                        .catch((usererr) => {
                            console.log(usererr);
                            res.status(500).json(usererr);
                        });
                        //res.status(200).json({'message':price});
                        
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({'msg':'server error'})
                    });
                })
                .catch((errormain) => {
                    console.log(errormain);
                    res.status(500).json({'msg':'server error'})
                });
                //----------------------- end check-------------------------
            }
        });

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.get('/ordershoptb',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const user =jwt.verify(req.headers.token,'jinalvirani');
        ordershoptb.find({userid:user.user_id},{'__v':0})
        .populate('subid',{'__v':0})
        .populate('typeid',{'__v':0})
        .exec((exeerr, shopobj) => {
            if(exeerr)
            {
                console.log(exeerr);
                res.status(409).json(exeerr);
            }
            else
            {
                console.log(shopobj);
                res.status(200).json(shopobj);
            }
        });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


module.exports = router;
