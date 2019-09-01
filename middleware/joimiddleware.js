const joi = require('joi');
module.exports = (req,res,next) => {

        const Schema = joi.object().keys({
            firstname: joi.string().required(),
            lastname: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required(),
            email: joi.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
            gender: joi.string().required(),
            contactno: joi.string().length(10).required(),
            city: joi.string().required(),
            address: joi.string().required(),
            notes: joi.string().required()
        });
        joi.validate(req.body,Schema, (err,result) => {
            if(err)
                return res.status(400).json(err);
            else
                next();
        });
};