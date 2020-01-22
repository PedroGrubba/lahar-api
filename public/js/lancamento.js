/**
 * Javascript da tela de Lançamentos
 */
    function formataValorReal(i) {
        var v = i.value.replace(/\D/g,'');
        v = (v/100).toFixed(2) + '';
        v = v.replace(".", ",");
        v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
        v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
        i.value = v;
    }
    

    /**
     * Campos para atualização do valor total dos boletos
     * -----------------------------------------------------------------------------------
     */
    const valor01 = document.getElementById("valor01");
    valor01.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor02 = document.getElementById("valor02");
    valor02.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor03 = document.getElementById("valor03");
    valor03.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor04 = document.getElementById("valor04");
    valor04.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor05 = document.getElementById("valor05");
    valor05.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });


    const valor06 = document.getElementById("valor06");
    valor06.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor07 = document.getElementById("valor07");
    valor07.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor08 = document.getElementById("valor08");
    valor08.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor09 = document.getElementById("valor09");
    valor09.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });

    const valor10 = document.getElementById("valor10");
    valor10.addEventListener("blur", function(){
        atualizaValorTotalBoleto();
    });


    const valorTotal01 = document.getElementById("valorTotal01");
    valorTotal01.addEventListener("blur", function(){
        atualiza02Parcela();
    });
    


    /**
     * Consulta os dados do Cliente através do CPF
     * -----------------------------------------------------------------------------------
     */
    const btnPesquisarCPF = document.querySelector("#btnPesquisarCPF");
    btnPesquisarCPF.addEventListener("click", event => {
        const inputCPF = document.querySelector("#cpf");
        const valorCPF = inputCPF.value;

        const urlSandbox = "http://localhost:3000/clientes/find/"+valorCPF;
        const urlProducao = "https://portal-parcelei.herokuapp.com/clientes/find/"+valorCPF;
        
        fetch(urlProducao)
            .then( response => {
                return response.json()
                .then( json => {
                    if(json.sucess){
                        atribuirCamposCliente( json.data );
                    } else {
                        limpaCamposCliente();
                        alert(json.message);
                    }
                })
            })
            .catch( err => {
                alert(err.message);
            });

    });

    //Captando o número de parcelas da venda.
    const numParcelas = document.getElementById("parcelas01");
    numParcelas.addEventListener("blur", function(){
        atualiza01Parcela(this.value);

        const nomeOperacao = document.querySelector("#nomeOperacao").value;
        const valorTotaBoletos = parseFloat( document.getElementById("valorTotaBoletos").value.replace('.', '') );
        atualizaParcelaAPI(valorTotaBoletos, this.value, nomeOperacao);
    });

    


    /**
     * Atualizando as parcelas do cartão No 1.
     * @param {*} valor 
     * -----------------------------------------------------------------------------------
     */
    function atualiza01Parcela(numParcelas){
        // Recebendo o valor total dos boletos
        const valorTotaBoletos = parseFloat( document.getElementById("valorTotaBoletos").value.replace('.', '') );
        
        const nomeOperacao = document.querySelector("#nomeOperacao").value;

        //Atualizando o valor das parcelas.
        const valorParcelas = ProcessParcela(valorTotaBoletos, numParcelas, nomeOperacao);

        var valorTotalServico;
        if(numParcelas === 'Débito'){
            valorTotalServico = valorParcelas

        } else {
            valorTotalServico = ( valorParcelas * parseInt( numParcelas) ).toFixed(2);
        }

        document.getElementById("valorParcelas01").value = formatBR(valorParcelas);
        document.getElementById("valorTotalTransacao").value = formatBR(valorTotalServico);

        document.getElementById("valorParcelas02").value = 0;
        document.getElementById("valorTotal02").value = 0;

        document.getElementById("valorTotal01").value = formatBR(valorTotalServico);

    };

    

    /**
     * Atualizando as parcelas do cartão No 2.
     * -----------------------------------------------------------------------------------
     */
    function atualiza02Parcela(){        
        //Atualizando o valor das parcelas.
        const qtdParcelas  = parseInt(document.getElementById("parcelas01").value);
        const valorTotal01 = parseFloat(document.getElementById("valorTotal01").value.replace('.', '').replace(',', '.') );
        const valorTotalTransacao = parseFloat(document.getElementById("valorTotalTransacao").value.replace('.', '').replace(',', '.') );

        if(valorTotal01 > valorTotalTransacao){
            alert('Atenção! O valor total do cartão não pode ultrapassar o valor total da transação');
        }

        let diferenca = ( valorTotalTransacao - valorTotal01 ).toFixed(2);
        let valorParcelasAtualizado01 = ( valorTotal01 / qtdParcelas ).toFixed(2);
        let valorParcelasAtualizado02 = ( diferenca / qtdParcelas ).toFixed(2);
            
        document.getElementById("parcelas02").value = qtdParcelas;
        document.getElementById("valorParcelas01").value = formatBR(valorParcelasAtualizado01);

        document.getElementById("valorParcelas02").value = formatBR(valorParcelasAtualizado02);
        document.getElementById("valorTotal02").value = formatBR(diferenca);

        if(valorTotal01 == valorTotalTransacao){
            document.getElementById("parcelas02").value = null;
        }

    }


    /**
     * Método para aplicar a tabela de serviços no valor da venda.
     * @param {*} Valor 
     * @param {*} Parcela 
     * -----------------------------------------------------------------------------------
     */
    function ProcessParcela(Valor, Parcela, nomeOperacao) {
        let juros = 1;
        const NovoValor = parseFloat( Valor );
        if(Parcela === 'Débito'){

            if(nomeOperacao === 'Difusora'){
                juros = 1.085;
            } else {
                juros = 1.094;
            }

            return (NovoValor * juros).toFixed(2);
        
        } else {
            const ParcelaNovo = parseInt(Parcela);
            if(nomeOperacao === 'Difusora'){
                switch (Parcela) {
                    case '0':
                        juros = 1.085;
                        break;
                    case '1':
                        juros = 1.0952;
                        break;
                    case '2':
                        juros = 1.097;
                        break;
                    case '3':
                        juros = 1.1136;
                        break;
                    case '4':
                        juros = 1.1305;
                        break;
                    case '5':
                        juros = 1.1474;
                        break;
                    case '6':
                        juros = 1.1646;
                        break;
                    case '7':
                        juros = 1.1819;
                        break;
                    case '8':
                        juros = 1.1819;
                        break;
                    case '9':
                        juros = 1.2045;
                        break;
                    case '10':
                        juros = 1.2227;
                        break;
                    case '11':
                        juros = 1.2538;
                        break;
                    case '12':
                        juros = 1.3014;
                        break;
                }
            } else {
                switch (Parcela) {
                    case '0':
                        juros = 1.094;
                        break;
                    case '1':
                        juros = 1.154;
                        break;
                    case '2':
                        juros = 1.17;
                        break;
                    case '3':
                        juros = 1.187;
                        break;
                    case '4':
                        juros = 1.203;
                        break;
                    case '5':
                        juros = 1.22;
                        break;
                    case '6':
                        juros = 1.236;
                        break;
                    case '7':
                        juros = 1.25;
                        break;
                    case '8':
                        juros = 1.266;
                        break;
                    case '9':
                        juros = 1.281;
                        break;
                    case '10':
                        juros = 1.295;
                        break;
                    case '11':
                        juros = 1.31;
                        break;
                    case '12':
                        juros = 1.324;
                        break;
                }
            }

            return ((NovoValor * juros) / (ParcelaNovo === 0 ? 1 : ParcelaNovo)).toFixed(2);
        }
    };

    function atualizaParcelaAPI(Valor, Parcela, nomeOperacao){
        const valorTotal = parseFloat( Valor );

        const jsonData = {
            valorTotal: valorTotal,
            parcelas: Parcela,
            operacao: nomeOperacao
        }

        // USAR ESTE AQUI PARA PEGAR OS DADOS DA PARCELA
        //const dataForm = new FormData(document.querySelector("#formSimulacao"));

        const urlSandbox = "http://localhost:3000/parceleiapi/calcularParcelas";

        fetch(urlSandbox, {
            method: "POST",
            body: jsonData
        })
        .then(res =>{
            return res.json()
            .then(data => {
                console.log('Data: ' + data);
            })
        })
        .catch(err => {
            console.warn('ERRO: ' + err);;
        })

    };

    /**
     * Método para atualizar o valor total dos boletos com a captação dos valores dos campos
     * de valor
     * -----------------------------------------------------------------------------------
     */
    function atualizaValorTotalBoleto(){
        const valor01 = parseFloat( document.getElementById("valor01").value.replace('.', '').replace(',', '.') );
        const valor02 = parseFloat( document.getElementById("valor02").value.replace('.', '').replace(',', '.')  );
        const valor03 = parseFloat( document.getElementById("valor03").value.replace('.', '').replace(',', '.')  );
        const valor04 = parseFloat( document.getElementById("valor04").value.replace('.', '').replace(',', '.')  );
        const valor05 = parseFloat( document.getElementById("valor05").value.replace('.', '').replace(',', '.')  );
        const valor06 = parseFloat( document.getElementById("valor06").value.replace('.', '').replace(',', '.')  );
        const valor07 = parseFloat( document.getElementById("valor07").value.replace('.', '').replace(',', '.')  );
        const valor08 = parseFloat( document.getElementById("valor08").value.replace('.', '').replace(',', '.')  );
        const valor09 = parseFloat( document.getElementById("valor09").value.replace('.', '').replace(',', '.')  );
        const valor10 = parseFloat( document.getElementById("valor10").value.replace('.', '').replace(',', '.')  );
        
        const valorTotal = ( valor01 + valor02 + valor03 + valor04 + valor05 + 
                                valor06 + valor07 + valor08 + valor09 + valor10 ).toFixed(2);

        const valorFormatado = formatBR(valorTotal);
        document.getElementById("valorTotaBoletos").value = valorFormatado;
    }


    /**
     * Atualizacão dos dados do cliente vindos da API de consulta CPF
     * @param {*} data 
     * -----------------------------------------------------------------------------------
     */
    function atribuirCamposCliente( data ){
        const nome           = document.querySelector("#nome");
        const dataNascimento = document.querySelector("#nascimento");
        const sexo           = document.querySelector("#sexo");
        const email          = document.querySelector("#email");
        const celular        = document.querySelector("#celular");

        nome.value    = data.nome;
        nome.setAttribute('readonly', true);

        dataNascimento.value = data.dataNascimento.substring(0, 10);
        dataNascimento.setAttribute('readonly', true);

        sexo.value    = data.sexo;
        sexo.setAttribute('readonly', true);

        email.value   = data.email;
        celular.value = data.celular;

    }


    /**
     * Limpar dados do clinte quando não identificar o CPF na API
     * -----------------------------------------------------------------------------------
     */
    function limpaCamposCliente(){
        const nome           = document.querySelector("#nome");
        const dataNascimento = document.querySelector("#nascimento");
        const sexo           = document.querySelector("#sexo");
        const email          = document.querySelector("#email");
        const celular        = document.querySelector("#celular");

        nome.value    = null;
        nome.removeAttribute('readonly');

        dataNascimento.value = null;
        dataNascimento.removeAttribute('readonly');

        sexo.value    = null;
        sexo.removeAttribute('readonly');

        email.value   = null;
        celular.value = null;

    }

    
    /**
     * Método para formatar o valor em real
     * @param {*} valor 
     * -----------------------------------------------------------------------------------
     */
    function formatBR(valor) {
        valor = valor.toString().replace(/\D/g,"");
        valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
        valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
        valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");
        return valor                    
    }