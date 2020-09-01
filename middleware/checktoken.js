const jwt = require('jsonwebtoken');
require('dotenv').config();
// const config = require('../config');
module.exports = (req,res,next) =>{
    try{
        const uid =jwt.verify(req.headers.token,process.env.tokenstring);
        console.log(uid);
        next();
    }
    catch(validationerr)
    {
        return res.status(401).json({msg:"auth. failed"});
    }
};
