// Esse código filtra os items que possuem CNPJ, daqueles que possuem apenas CPF

var axios = require('axios');
const fs = require('fs');
var path = require('path');

const dataInput = require('../json_files/aneel-comerciais-mg.json') // Configurar o caminho para o json a ser filtrado
const dataInputCompaniesArray = dataInput.result.records

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

getCnpjList(dataInputCompaniesArray)

var filename = path.join(__dirname, '../json_files/leads-Comerciais-MG-Cnpj-Only.json'); // Configurar o nome do arquivo que receberá os dados
let dataFile = JSON.stringify(cnpjCompaniesArray);
fs.writeFileSync(filename, dataFile, (err) => {
    if (err) throw err
})