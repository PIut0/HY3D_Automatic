const xlread = require("./js/xlRead")
const pdfread = require("./js/pdfRead")
const remote = require('electron').remote
// const fs = require('fs')
const main = remote.require('./main.js')

var submit_bt = document.getElementById("submit")

submit_bt.addEventListener("click",submit_func,false)


async function submit_func(){
    let est_time = document.getElementById("time").value
    //console.log(est_time)
    let xlresult = await xlread.result_func()
    let part_weight = pdfread.part_weight;
    let part_name = pdfread.part_name;
    let file_name = pdfread.file_name;
    let req_date = document.getElementById("req_date").value
    let delivery_price = document.getElementById("delivery_price").value
    let part_num = []
    for(var i=0;i<part_weight.length;i++){
        part_num.push(parseInt(document.getElementById(`part_${i}`).value))
    }
    //console.log(file_name)

    if(est_time == "")   est_time = 0
    if(file_name == undefined)  file_name = "file_name"
    // //console.log(result)
    //console.log("result")
    //console.log(xlresult)
    //console.log(part_weight)
    //console.log(part_num)

    let result = new Object
    result["est_time"] = parseInt(est_time)
    result["file_name"] = file_name
    result["req_date"] = parseInt(req_date)
    result["delivery_price"] = parseInt(delivery_price)
    result["part_weight"] = part_weight
    result["part_name"] = part_name
    result["part_num"] = part_num
    result["xlresult"] = xlresult
    //console.log(result)
    main.submit(result)
}