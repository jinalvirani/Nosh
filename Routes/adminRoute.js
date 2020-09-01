//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ2ZTVhYWMyMzExNTIzMjMwNzZjYjA4IiwiaWF0IjoxNTY3NTEzMjYwfQ.BBwJcdNFd-rbynbFmaOsOLTHWIrh4xAHqHmVi9eYxx4
//{"firstname":"deepgandhi","lastname":"gandhi","username":"deepgandhi","password":"deep123","email":"deep.gandhi0@gmail.com","gender":"male","contactno":7405028057,"city":"surat","address":"c-77 sagar soc.","notes":"don't forgot to add spoons"}
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const validate = require("../middleware/checktoken");
const joi = require('joi');

const {dabaatypetb,subtypetb, dishtypetb} = require('../Schemas/adminSchema');
const {orderhometb,ordershoptb} = require('../Schemas/orderSchema');
const { wallettb,transactiontb } = require("../Schemas/userSchema");
//const dabbaValidate = require('../middleware/joimiddleware');

const router = express();
const con = process.env.dbconneection;

//------------------------------- dabba type--------------------------//


router.post('/dabaatypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const addDabba = new dabaatypetb({
            type: req.body.type,
            price:req.body.price
        });
        const Schema = joi.object().keys({
            type: joi.string().required(),
            price: joi.number().required()
        });
        joi.validate(req.body,Schema, (validationerr,result) => {
            if(validationerr)
                res.status(422).json(validationerr);
            else
            {
                dabaatypetb.find({type:req.body.type},{'__v':0})
                .then((findobj) => {
                    if(findobj.length === 0)
                    {
                        addDabba.save()
                        .then((addsucc) => {
                            addsucc.__v=undefined;
                            console.log(addsucc);
                            res.status(200).json(addsucc);
                        })
                        .catch((adderr) => {
                            console.log(adderr);
                            res.status(409).json(adderr);
                        });
                    }
                    else
                    {
                        console.log("Dabba type exist");
                        res.status(409).json({msg:"Dabba type exist"});
                    }
                })
                .catch((finderr) => {
                    console.log(finderr);
                    res.status(409).json(finderr);
                });
            }
        });

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    })
});

router.get('/dabaatypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        dabaatypetb.find({},{'__v':0})
        .then((findobj) => {
            if(findobj.length === 0) 
            {
                console.log("no data found");
                res.status(404).json({msg:"no data found"});
            }
            else
            {
                console.log(findobj);
                res.status(200).json(findobj);
            }
        })
        .catch((finderr) => {
            console.log(finderr);
            res.status(409).json(finderr);
        });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});



router.patch('/dabaatypetb',validate,(req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
            const Schema = joi.object().keys({
                _id:joi.string().required(),
                type: joi.string().required(),
                price: joi.number().required()
            });
            joi.validate(req.body,Schema, (validationerr,result) => {
                if(validationerr)
                    res.status(422).json(validationerr);
                else
                {
                    dabaatypetb.findByIdAndUpdate({_id: req.body._id},{type:req.body.type, price: req.body.price})
                    .then((updatesuc) => {
                        if(updatesuc === null)
                        {
                            console.log("not updated");
                            res.status(409).json({msg:'not updated'})
                        }
                        else
                        {
                            console.log(req.body);
                            res.status(200).json(req.body);
                        }
                    })
                    .catch((updateerr) => {
                        console.log(updateerr);
                        res.status(409).json(updateerr);
                    });
                }
            });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.delete('/dabaatypetb/:id',validate,(req,res) => {
    mongoose.connect(con, {useNewUrlParser:true})
    .then(() => {
        const delid = req.params.id;
        console.log(delid);
        if(delid)
        {
            dabaatypetb.findByIdAndDelete(delid)
            .then((deldabba) => {
                if(deldabba)
                {
                    console.log("del success");
                    res.status(200).json({msg:"del success"});  
                }
                else
                {
                    console.log("del unsuccess");
                    res.status(409).json({msg:"del unsuccess"});   
                }
            })
            .catch((delerr) => {
                console.log("del unsuccess");
                res.status(409).json({msg:"del unsuccess"});
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});



//----------------------------------subscription type--------------------------------------//


router.post('/subtypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const addsubtype = new subtypetb({
            type: req.body.type
        });
        const Schema = joi.object().keys({
            type: joi.string().required()
        });
        joi.validate(req.body,Schema, (validationerr,result) => {
            if(validationerr)
                res.status(422).json(validationerr);
            else
            {
                subtypetb.find({type:req.body.type})
                .then((findobj) => {
                    if(findobj.length === 0)
                    {
                        addsubtype.save()
                        .then((addsucc) => {
                            addsucc.__v=undefined;
                            console.log(addsucc);
                            res.status(200).json(addsucc);
                        })
                        .catch((adderr) => {
                            console.log(adderr);
                            res.status(409).json(adderr);
                        });
                    }
                    else
                    {
                        console.log("subscription type exist");
                        res.status(409).json({msg:"subscription type exist"});
                    }
                })
                .catch((finderr) => {
                    console.log(finderr);
                    res.status(409).json(finderr);
                });
            }
        });

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    })
});

router.get('/subtypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        subtypetb.find({},{'__v':0})
        .then((findobj) => {
            if(findobj.length === 0) 
            {
                console.log("no data found");
                res.status(409).json({msg:"no data found"});
            }
            else
            {
                console.log(findobj);
                res.status(200).json(findobj);
            }
        })
        .catch((finderr) => {
            console.log(finderr);
            res.status(409).json(finderr);
        });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


router.patch('/subtypetb',validate,(req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
            const Schema = joi.object().keys({
                _id:joi.string().required(),
                type: joi.string().required()
            });
            joi.validate(req.body,Schema, (validationerr,result) => {
                if(validationerr)
                    res.status(422).json(validationerr);
                else
                {
                    subtypetb.findByIdAndUpdate({_id: req.body._id},{type:req.body.type})
                    .then((updatesuc) => {
                        if(updatesuc === null)
                        {
                            console.log("not updated");
                            res.status(409).json({msg:'not updated'})
                        }
                        else
                        {
                            console.log(req.body);
                            res.status(200).json(req.body);
                        }
                    })
                    .catch((updateerr) => {
                        console.log(updateerr);
                        res.status(409).json(updateerr);
                    });
                }
            });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


router.delete('/subtypetb/:id',validate,(req,res) => {
    mongoose.connect(con, {useNewUrlParser:true})
    .then(() => {
        const delid = req.params.id;
        console.log(delid);
        if(delid)
        {
            subtypetb.findByIdAndDelete(delid)
            .then((delsub) => {
                if(delsub)
                {
                    console.log("del success");
                    res.status(200).json({msg:"del success"});  
                }
                else
                {
                    console.log("del unsuccess");
                    res.status(409).json({msg:"del unsuccess"});   
                }
            })
            .catch((delerr) => {
                console.log("del unsuccess");
                res.status(409).json({msg:"del unsuccess"});
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

//-------------------------- dish type ---------------------------------//

router.post('/dishtypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const adddishtype = new dishtypetb({
            type: req.body.type,
            price:req.body.price
        });
        const Schema = joi.object().keys({
            type: joi.string().required(),
            price: joi.number().required()
        });
        joi.validate(req.body,Schema, (validationerr,result) => {
            if(validationerr)
                res.status(422).json(validationerr);
            else
            {
                subtypetb.find({type:req.body.type})
                .then((findobj) => {
                    if(findobj.length === 0)
                    {
                        adddishtype.save()
                        .then((addsucc) => {
                            addsucc.__v=undefined;
                            console.log(addsucc);
                            res.status(200).json(addsucc);
                        })
                        .catch((adderr) => {
                            console.log(adderr);
                            res.status(409).json(adderr);
                        });
                    }
                    else
                    {
                        console.log("dish type exist");
                        res.status(409).json({msg:"dish type exist"});
                    }
                })
                .catch((finderr) => {
                    console.log(finderr);
                    res.status(409).json(finderr);
                });
            }
        });

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    })
});

router.get('/dishtypetb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        dishtypetb.find({},{'__v':0})
        .then((findobj) => {
            if(findobj.length === 0) 
            {
                console.log("no data found");
                res.status(200).json({msg:"no data found"});
            }
            else
            {
                console.log(findobj);
                res.status(200).json(findobj);
            }
        })
        .catch((finderr) => {
            console.log(finderr);
            res.status(409).json(finderr);
        });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


router.patch('/dishtypetb',validate,(req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
            const Schema = joi.object().keys({
                _id:joi.string().required(),
                type: joi.string().required(),
                price:joi.number().required()
            });
            joi.validate(req.body,Schema, (validationerr,result) => {
                if(validationerr)
                    res.status(422).json(validationerr);
                else
                {
                    dishtypetb.findByIdAndUpdate({_id: req.body._id},{type:req.body.type, price: req.body.price})
                    .then((updatesuc) => {
                        if(updatesuc === null)
                        {
                            console.log("not updated");
                            res.status(409).json({msg:'not updated'})
                        } 
                        else
                        {
                            console.log(req.body);
                            res.status(200).json(req.body);
                        }
                    })
                    .catch((updateerr) => {
                        console.log(updateerr);
                        res.status(409).json(updateerr);
                    });
                }
            });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


router.delete('/dishtypetb/:id',validate,(req,res) => {
    mongoose.connect(con, {useNewUrlParser:true})
    .then(() => {
        const delid = req.params.id;
        console.log(delid);
        if(delid)
        {
            dishtypetb.findByIdAndDelete(delid)
            .then((deldish) => {
                if(deldish)
                {
                    console.log("del success");
                    res.status(200).json({msg:"del success"});  
                }
                else
                {
                    console.log("del unsuccess");
                    res.status(409).json({msg:"del unsuccess"});   
                }
            })
            .catch((delerr) => {
                console.log("del unsuccess");
                res.status(409).json({msg:"del unsuccess"});
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

//----------------------------------disp all orders----------------------------------

router.get('/orderhometb',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        orderhometb.find({},{'__v':0})
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

router.get('/ordershoptb',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        ordershoptb.find({},{'__v':0})
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

//--------------------------------display individual order-----------------------------------------

router.get('/orderhometb/:id',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const dispid = req.params.id;
        if(dispid)
        {
            orderhometb.find({userid:dispid},{'__v':0})
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
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.get('/ordershoptb/:id',validate, (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const dispid = req.params.id;
        if(dispid)
        {
            ordershoptb.find({userid:dispid},{'__v':0})
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
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

//-------------------------- cooking order status cng---------------------------------
router.patch('/orderhometbp/:id',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const updateid = req.params.id;
        if(updateid)
        {
            orderhometb.findByIdAndUpdate({_id:updateid},{$set:{status:'preparing'}})
            .then((updatesuc) => {
                if(updatesuc === null)
                {
                    console.log("not updated");
                    res.status(409).json({msg:'not updated'})
                }
                else
                {
                    updatesuc.__v=undefined;
                    updatesuc.status='preparing';
                    console.log(updatesuc);
                    res.status(200).json(updatesuc);
                }
            })
            .catch((updateerr) => {
                console.log(updateerr);
                res.status(409).json(updateerr);
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.patch('/ordershoptbp/:id',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const updateid = req.params.id;
        if(updateid)
        {
            ordershoptb.findByIdAndUpdate({_id:updateid},{$set:{status:'preparing'}})
            .then((updatesuc) => {
                if(updatesuc === null)
                {
                    console.log("not updated");
                    res.status(409).json({msg:'not updated'})
                }
                else
                {
                    updatesuc.__v=undefined;
                    updatesuc.status='preparing'
                    console.log(updatesuc);
                    res.status(200).json(updatesuc);
                }
            })
            .catch((updateerr) => {
                console.log(updateerr);
                res.status(409).json(updateerr);
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});
//--------------------------delivered order status cng--------------------------------

router.patch('/orderhometb/:id',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const updateid = req.params.id;
        if(updateid)
        {
            orderhometb.findByIdAndUpdate({_id:updateid},{$set:{status:'delivered'}})
            .then((updatesuc) => {
                if(updatesuc === null)
                {
                    console.log("not updated");
                    res.status(409).json({msg:'not updated'})
                }
                else
                {
                    updatesuc.__v=undefined;
                    updatesuc.status='delivered';
                    console.log(updatesuc);
                    res.status(200).json(updatesuc);
                }
            })
            .catch((updateerr) => {
                console.log(updateerr);
                res.status(409).json(updateerr);
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

router.patch('/ordershoptb/:id',validate, (req,res) => {
    mongoose.set('useFindAndModify',false);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const updateid = req.params.id;
        if(updateid)
        {
            ordershoptb.findByIdAndUpdate({_id:updateid},{$set:{status:'delivered'}})
            .then((updatesuc) => {
                if(updatesuc === null)
                {
                    console.log("not updated");
                    res.status(409).json({msg:'not updated'})
                }
                else
                {
                    updatesuc.__v=undefined;
                    updatesuc.status='delivered';
                    console.log(updatesuc);
                    res.status(200).json(updatesuc);
                }
            })
            .catch((updateerr) => {
                console.log(updateerr);
                res.status(409).json(updateerr);
            });
        }
        else
        {
            console.log("id not passed");
            res.status(404).json({msg:"id not passed"});
        }
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});


//----------------------count daily monthly yearly & total income------------------------//
router.get('/transactiontb',validate,(req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
       transactiontb.aggregate([{
           $group:
           {
               _id:'$subtype',
               amt: { $sum: "$amt" }   
           }
       }]
       , (sumerr, result) =>{
            if(sumerr)
            {
                console.log(sumerr);
                res.status(500).json(sumerr);
            }
            else
            {
                console.log(result);
                var total = 0;
                if(result[0])
                    total+=result[0].amt;
                if(result[1])
                    total+=result[1].amt;
                if(result[2])
                    total+=result[2].amt;
                res.status(200).json({res: result, totalamt:total});
            }

       })
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    });
});

module.exports = router;
