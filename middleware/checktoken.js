const jwt = require('jsonwebtoken');
module.exports = (req,res,next) =>{
    try{
        const unm =jwt.verify(req.headers.token,'jinalvirani');
        console.log(unm);
        next();
    }
    catch(validationerr)
    {
        return res.status(401).json({msg:"auth. failed"});
    }
};
