const Joi = require("@hapi/joi")

const joiUserValidationSchema = Joi.object({
    
    name: Joi.string(),
    email: Joi.string(),
    mobile: Joi.number(),
    username: Joi.string(),
    password: Joi.string(),
    bio:Joi.string(),
    avatar:Joi.string()
    

});


const joiPostValidationSchema = Joi.object({

    id: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    category: Joi.string(),
    likes: Joi.string(),

});


module.exports = { joiUserValidationSchema,joiPostValidationSchema };