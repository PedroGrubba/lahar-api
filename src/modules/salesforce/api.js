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
async function getPartnerResult(token) {
  return await axios.get(
    "https://parcelei.my.salesforce.com/services/apexrest/api/lancamentos/", {
    //"https://parcelei--sandbox.my.salesforce.com/services/apexrest/api/lancamentos/", {
      headers: {
        Authorization: "Bearer " + token
      }
    }
  );
}

// ---------------------------------------------------------------------------------------
// Método para conectar a API de lista de resultado.
async function registerLancamentoSalesforce(token, params) {

  const body = params;

  const options = {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token
    },
    data: body,
    url: "https://parcelei.my.salesforce.com/services/apexrest/api/lancamentos/"
    //url: "https://parcelei--sandbox.my.salesforce.com/services/apexrest/api/lancamentos/"
  };

  return await axios(options)
    .then( res => { return res })
    .catch(err => { console.warn(err);
    });
}


// ---------------------------------------------------------------------------------------
// Método para conectar a API de lista de resultado.
async function registerLeadSalesforce(token, params) {

  const body = params;

  const options = {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: body,
    url: "https://parcelei.my.salesforce.com/services/apexrest/api/leads/"
    //url: "https://parcelei--sandbox.my.salesforce.com/services/apexrest/api/leads/"
  };

  return await axios(options)
    .then( res => { return res })
    .catch(err => { console.warn(err);
    });
}

// ---------------------------------------------------------------------------------------
// Exportando os métodos para serem usados nas rotas que criam o front.
module.exports = {

  async listResult(req, res) {
      const result = await getToken()
          .then(token => getPartnerResult(token))
          .catch(err => res.send( { err } ));
      
      return result.data;
  }, 

  async registerLancamento(req, res){ 
    const params = req;
    const result = await getToken()
      .then(token => registerLancamentoSalesforce(token, params) )
      .catch(err => ({ result: err }) );

    if(result != undefined){
      return { result: result.data }
    }
  }, 

  async registerLead(req, res){ 
    const params = req;
    
    const result = await getToken()
      .then(token => registerLeadSalesforce(token, params) )
      .catch(err => ({ result: err }) );

    if(result != undefined){
      console.log('Sucesso no envio das informações ao Salesforce!');
      return { result: result.data }
    }
  }

};