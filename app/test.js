function adaptCompanyName (companyName) {
    companyName = companyName.toString().toLowerCase()
    console.log(companyName)
    companyName = companyName.replace(/ /g,"-")
    return companyName
}

console.log(adaptCompanyName ('AAAA SDSA ASAA'))