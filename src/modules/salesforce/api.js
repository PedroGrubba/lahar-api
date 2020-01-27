const qs = require("querystring");
const axios = require('axios');
const properties = require("./properties");

// ---------------------------------------------------------------------------------------
// Método para conectar ao Salesforce e gerar o Token de acesso
async function getToken() {
    
    var reqBody = {
      client_id: properties.clientId,
      client_secret: properties.clientSecret,
      username: properties.username,
      password: properties.password
    };
    
    var options = {
      url: properties.urlLogin,
      method: "POST",
      data: qs.stringify(reqBody)
    };
    
    return await axios(options)
        .then(res => res.data.access_token)
        .catch(err => console.warn(err));
}

// ---------------------------------------------------------------------------------------
// Método para conectar a API de lista de resultado.
async function registerLeadSalesforce(token, params) {

  const body = params;

  const options = {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
    },
    data: body,
    url: "https://safetec--lightning.my.salesforce.com/services/apexrest/LeadsWeColab/"
    //url: "https://safetec.my.salesforce.com/services/apexrest/LeadsWeColab/"
  };

  return await axios(options)
    .then( res => { return res })
    .catch(err => { console.warn(err);
    });
}

// ---------------------------------------------------------------------------------------
// Exportando os métodos para serem usados nas rotas que criam o front.
module.exports = {

  async registerLead(req, res){ 
    const params = req;
    const result = await getToken()
      .then(token => registerLeadSalesforce(token, params) )
      .catch(err => ({ result: err }) );

    if(result != undefined){
      return { result: result.data }
    }
  }

};