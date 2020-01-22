const User       = require('../auth/models/User');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { loginValidation } = require('../auth/models/validation');

module.exports = {

    async helloWord(req, res){
        res.send('Hello word!');
    },

    // LOGIN
    // -----------------------------------------------------------------------------------
    async login(req, res){
        //Let validade the login
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send({ 
            success: false,
            message: error.details[0].message 
        });

        //Checking if the ema18il exists 
        const user = await User.findOne({ email: req.body.email });
        if(!user) return res.status(404).send({ 
            success: false,
            message: "Email incorreto ou não registrado."
        });

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass) return res.status(403).send({
            success: false,
            error: "Senha inválida"
          });

        //Create and assign a token
        const token = jwt.sign({ _id: user._id } , process.env.TOKEN_SECRET);
        res.send({
            success: true,
            authToken: token,
            userId: user._id,
            email: user.email
        });
    },

};