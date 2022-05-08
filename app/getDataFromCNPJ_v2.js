var axios = require('axios');
const fs = require('fs');
var path = require('path');

const dataInput = require('../json_files/leads-Comerciais-MG-Cnpj-Only.json')

let cnpjArray = []
let companyNameArray = []


function adaptCompanyName(companyName) {
    let newCompanyName = companyName.toString().toLowerCase()
    newCompanyName = newCompanyName.replace(/ /g, "-")
    return newCompanyName
}

function getCompanyNameAndArray() {
    for (let i = 0; i < dataInput.length; i++) {
        cnpjArray.push(dataInput[i].NumCPFCNPJ)
        let companyName = dataInput[i].NomeTitularEmpreendimento
        companyName = adaptCompanyName(companyName)
        companyNameArray.push(companyName)
    }
}

getCompanyNameAndArray()

function verifyStringLength(string) {
    if (string.length < 25) {
        return true
    }
    else {
        return false
    }
}

function isCompanyActive(htmlString) {
    let htmlStringSituation = htmlString.slice(htmlString.indexOf('<li>Situação:') + 13, htmlString.indexOf('Natureza'))
    let companySituation = htmlStringSituation.slice(htmlStringSituation.indexOf('<strong>') + 8, htmlStringSituation.indexOf('</strong>'))
    console.log(companySituation)
    if (verifyStringLength) {
        return companySituation
    }
    else {
        return 'não definido'
    }
}

function getCompanyEmail(htmlString) {
    let htmlStringEmail = htmlString.slice(htmlString.indexOf('<li>E-mail:') + 11, htmlString.indexOf('<strong>Quadro'))
    let companyEmail = htmlStringEmail.slice(htmlStringEmail.indexOf('<strong>') + 8, htmlStringEmail.indexOf('</strong>'))
    console.log(companyEmail)
    if (verifyStringLength) {
        return companyEmail
    }
    else {
        return 'não definido'
    }
}

function getCompanyCapital(htmlString) {
    let htmlStringCapital = htmlString.slice(htmlString.indexOf('<li>Capital Social:') + 19, htmlString.indexOf('data-slot="4"'))
    let companyCapital = htmlStringCapital.slice(htmlStringCapital.indexOf('<strong>') + 8, htmlStringCapital.indexOf('</strong></li>'))
    console.log(companyCapital)
    if (verifyStringLength) {
        return companyCapital
    }
    else {
        return 'não definido'
    }
}

function getCompanyPhone(htmlString) { // Algumas empresas podem ter mais de um telefone, avaliar isso.
    let htmlStringPhone = htmlString.slice(htmlString.indexOf('<li>Telefone:') + 13, htmlString.indexOf('<li>E-mail:'))
    let companyPhone = htmlStringPhone.slice(htmlStringPhone.indexOf('<strong>') + 8, htmlStringPhone.indexOf('</strong>'))
    console.log(companyPhone)
    if (verifyStringLength) {
        return companyPhone
    }
    else {
        return 'não definido'
    }
}

function getCompanyAddress(htmlString) {
    let htmlStringAddress = htmlString.slice(htmlString.indexOf('<li>CEP:') + 8, htmlString.indexOf('<li>Logradouro:'))
    let companyAddress = htmlStringAddress.slice(htmlStringAddress.indexOf('<strong>') + 8, htmlStringAddress.indexOf('</strong>'))
    console.log(companyAddress)
    if (verifyStringLength) {
        return companyAddress
    }
    else {
        return 'não definido'
    }
}


function getCompanyDataOutput(htmlString) {
    let companyDataOutput = {}
    companyDataOutput.Situacao = isCompanyActive(htmlString)
    companyDataOutput.Email = getCompanyEmail(htmlString)
    companyDataOutput.Capital = getCompanyCapital(htmlString)
    companyDataOutput.Telefone = getCompanyPhone(htmlString)
    companyDataOutput.Cep = getCompanyAddress(htmlString)
    return companyDataOutput
}

makeRequest = async (cnpj, companyName) => {
    console.log(`https://cnpjs.rocks/cnpj/${cnpj}/${companyName}.html`)
    var config = {
        method: 'get',
        url: `https://cnpjs.rocks/cnpj/${cnpj}/${companyName}.html`,
        headers: {
            'authority': 'cnpjs.rocks',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'cache-control': 'max-age=0',
            'cookie': 'PHPSESSID=qslehlv977f1vdrhqum0eq5u91; _ga=GA1.2.1683108282.1651877434; _gid=GA1.2.1030094482.1651877434; _ga_70F5D0CW71=GS1.1.1651877433.1.0.1651877826.0',
            'referer': 'https://www.google.com/',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
        }
    }

    let companyDataOutput = await axios(config)
        .then(function (response) {
            console.log(`request at ${new Date().toUTCString()}`)
            return getCompanyDataOutput(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
    return companyDataOutput
}

async function getFinalList(cnpjArray, companyNameArray) {
    let companyList = []
    for (i = 0; i < 2; i++) { // i deve ser menor que cnpjArray.length para pegar todos os dados
        if (i % 1 == 0) { // É possível mudar a quantidade de requisições em paralelo mudando o número 1 para o número de operações paralelas desejadas. 
            await new Promise(resolve => setTimeout(resolve, 500)) // Spleep artifical pra esperar 5 segundos entre as requisições.
            companyList[i] = await makeRequest(cnpjArray[i], companyNameArray[i])
            companyList[i].Url = `https://cnpjs.rocks/cnpj/${cnpjArray[i]}/${companyNameArray[i]}.html`
        }
        else {
            companyList[i] = await makeRequest(cnpjArray[i], companyNameArray[i])
            companyList[i].Url = `https://cnpjs.rocks/cnpj/${cnpjArray[i]}/${companyNameArray[i]}.html`
        }
        console.log(i)
    }
    return companyList
}

getFinalList(cnpjArray, companyNameArray)
    .then(companyList => {
        var filename = path.join(__dirname, '../json_files/leads-Comerciais-MG-Cnpj-com-email.json');
        let dataFile = JSON.stringify(companyList);
        fs.writeFileSync(filename, dataFile, (err) => {
            if (err) throw err
        })
    })