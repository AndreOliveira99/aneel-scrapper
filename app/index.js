// Esse código realiza a requisição para a API da Aneel e disponibiliza os dados através de um arquivo Json

var axios = require('axios');
var qs = require('qs');
const fs = require('fs');
var path = require('path');

var data = qs.stringify({
    '{"resource_id":"b1bd71e7-d0ad-4214-9053-cbd58e9564a7","q":"","filters":{"DscClasseConsumo":["Comercial"],"SigUF":["MG"]},"limit":22000,"offset":0,"total_estimation_threshold":1000}': ''
}); // configurar "limit" "DscClasseConsumo" e "SigUF" de acordo com o filtro desejado

var config = {
    method: 'post',
    url: 'https://dadosabertos.aneel.gov.br/api/3/action/datastore_search',
    headers: {
        'Accept': '*/*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://dadosabertos.aneel.gov.br',
        'Referer': 'https://dadosabertos.aneel.gov.br/dataset/relacao-de-empreendimentos-de-geracao-distribuida/resource/b1bd71e7-d0ad-4214-9053-cbd58e9564a7/view/36106d44-6cb0-4565-b514-6b74f20b8159?filters=DscClasseConsumo%3AComercial%7CSigUF%3AMG',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    },
    data: data
};

axios(config)
    .then(function (response) {
        var filename = path.join(__dirname, '../json_files/aneel-comerciais-mg.json'); // Configurar o nome do arquivo que receberá os dados
        let dataFile = JSON.stringify(response.data);
        fs.writeFileSync(filename, dataFile, (err) => {
            if (err) throw err
        })
    })
    .catch(function (error) {
        console.log(error);
    });
