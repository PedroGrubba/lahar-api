const User       = require('../auth/models/User');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const { loginValidation } = require('../auth/models/validation');

module.exports = {

    async getLeadsLahar(req, res){
        console.log('Dados do Lahar: ' + req.body);
        const Lead = req.body;

        if(Lead !== undefined || Lead !== null){
            if(typeof Lead.nome !== undefined || Lead.nome !== null){
                console.log('Nome: ' + Lead.nome);
            }

            if(typeof Lead.sobrenome !== undefined || Lead.sobrenome !== null){
                console.log('Sobrenome: ' + Lead.sobrenome);
            }
        }

        res.send({
            retorno: 'Sucesso!',
            data: Lead
        });

        // Utilizado o básico para envio de e-mail com o Sendgrid. Até a definição oficial do servidor de e-mail pela Safetec.
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: 'pedro.grubba@safetec.com.br',
            from: "noreply@safetec.com.br",
            subject: "Lead enviado pelo Lahar",
            text: "Lead enviado pelo Lahar",
            html: lead,
        };
        sgMail.send(msg);

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