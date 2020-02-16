const xlread = require("./js/xlRead")
const pdfread = require("./js/pdfRead")
const remote = require('electron').remote
// const fs = require('fs')
const main = remote.require('./main.js')

var submit_bt = document.getElementById("submit")

submit_bt.addEventListener("click",submit_func,false)


async function submit_func(){
    let modeling = document.getElementById("modeling").value
    let modeling_res = document.getElementById("modeling_res").value
    let modeling_date = document.getElementById("modeling_date").value
    let modeling_price = document.getElementById("modeling_price").value
    let painting = document.getElementById("painting").value
    let painting_num = document.getElementById("painting_num").value
    let painting_price = document.getElementById("painting_price").value

    let est_time = document.getElementById("time").value
    let xlresult = await xlread.result_func()
    let part_weight = pdfread.part_weight;
    let part_name = pdfread.part_name;
    let req_date = document.getElementById("req_date").value
    let property = document.getElementById("property").value
    let xl_num = document.getElementById("excel_no").value
    // console.log(property)
    let delivery_price = document.getElementById("delivery_price").value
    let delivery_num = document.getElementById("delivery_num").value
    let part_num = []
    for(var i=0;i<part_weight.length;i++){
        part_num.push(parseInt(document.getElementById(`part_${i}`).value))
    }
    
    let file_name;
    var today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth()+1
    var date = today.getDate()

    month = month + ""
    date = date + ""
    if(month.length == 1)   month = "0"+month
    if(date.length == 1)   date = "0"+date
    file_name = `${year}${month}${date}_${xlresult[3]}_${xlresult[2]}`
    
    if(est_time == "")   est_time = 0
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
    result["delivery_num"] = parseInt(delivery_num)
    result["property"] = property
    result["part_weight"] = part_weight
    result["part_name"] = part_name
    result["part_num"] = part_num
    result["xlresult"] = xlresult
    result["modeling"] = modeling
    result["modeling_res"] = modeling_res
    result["modeling_date"] = modeling_date
    result["modeling_price"] = modeling_price
    result["painting"] = painting
    result["painting_num"] = painting_num
    result["painting_price"] = painting_price
    result["xl_num"] = xl_num
    console.log(result)
    main.submit(result)
    alert("작성 완료")
}