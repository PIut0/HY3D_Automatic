const remote = require('electron').remote
const fs = require('fs')
const main = remote.require('./main.js')

String.prototype.replaceAll = function(org,dest){
    return this.split(org).join(dest);
}

var inputElement = document.getElementById("pdfFile");
inputElement.addEventListener("change", handleFiles, false);

let part_weight = []
let part_name = []
let file_name = ""
exports.part_weight = part_weight;
exports.part_name = part_name;

async function handleFiles(file) {
	// console.log("handle File")
    let remove_table = document.querySelectorAll('.part_content tr');
    for(var i=1;i<remove_table.length;i++){
		// console.log(remove_table[i]);
		remove_table[i].remove();
    }

    const pdfFile = this.files[0];
    document.getElementById('upload-name-id').value = pdfFile.name;

    let dataBuffer = pdfFile.path;
    dataBuffer = dataBuffer.replaceAll('\\','/');

	var data = await main.pdfParsing(dataBuffer);
	file_name = data[0]
	exports.file_name = file_name;
// console.log(file_name)
    console.log(pdfFile.name);
    for(var i=1;i<data.length;i+=2){
		let addPart = document.createElement("tr");
		let partname = document.createElement("td");
		let count = document.createElement("td");
		let input = document.createElement("input");

		input.id = `part_${parseInt(i/2)}`
		part_weight.push(data[i+1])
		part_name.push(data[i])
		partname.appendChild(document.createTextNode(data[i]));
		count.appendChild(input);
		addPart.appendChild(partname);
		addPart.appendChild(count);

		document.getElementById("part_content").appendChild(addPart);
    }
	part_weight = await weight_modify(part_weight)
    console.log(part_weight)
}

function weight_modify(part_weight){

    for(var i=0;i<part_weight.length;i++){
		part_weight[i] = part_weight[i].split(" ")[0]*1
		// console.log(part_weight[i])
		if(part_weight[i]%5000 != 0){
			part_weight[i] -= part_weight[i]%5000
			part_weight[i] += 5000
			part_weight[i] = parseInt(part_weight[i]/1000)
		}
		else{
			part_weight[i] = parseInt(part_weight[i]/1000)
		}
	}
	return part_weight
}