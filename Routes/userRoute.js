const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const encryptpass = require('password-hash');

const { usertb } = require("../Schemas/userSchema");
const validate = require("../middleware/checktoken");
const joivalidate = require("../middleware/joimiddleware");

const router = express.Router();

const con = "mongodb://localhost:27017/NoshDB";

router.post("/regi", joivalidate, (req, res) => {
  mongoose
    .connect(con, { useNewUrlParser: true })
    .then(() => {
      const userdata = new usertb({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: encryptpass.generate(req.body.password),
        email: req.body.email,
        gender: req.body.gender,
        contactno: req.body.contactno,
        city: req.body.city,
        address: req.body.address,
        notes: req.body.notes
      });
      console.log(userdata.password);
      usertb
        .find({ email: req.body.email })
        .then(findobj => {
          if (findobj.length === 0) {
            userdata.save()
              .then(adduser => {
                const webtoken = jwt.sign(
                  { unm: adduser.username },
                  "jinalvirani"
                );
                console.log("insert sucess");
                res.status(200).json({ data: adduser, token: webtoken });
              })
              .catch(adderr => {
                console.log("insert err" + adderr);
                res.status(500).json({ data: adderr, msg: "insert err" });
              });
          } else {
            console.log("user exist");
            res.status(409).json({ msg: "user exist" });
          }
        })
        .catch(finderr => {
          console.log("find err");
          res.status(409).json({ msg: "find err" });
        });
    })
    .catch(dberr => {
      console.log(dberr);
      res.status(500);
    });
});

router.get("/login",(req,res)=> {
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
       usertb.find({ username:req.body.username})
       .then((findobj) => {
          if(findobj.length === 1)
          {
             const epass = findobj[0].password;
             const dpass = encryptpass.verify(req.body.password,epass);
             if(dpass)
             {
               const token = jwt.sign({unm:findobj[0].username},'jinalvirani');
                console.log("login success");
                res.status(200).json({data:findobj[0],token:token});
             }
             else
             {
              console.log("invalid username or password");
              res.status(409).json({msg:"invalid username or password"});
             }
            
          }
          else
          {
            console.log("invalid username or password");
            res.status(409).json({msg:"invalid username or password"});
          }
       })
       .catch((finderr) =>{
         console.log(finderr);
         res.status(409).json(finerr);
       });
    })
    .catch((dberr) => {
        console.log(dberr);
        res.status(500).json(dberr);
    })
});

router.get("/disp", validate, (req, res) => {
  res.status(200).json({ msg: "auth. sucess" });
});

module.exports = router;
