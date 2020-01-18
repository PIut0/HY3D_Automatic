const remote = require('electron').remote
const fs = require('fs')
const main = remote.require('./main.js')

String.prototype.replaceAll = function(org,dest){
    return this.split(org).join(dest);
}

var inputElement = document.getElementById("pdfFile");
inputElement.addEventListener("change", handleFiles, false);

async function handleFiles(file) {
    let remove_table = document.querySelectorAll('.part_content tr');
    for(var i=1;i<remove_table.length;i++){
      console.log(remove_table[i]);
      remove_table[i].remove();
    }

    const pdfFile = this.files[0];
    document.getElementById('upload-name-id').value = pdfFile.name;

    let dataBuffer = pdfFile.path;
    dataBuffer = dataBuffer.replaceAll('\\','/');

    var data = await main.pdfParsing(dataBuffer);
    console.log(pdfFile.name);
    for(var i=0;i<data.length;i+=2){
      let addPart = document.createElement("tr");
      let partname = document.createElement("td");
      let count = document.createElement("td");
      let input = document.createElement("input");

      input.id = `part_${i}`
      partname.appendChild(document.createTextNode(data[i]));
      count.appendChild(input);
      addPart.appendChild(partname);
      addPart.appendChild(count);

      document.getElementById("part_content").appendChild(addPart);
    }
}