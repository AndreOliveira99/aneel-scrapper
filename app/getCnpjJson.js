var axios = require('axios');
const fs = require('fs');
var path = require('path');

const dataInput = require('../json_files/aneel-comerciais-mg.json')
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

var filename = path.join(__dirname, '../json_files/leads-Comerciais-MG-Cnpj-Only.json');
let dataFile = JSON.stringify(cnpjCompaniesArray);
fs.writeFileSync(filename, dataFile, (err) => {
    if (err) throw err
})