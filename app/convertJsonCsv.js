// Esse código transforma um arquivo Json em Csv
// Instalar bibliotecas csv-writer e filesystem 
const { promises: fs } = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

async function writeCsv(leadPage) {

    const csvWriter = createCsvWriter({
        path: `../csv_files/leads-aneel-cnpj-lista-final-v2.csv`, /* Essa string 
        define o caminho e nome do arquivo csv que será criado*/
        header: [ /* Esses headers definem quais arrays do Json você deseja
        transpor para o csv. Cada string é uma chave do Json */
            'SigUF',
            'NomMunicipio',
            'CodCEP',
            'NumCPFCNPJ',
            'NomeTitularEmpreendimento',
            'DthAtualizaCadastralEmpreend',
            'DscPorte',
            'MdaPotenciaInstaladaKW',
            'NumCoordNEmpreendimento',
            'NumCoordEEmpreendimento',
            'Situacao',
            'Email',
            'Capital',
            'Telefone',
            'Cep'
        ].map((item) => ({ id: item, title: item }))
    })

    try {
        await csvWriter.writeRecords(leadPage)
    }
    catch (error) {
        console.log(error)
    }
}

async function main() {

    const file_data = await fs.readFile('../json_files/teste-sincronismo.json') /* Esse 
    é o caminho do arquivo Json que deve ser tranformado em CSV */
    let parsed_data = JSON.parse(file_data)
    const leads_data = parsed_data
    
    writeCsv(leads_data)  
}

main()