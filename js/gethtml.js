const fs = require('fs')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const remote = require('electron').remote
const main = remote.require('./main.js')

String.prototype.replaceAll = function(org,dest){
    return this.split(org).join(dest);
}
let setting = main.setting

var inputElement = document.getElementById("pdfFile");
inputElement.addEventListener("change", changeFile, false);

let part_weight = []
let part_name = []
exports.part_weight = part_weight;
exports.part_name = part_name;

function changeFile(){
	part_weight = []
    const pdfFile = this.files[0];
    document.getElementById('upload-name-id').value = pdfFile.name;

    let dataBuffer = pdfFile.path;
    dataBuffer = dataBuffer.replaceAll('\\','/');

	handleFiles(dataBuffer)
}

async function handleFiles(dataBuffer) {
	console.log(dataBuffer);

    var data = await main.mod_pdfParsing(dataBuffer);
    gethtml_func(data)
	// part_weight = await weight_modify(part_weight)
	// exports.part_weight = part_weight
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

function gethtml_func(input){
    input = input[2]+input[1]+input[0]
    let path = `${__dirname}/../savefile/htmlsave/${input}.html`
    let html = fs.readFileSync(path)
    html = iconv.encode(html, "utf-8").toString();
    
    let parse = cheerio.load(html)
    
    let result = []
    
    let date = parseInt(parse('#req_date').text().slice(0,-1))
    let make_time = parseInt(parse('#make_time').text())
    let parse_part_name = parse(".part_name")
    let parse_part_weight = parse(".part_weight")
    let parse_part_num = parse(".part_num")
    
    let part_num = []
    
    
    for(var i=0;i<parse_part_name.length;i++){
        part_name.push(parse_part_name[i].children[0].data)
        part_weight.push(parseInt(parse_part_weight[i].children[0].data))
        part_num.push(parseInt(parse_part_num[i].children[0].data))   
    }
    
    exports.part_weight = part_weight;
    exports.part_name = part_name;

    let modeling = []
    modeling["modeling"] = parse('#modeling').text()
    modeling["modeling_res"] = parse('#modeling_res').text()
    modeling["modeling_date"] = parse('#modeling_date').text()
    modeling["modeling_price"] = parseInt(parse('#modeling_price').text().split(",").join(""))
    
    let painting = []
    painting["painting"] = parse('#painting').text()
    painting["painting_num"] = parse('#painting_num').text()
    painting["painting_price"] = parseInt(parse('#painting_price').text().split(",").join(""))
    
    result["date"] = date
    result["make_time"] = make_time
    result["part_num"] = part_num
    result["part_weight"] = part_weight
    result["part_num"] = part_num
    result["modeling"] = modeling
    result["painting"] = painting
    
    
}