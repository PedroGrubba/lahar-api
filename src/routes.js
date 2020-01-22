const express = require('express');
const routes  = express.Router();

const SalesforceAPI     = require('./modules/salesforce/api');
const authRoute         = require('./modules/auth/routes');
const adminAuth         = require('./middlewares/adminAuth');
const webserviceRoute  = require('./modules/webservice/routes');

// ---------------------------------------------------------------------------------------
routes.use("/auth", authRoute);
routes.use("/webservice", webserviceRoute);

// ---------------------------------------------------------------------------------------
// Página principal
routes.get("/admin/dashboard", adminAuth, (req, res) => { 
    res.render(__dirname + "/views/admin/dashboard", {
        results : [
            { 
                "Mes__c":"Jan", 
                "Total_do_Valor_Parcelado__c":10000, 
                "Total_a_receber__c":150, 
                "Quantidade_de_Operacoes__c":1 
            }
        ],
        teste: 20,
        usuario: req.session.user
        
    });
    // SalesforceAPI.listResult().then(results => {
    //     res.render(__dirname + "/views/admin/dashboard", { 
    //         results : results, 
    //         teste : 20
    //     });
    // });

});

// ---------------------------------------------------------------------------------------
// exportando as routas para o App.js
module.exports = routes;