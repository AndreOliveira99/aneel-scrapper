var axios = require('axios');
const fs = require('fs');
var path = require('path');

const dataInput = require('../json_files/aneel-comerciais-mg.json')
const dataInputCompaniesArray = dataInput.result.records

let cnpjArray = []
let cnpjCompaniesArray = []
let cpfCompaniesArray = []

function getCnpjList(dataInputCompaniesArray) {
    for (let i = 0; i < dataInputCompaniesArray.length; i++) {
        companyObj = dataInputCompaniesArray[i]
        if (isCpf(companyObj.NumCPFCNPJ)) {
            cpfCompaniesArray.push(companyObj)
        }
        else {
            cnpjCompaniesArray.push(companyObj)
            cnpjArray.push(companyObj.NumCPFCNPJ)
        }
    }
}

function isCpf(numberString) {
    if (numberString[0] == '*') {
        return true
    }
    else {
        return false
    }
}

function isCompanyActive(htmlString) {
    let htmlStringSituation = htmlString.slice(htmlString.indexOf('<p>Situação') + 12, htmlString.indexOf('<p>Data Situação Cadastral:'))
    let companySituation = htmlStringSituation.slice(htmlStringSituation.indexOf('>') + 1, htmlStringSituation.indexOf('</b>'))
    console.log(companySituation)
    if (verifyStringLength) {
        return companySituation
    }
    else {
        return 'não definido'
    }
}

getCnpjList(dataInputCompaniesArray)

/*
function getCompanyEmail(htmlString) { // O site apresenta uma forma de proteger esse dado. Avaliar uso do pupeteer
    let htmlStringEmail = htmlString.slice(htmlString.indexOf('<p>Situação') + 12, htmlString.indexOf('<p>Data Situação Cadastral:'))
    let companyEmail = htmlStringEmail.slice(htmlStringEmail.indexOf('>') + 1, htmlStringEmail.indexOf('</b>'))
    console.log(companyEmail)
    return companyEmail
}
*/

function verifyStringLength(string) {
    if (string.length < 25) {
        return true
    }
    else {
        return false
    }
}

function getCompanyCapital(htmlString) {
    let htmlStringCapital = htmlString.slice(htmlString.indexOf('<p>Capital') + 10, htmlString.indexOf('<p>Tipo'))
    let companyCapital = htmlStringCapital.slice(htmlStringCapital.indexOf('"copy">R$') + 10, htmlStringCapital.indexOf('</b>'))
    console.log(companyCapital)
    if (verifyStringLength) {
        return companyCapital
    }
    else {
        return 'não definido'
    }
}

function getCompanyPhone(htmlString) { // Algumas empresas podem ter mais de um telefone, avaliar isso.
    let htmlStringPhone = htmlString.slice(htmlString.indexOf('<p>Telefone') + 12, htmlString.indexOf('<h2>Localiza'))
    let companyPhone = htmlStringPhone.slice(htmlStringPhone.indexOf('href="tel:') + 11, htmlStringPhone.indexOf('> (Ligar)'))
    console.log(companyPhone)
    if (verifyStringLength) {
        return companyPhone
    }
    else {
        return 'não definido'
    }
}

function getCompanyAddress(htmlString) {
    let htmlStringAddress = htmlString.slice(htmlString.indexOf('<p>CEP:') + 8, htmlString.indexOf('<p>Munic'))
    let companyAddress = htmlStringAddress.slice(htmlStringAddress.indexOf('"copy">') + 8, htmlStringAddress.indexOf('</b>'))
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
    //companyDataOutput.Email = getCompanyEmail(htmlString)
    companyDataOutput.Capital = getCompanyCapital(htmlString)
    companyDataOutput.Telefone = getCompanyPhone(htmlString)
    companyDataOutput.Cep = getCompanyAddress(htmlString)
    return companyDataOutput
}

makeRequest = async (cnpj) => {
    var config = {
        method: 'get',
        url: `http://api.scraperapi.com?api_key=eadcafd66d6e5858bf3b6a2700e0e1d6&url=https://cnpj.biz/${cnpj}`,
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

async function getFinalList(cnpjArray) {
    let companyList = []
    for (i = 0; i < 5; i++) { // i deve ser menor que cnpjArray.length para pegar todos os dados
        if (i % 1 == 0) { // É possível mudar a quantidade de requisições em paralelo mudando o número 1 para o número de operações paralelas desejadas. 
            await new Promise(resolve => setTimeout(resolve, 500)) // Spleep artifical pra esperar 5 segundos entre as requisições.
            companyList[i] = await makeRequest(cnpjArray[i])
            companyList[i].Url = `https://cnpj.biz/${cnpjArray[i]}`
        }
        else {
            companyList[i] = await makeRequest(cnpjArray[i])
            companyList[i].Url = `https://cnpj.biz/${cnpjArray[i]}`
        }
        console.log(i)
    }
    return companyList
}

getFinalList(cnpjArray)
    .then(companyList => {
        var filename = path.join(__dirname, '../json_files/leads-Comerciais-MG-Cnpj.json');
        let dataFile = JSON.stringify(companyList);
        fs.writeFileSync(filename, dataFile, (err) => {
            if (err) throw err
        })
    })