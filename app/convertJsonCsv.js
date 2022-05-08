// Instalar bibliotecas csv-writer e filesystem 
const { promises: fs } = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

async function writeCsv(leadPage, pageNumber) {

    const csvWriter = createCsvWriter({
        path: `../csv_files/leads-aneel-cnpj-${pageNumber}.csv`, /* Essa string 
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
            'NumCoordEEmpreendimento'
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

    const file_data = await fs.readFile('../json_files/leads-Comerciais-MG-Cnpj-Only.json') /* Esse 
    é o caminho do arquivo Json que deve ser tranformado em CSV */
    const parsed_data = JSON.parse(file_data)
    const leads_data = parsed_data
    const page_limit = 1000
    let counter = 0
    /* O trecho de código a seguir corta o Json a partir do "page_limit" configurado e escreve as
    páginas csv de acordo com o limite de linhas configurado, no caso a seguir 1000 linhas p/ página*/
    for (i = 0; i < leads_data.length / page_limit; i++) {
        let leadPage = leads_data.slice(counter, counter + page_limit)
        counter += page_limit 
        writeCsv(leadPage, i)
    }
}

main()