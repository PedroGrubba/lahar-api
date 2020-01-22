//Validation
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {  
    const schema = {
        nome: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(), 
        passwordConfirm: Joi.string()
            .min(6)
            .required()
    };
    return new Joi.ValidationError(data, schema);
};

// Login Validation
const loginValidation = data => { 
    const schema = {
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };
    return new Joi.ValidationError(data, schema);
};

// Login Validation
const forgotPasswordValidation = data => { 
    const schema = {
        email: Joi.string()
            .min(6)
            .required()
            .email()
    };
    return new Joi.ValidationError(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.forgotPasswordValidation = forgotPasswordValidation;

// voltar a ver o vídeo: https://youtu.be/2jqok-WgelI?t=2485