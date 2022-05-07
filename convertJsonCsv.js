const { promises: fs } = require('fs')

const createCsvWriter = require('csv-writer').createObjectCsvWriter

async function writeCsv(leadPage, pageNumber) {

    const csvWriter = createCsvWriter({
        path: `./csv_files/leads-aneel-${pageNumber}.csv`,
        header: [
            'SigUF',
            'NomMunicipio',
            'CodCEP',
            'NumCPFCNPJ',
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

    const file_data = await fs.readFile('aneel-comerciais-mg.json')
    const parsed_data = JSON.parse(file_data)
    const leads_data = parsed_data.result.records
    const page_limit = 1000
    let counter = 0

    for (i = 0; i < leads_data.length / page_limit; i++) {
        let leadPage = leads_data.slice(counter, counter + page_limit)
        counter += page_limit 
        writeCsv(leadPage, i)
    }
}

main()