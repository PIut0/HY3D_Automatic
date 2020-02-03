// const remote = require('electron').remote
// const fs = require('fs')
const xlsx = require('xlsx')
const remote = require('electron').remote
const main = remote.require('./main.js')

let xlPath = main.setting.xlPath
let xlfile = xlsx.readFile(xlPath)
let sheet_name = xlfile.SheetNames[0]
let work_sheet = xlfile.Sheets[sheet_name]

exports.result_func = function(){
    // console.log("TEST")
    var id = document.getElementById("excel_no")
    id = id.value*1
    id += 1
    // console.log(id)
    
    let result = []
    let x_machine = work_sheet['L'+String(id)].v
    let x_name = work_sheet['P'+String(id)].v
    let x_group = work_sheet['O'+String(id)].v
    let x_item = work_sheet['T'+String(id)].v
    // let data = work_sheet['L3']
    result.push(x_machine)
    result.push(x_name)
    result.push(x_group)
    result.push(x_item)
    // console.log(result);
    return result
    // let data = x_machine + " " + x_name + " " + x_group
    // console.log(data)
    // fs.writeFileSync("./xlsx",JSON.stringify(data,null,2))


    // return new Promise(function(resolve, reject){
    //     var id = document.getElementById("excel_no")
    //     id = id.value*1
    //     id += 1
    //     console.log(id)
        
    //     let result = []
    //     let x_machine = work_sheet['L'+String(id)].v
    //     let x_name = work_sheet['P'+String(id)].v
    //     let x_group = work_sheet['O'+String(id)].v
    //     let x_item = work_sheet['T'+String(id)].v
    //     // let data = work_sheet['L3']
    //     result.push(x_machine)
    //     result.push(x_name)
    //     result.push(x_group)
    //     result.push(x_item)
    //     console.log(result);
    //     resolve(result);
    // });
}

