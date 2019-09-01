const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");

const {dabaatypetb} = require('../Schemas/orderSchema');

const router = express();
const con = 'mongodb://localhost:27017/NoshDB';

router.post('/addDabbaType', (req,res) => {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
        const addDabba = new dabaatypetb({
            type: req.body.type,
            price:req.body.price
        });
        dabaatypetb.find({type:req.body.type})
        .then((findobj) => {
            if(findobj.length === 0)
            {
                addDabba.save()
                .then((addsucc) => {
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

    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    })
});


module.exports = router;
