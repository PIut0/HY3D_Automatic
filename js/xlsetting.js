const xlsx = require('xlsx')
const remote = require('electron').remote
const main = remote.require('./main.js')
const fs = require('fs')

var submit_bt = document.getElementById("submit")

let setting = main.setting

document.querySelectorAll("input")[0].value = setting.xlProperty.machine
document.querySelectorAll("input")[1].value = setting.xlProperty.name
document.querySelectorAll("input")[2].value = setting.xlProperty.group
document.querySelectorAll("input")[3].value = setting.xlProperty.item

submit_bt.addEventListener("click",submit_func,false)

function submit_func(){
    setting.xlProperty.machine = document.querySelectorAll("input")[0].value.toUpperCase()
    setting.xlProperty.name = document.querySelectorAll("input")[1].value.toUpperCase()
    setting.xlProperty.group = document.querySelectorAll("input")[2].value.toUpperCase()
    setting.xlProperty.item = document.querySelectorAll("input")[3].value.toUpperCase()

    fs.writeFileSync("setting.json",JSON.stringify(setting))

    remote.getCurrentWindow().close();
}