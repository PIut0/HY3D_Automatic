const fs = require('fs')

$(document).ready(function (){
    var more_toggle = $(".more_info");
    var more_info_table = $(".more_info_table");
    more_toggle.on("click", function(){
        more_info_table.toggle();
    })
})

var dom_xlPath = document.getElementById("xlPath");
dom_xlPath.addEventListener("change", xlPath_setting, false);

function xlPath_setting(){
    const xlfile = this.files[0];
    let dataBuffer = xlfile.path;
    dataBuffer = dataBuffer.replaceAll('\\','/');

    let setting = JSON.parse(fs.readFileSync("setting.json",'utf8'))
    // console.log(setting)
    setting.xlPath = dataBuffer
    fs.writeFileSync("setting.json",JSON.stringify(setting))
    // console.log(setting)
}
