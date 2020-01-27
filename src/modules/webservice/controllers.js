const User       = require('../auth/models/User');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { loginValidation } = require('../auth/models/validation');
const Salesforce = require('../salesforce/api');

module.exports = {

    async getLeadsLahar(req, res){
        console.log('Dados do Lahar: ' + req.body);
        const Lead = req.body;

        if(Lead !== undefined || Lead !== null){
            console.log(" ---------------------------------------------------- ");
            if(typeof Lead.nome !== undefined || Lead.nome !== null){
                console.log('Nome: ' + Lead.nome);
            }

            if(typeof Lead.sobrenome !== undefined || Lead.sobrenome !== null){
                console.log('Nome Empresa: ' + Lead.nome_empresa);
            }
            console.log(" ---------------------------------------------------- ");
        }

        // caso o Lead não tenha sobrenome, transfere o nome para o campo devido a obrigatoriedade do 
        // Ssalesforce
        if(Lead.sobrenome === null){
            Lead.sobrenome = Lead.nome;
            Lead.nome = '';
        }

        // informa empresa padrão caso o Lead não tenha
        if(Lead.nome_empresa === null){
            Lead.nome_empresa = 'Lahar Corp';
        }

        const jsonSalesforce = {
            FirstName:      Lead.nome,
            LastName:       Lead.sobrenome,
            MobilePhone:    Lead.tel_celular,
            Email:          Lead.email,
            Industry:       Lead.setor,
            Title:          Lead.cargo,
            Company:        Lead.nome_empresa,
            State:          Lead.estado
        };

        Salesforce.registerLead( jsonSalesforce )
            .then( results => {
                res.send({
                    success: true,
                    message: results
                });
            })
            .catch( err => {
                res.send({
                    success: false,
                    message: err.message
                });
            });        
    }, 

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