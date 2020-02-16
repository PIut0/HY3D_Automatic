const remote = require('electron').remote
const fs = require('fs')
const main = remote.require('./main.js')
const path = require('path')
const _ = require('underscore')

String.prototype.replaceAll = function(org,dest){
    return this.split(org).join(dest);
}
let setting = main.setting

var inputElement = document.getElementById("pdfFile");
var recentlyElement = document.getElementById("recently");
inputElement.addEventListener("change", changeFile, false);
recentlyElement.addEventListener("click", recentlyFile, false);

let part_weight = []
let part_name = []
exports.part_weight = part_weight;
exports.part_name = part_name;

function changeFile(){
	part_weight = []
	part_name = []
    const pdfFile = this.files[0];
    document.getElementById('upload-name-id').value = pdfFile.name;

    let dataBuffer = pdfFile.path;
	dataBuffer = dataBuffer.replaceAll('\\','/');
	
	handleFiles(dataBuffer)
}

function recentlyFile(){
	part_weight = []
	part_name = []
	var dir = setting.pdfPath
	var files = fs.readdirSync(dir);

    var recentlyPdfFile =  _.max(files, function (f) {
        var fullpath = path.join(dir, f);
        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
	});
    document.getElementById('upload-name-id').value = recentlyPdfFile;
	recentlyPdfFile = dir + "/"+ recentlyPdfFile
	handleFiles(recentlyPdfFile)
}

async function handleFiles(dataBuffer) {
	// // console.log("handle File")
    let remove_table = document.querySelectorAll('.part_content tr');
    for(var i=1;i<remove_table.length;i++){
		// // console.log(remove_table[i]);
		remove_table[i].remove();
	}
	
	console.log(dataBuffer);

	var data = await main.pdfParsing(dataBuffer);
// // console.log(file_name)
    // console.log(pdfFile.name);
    for(var i=0;i<data.length;i+=2){
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
	// console.log(part_weight)
	part_weight = await weight_modify(part_weight)
	exports.part_weight = part_weight
	exports.part_name = part_name
    console.log(part_name)
}

function weight_modify(part_weight){

    for(var i=0;i<part_weight.length;i++){
		part_weight[i] = part_weight[i].split(" ")[0]*1
		// // console.log(part_weight[i])
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