const fs = require('fs')

$(document).ready(function (){
    var more_toggle = $(".more_info");
    var more_info_table = $(".more_info_table");
    more_toggle.on("click", function(){
        more_info_table.toggle();
    })
})

// String.prototype.replaceAll = function(org,dest){
//     return this.split(org).join(dest);
// }


// var dom_xlPath = document.getElementById("xlPath");
// // var dom_pdfPath = document.getElementById("pdfPath");
// // var dom_savePath = document.getElementById("savePath");
// dom_xlPath.addEventListener("change", xlPath_setting, false);
// // dom_pdfPath.addEventListener("change", pdfPath_setting, false);
// // dom_savePath.addEventListener("change", savePath_setting, false);

// function xlPath_setting(){
//     const xlfile = this.files[0];
//     let dataBuffer = xlfile.path;
//     dataBuffer = dataBuffer.replaceAll('\\','/');

//     let setting = JSON.parse(fs.readFileSync("setting.json",'utf8'))
//     // console.log(setting)
//     setting.xlPath = dataBuffer
//     fs.writeFileSync("setting.json",JSON.stringify(setting))
//     // console.log(setting)
// }

// function pdfPath_setting(){
//     const pdfFile = this.files[0];
//     let dataBuffer = pdfFile.path;
//     dataBuffer = dataBuffer.replaceAll('\\','/');
//     dataBuffer = dataBuffer.split("/");
//     dataBuffer.splice(dataBuffer.length-1,1);
//     dataBuffer = dataBuffer.join("/")+"/"

//     let setting = JSON.parse(fs.readFileSync("setting.json",'utf8'))
//     // console.log(setting)
//     setting.pdfPath = dataBuffer
//     fs.writeFileSync("setting.json",JSON.stringify(setting))
//     // console.log(setting)
// }


// function savePath_setting(){
//     const saveDir = this.files[0];
//     let dataBuffer = saveDir.path;
//     console.log(dataBuffer)
//     dataBuffer = dataBuffer.replaceAll('\\','/');
//     dataBuffer = dataBuffer.split("/");
//     dataBuffer.splice(dataBuffer.length-1,1);
//     dataBuffer = dataBuffer.join("/")+"/"

//     let setting = JSON.parse(fs.readFileSync("setting.json",'utf8'))
//     // console.log(setting)
//     setting.savePath = dataBuffer
//     fs.writeFileSync("setting.json",JSON.stringify(setting))
//     // console.log(setting)
// }