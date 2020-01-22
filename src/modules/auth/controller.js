const User      = require('./models/User');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const router    = require('express').Router();
const { registerValidation, loginValidation, forgotPasswordValidation } = require('./models/validation');

module.exports = {

    // REGISTER
    // -----------------------------------------------------------------------------------
    async register(req, res){
        //Let validade the data before we a User    
        const { error } = registerValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        //Checking if the email user is already in the database
        const emailExist = await User.findOne({email: req.body.email });
        if(emailExist) return res.status(400).send('Email já registrado');
    
        // Verify same password
        const samePassword = req.body.passwordConfirm === req.body.password;
        if(!samePassword) return res.status(400).send('Confirmação de senha incorreta.');
    
        //Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        //Create a new User
        const user = new User({
            nome: req.body.nome,
            email: req.body.email,
            operacao: req.body.operacao,
            password: hashPassword
        });
    
        try{
            const savedUser = await user.save();
            res.send({
                message: "Usuário registrado com sucesso!",
                user: user._id, 
                email: user.email
            });
        } catch(err){
            console.warn(err);
        }
    
    },

    // LOGIN
    // -----------------------------------------------------------------------------------
    async login(req, res){
        const email     = req.body.email;
        const password  = req.body.password;

        //Checking if the email exists 
        const user = await User.findOne({ email: email });
        if(!user) return res.status(400).send('Email incorreto ou não registrado.');
    
        //Password is correct
        const validPass = await bcrypt.compare(password, user.password);
        if(!validPass) return res.status(400).send('Senha invalida.');

        req.session.user = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            operacao: user.operacao
        }
        res.redirect('/admin/dashboard');
    },

    // FORGOT PASSWORD
    // -----------------------------------------------------------------------------------
    async forgot(req, res){
        //Let validade the login
        const { error } = forgotPasswordValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        //Checking if the email exists 
        const user = await User.findOne({ email: req.body.email });
        if(user === null) return res.status(400).send('Email não registrado. Realize o cadastro');
    
        //Create and assign a token by e-mail
        const token = jwt.sign({ email: user.email } , process.env.TOKEN_SECRET);
        res.header('authorization', token).json({
            token
        });
    }, 


    // CHANGE PASSWORD
    // -----------------------------------------------------------------------------------
    async changepass(req, res){
        //Let validade the login
        const { error } = forgotPasswordValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);
    
        //Checking if the email exists 
        const user = await User.findOne({ email: req.user.email });
        if(user === null) return res.status(400).send('Email não registrado. Realize o cadastro');
    
        // Verify same password
        const samePassword = req.body.passwordConfirm === req.body.password;
        if(!samePassword) return res.status(400).send('Confirmação de senha incorreta.');
    
        //Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
    
        //Create a new User
        const updateUser = new User({
            _id: user._id,
            email: user.email,
            password: hashPassword
        });
    
        try{
            const updatedUser = await User.findByIdAndUpdate(updateUser._id, updateUser, 
                    { new: true }
                );

            res.send({
                message: "Senha atualiza com sucesso!",
                user: user._id, 
                email: user.email
            });

        } catch(err){
            console.warn(err);
        }
    
    }

};