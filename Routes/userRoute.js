//token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ4NzE1YmFjNGRmZjQwMzQwYzVhNGFjIiwiaWF0IjoxNTY5MTM0MDEwfQ.tcRNMZP0-EsBstgL82R1uUCsw9NNHnueZMLzORg7ia0
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWQ4NzE1YmFjNGRmZjQwMzQwYzVhNGFjIiwiaWF0IjoxNTY5MTM0Mjc3fQ.ZknGe1kG1Gjhi0t852As8cklO_VyEzRUn9vRGHZubpE
//"password":"deep123","email":"deep.gandhi00@gmail.com"
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const encryptpass = require('password-hash');

const { usertb,wallettb } = require("../Schemas/userSchema");
const validate = require("../middleware/checktoken");
const joivalidate = require("../middleware/joimiddleware");
require('dotenv').config();

const router = express.Router();
//
const mail=require('../middleware/mail');

//const con = "mongodb://localhost:27017/NoshDB";
const con = process.env.dbconneection;

router.post("/", joivalidate, (req, res) => {
  mongoose
    .connect(con, { useNewUrlParser: true })
    .then(() => {
      const wallet = new wallettb();
     
      wallet.save()
      .then((addwallet) => {
        console.log(addwallet);

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
          walletid:addwallet._id
        });
        console.log(userdata.password);

        usertb
        .find({ email: req.body.email },{'__v':0})
        .then(findobj => {
          if (findobj.length === 0) {
            userdata.save()
              .then(adduser => {
                const token = jwt.sign({user_id:adduser._id},process.env.tokenstring);
                console.log(token);
                console.log("insert sucess");
                adduser.password=undefined;
                adduser.__v=undefined;
                res.status(200).json({ data: adduser, token: token });
              })
              .catch(adderr => {
                console.log("insert err" + adderr);
                res.status(500).json({ data: adderr, msg: "insert err" });
                wallettb.findByIdAndDelete(addwallet._id)
                .then((delwallet) => {
                  if(delwallet)
                  {
                      console.log("del success"); 
                  }
                  else
                  {
                      console.log("del unsuccess");   
                  }
                })
                .catch((delerr) => {
                    console.log("del unsuccess");
                });
              });
          } 
          else 
          {
            console.log("user exist");
            res.status(409).json({ msg: "user exist" });
            wallettb.findByIdAndDelete(addwallet._id)
            .then((delwallet) => {
              if(delwallet)
              {
                  console.log("del success"); 
              }
              else
              {
                  console.log("del unsuccess");   
              }
            })
            .catch((delerr) => {
                console.log("del unsuccess");
            });
          }
        })
        .catch(finderr => {
          console.log("find err");
          res.status(404).json({ msg: "find err" });
          wallettb.findByIdAndDelete(addwallet._id)
          .then((delwallet) => {
            if(delwallet)
            {
                console.log("del success"); 
            }
            else
            {
                console.log("del unsuccess");   
            }
          })
          .catch((delerr) => {
              console.log("del unsuccess");
          });
        });
      })
      .catch((wallererr) => {
        console.log(wallererr);
        res.status(409).json(wallererr);
      });
    })
    .catch(dberr => {
      console.log(dberr);
      res.status(500);
    });
});
//router.get('/')

router.get("/login",(req,res)=> {
  console.log(con);
    mongoose.connect(con,{useNewUrlParser:true})
    .then(() => {
       usertb.find({ email:req.body.email},{'__v':0})
       .then((findobj) => {
          if(findobj.length === 1)
          {
             const epass = findobj[0].password;
             const dpass = encryptpass.verify(req.body.password,epass);
             console.log(dpass);
             if(dpass)
             {
               console.log(dpass);
               const token = jwt.sign({user_id:findobj[0]._id},process.env.tokenstring);
                console.log("login success");
                findobj[0].password = undefined;
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
            res.status(404).json({msg:"invalid username or password"});
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
    });
});

router.post('/wallettb',validate,(req,res) => {
  mongoose.set('useFindAndModify',false);
  mongoose.connect(con,{useNewUrlParser:true})
  .then(() => {
    const userid =jwt.verify(req.headers.token,process.env.tokenstring);
    console.log(userid);
    usertb.find({_id:userid.user_id})
    .then((userobj) => {
      console.log(userobj[0].walletid);
      const Schema = joi.object().keys({
        balance: joi.number().required()
      });
      joi.validate(req.body,Schema, (validationerr,result) => {
        if(validationerr)
          res.status(422).json(validationerr);
        else
        {
            wallettb.find({_id:userobj[0].walletid})
            .then((findobj) => {
              const transactionUpdate = {
                amt : req.body.balance,
                date: new Date(),
                msg: req.body.balance+" added to wallet",
                deductionType:1
            }
              wallettb.findByIdAndUpdate({_id: userobj[0].walletid},{balance:findobj[0].balance + req.body.balance,
                                          '$push':{transactions: transactionUpdate}
                                          })
              .then((updatesuc) => {
                  if(updatesuc === null)
                  {
                      console.log("money not added");
                      res.status(409).json({msg:'money not added'})
                  }
                  else
                  {
                      console.log('money added');
                      res.status(200).json({msg:'money added'});
                  }
              })
              .catch((updateerr) => {
                  console.log(updateerr);
                  res.status(409).json(updateerr);
              });
            })
            .catch((finderr)=> {
              console.log(finderr);
            });
        }
      });
    })
    .catch((usererr) => {
      console.log("wallet "+usererr);
      res.status(404).json(usererr);
    });
  })
  .catch((dberr) => {
    console.log(dberr);
    res.status(500).json(dberr);
  });
});

// router.post('/mail', function (req, res, next) {
// const mailobj = {
// 	receiver:"deep.gandhi00@gmail.com",
// 	subject:"Nosh dabba service",
// 	text:"test mail"
// }
//   mail.sendMail(mailobj, function (err, rows) {

//       if (err) {
//           res.json(err);
//       } else {
//           //res.json(rows);
//           return res.json({
//               success: true,
//               msg: 'sent'
//           });
//       }
//   });
// });

module.exports = router;
