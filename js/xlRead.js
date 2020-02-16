// const remote = require('electron').remote
// const fs = require('fs')
const xlsx = require('xlsx')
const remote = require('electron').remote
const main = remote.require('./main.js')


exports.result_func = function(){
    let xlPath = main.setting.xlPath
    let xlProperty = main.setting.xlProperty
    let xlfile = xlsx.readFile(xlPath)
    let sheet_name = "의뢰관리"
    let work_sheet = xlfile.Sheets[sheet_name]
    // console.log(work_sheet)

    // console.log("TEST")
    var id = document.getElementById("excel_no")
    id = id.value*1
    id += 1
    // console.log(id)
    
    let result = []
    let x_machine
    let x_name
    let x_group
    let x_item
    try {
        x_machine = work_sheet[xlProperty.machine+String(id)].v
    } catch (error) {
        x_machine = "error"
    }
    try {
        x_name = work_sheet[xlProperty.name+String(id)].v
    } catch (error) {
        x_name = "이름"
    }
    try {
        x_group = work_sheet[xlProperty.group+String(id)].v
    } catch (error) {
        x_group = "기업명"
    }
    try {
        x_item = work_sheet[xlProperty.item+String(id)].v
    } catch (error) {
        x_item = "아이템"
    }
    if(x_group == "개인" || x_group == "기업명")    x_group = x_name
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

