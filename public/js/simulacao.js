/**
 * Javascript da tela de Lançamentos
 */

 const btnFazerSimulacao = document.querySelector("#fazerSimulacao");
 btnFazerSimulacao.addEventListener("click", event => {

    const inputValorDivida   = document.querySelector("#valorTotaBoletosSimulacao");
    const inputParcelas      = document.querySelector("#parcelasSimulacao");
    const inputValorParcelas = document.querySelector("#valorParcelasSimulacao");
    const btnRealizarOperacao = document.querySelector("#realizarOperacao");
    const nomeOperacao       = document.querySelector("#nomeOperacao").value;
    
    //event.preventDefault();
    const dataForm = new FormData(document.querySelector("#formSimulacao"));

        const urlSandbox = "http://localhost:3000/clientes/registerLead";
        const urlProducao = "https://portal-parcelei.herokuapp.com/clientes/registerLead";

        fetch(urlProducao, {
                method: "POST",
                body: dataForm
            })
            .then(res => { 
                return res.json()
                .then(data => { 
                    const valorTotaBoletos = parseFloat( inputValorDivida.value.replace('.', '').replace(',', '.'));
                    const valorParcelas = ProcessParcela(valorTotaBoletos, inputParcelas.value, nomeOperacao);

                    const result = formatBR(valorParcelas);
                    inputValorParcelas.value = formatBR(valorParcelas);
                    console.log('Data do JS simulacao: ' + data);
                    alert('O resultado da simução é ' + inputParcelas.value + ' parcela(s) de R$ ' + result);
                    btnRealizarOperacao.removeAttribute('disabled');
                })
            })
            .catch(err => {
                alert(JSON.stringify('Ocorreu um erro: ' + err ));
            });

 })


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

// var allNextBtn = $('.nextBtn');
// allNextBtn.click(function(){
// var conteudo = document.getElementById('div-impressao').innerHTML,
// tela_impressao = window.open('about:blank');

// tela_impressao.document.write(conteudo);
// tela_impressao.window.print();
// tela_impressao.window.close();
// });


function formatBR(valor) {
    valor = valor.toString().replace(/\D/g,"");
    valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");
    return valor                    
}

function formataValorReal(i) {
    var v = i.value.replace(/\D/g,'');
    v = (v/100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    i.value = v;
}