const jwt = require('jsonwebtoken');

// Authorization: Bearer <access_token>
module.exports = function(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader === 'undefined' || bearerHeader === undefined) return res.status(401).send('Acesso Negado');

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const token = bearerToken;

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch( err ){
        res.status(400).send({ 
            success: false,
            message: 'Token de acesso invalido'
        }); 
        console.warn(err);
    }
}