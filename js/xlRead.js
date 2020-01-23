// const remote = require('electron').remote
// const fs = require('fs')
const xlsx = require('xlsx')

let xlfile = xlsx.readFile('./견적서 예시.xlsm')
let sheet_name = xlfile.SheetNames[0]
let work_sheet = xlfile.Sheets[sheet_name]

var submit_bt = document.getElementById("submit")
submit_bt.addEventListener("click",submit_func,false)

function submit_func(){

    var id = document.getElementById("excel_no")
    id = id.value*1
    id += 1
    console.log(id)
    
    let x_machine = work_sheet['L'+String(id)].v
    let x_name = work_sheet['P'+String(id)].v
    let x_group = work_sheet['O'+String(id)].v
    let x_item = work_sheet['T'+String(id)].v
    // let data = work_sheet['L3']
    let data = x_machine + " " + x_name + " " + x_group
    console.log(data)
    fs.writeFileSync("./xlsx",JSON.stringify(data,null,2))
}
