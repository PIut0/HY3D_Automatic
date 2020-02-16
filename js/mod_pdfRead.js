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
    part_name = []
    const pdfFile = this.files[0];
    document.getElementById('upload-name-id').value = pdfFile.name;

    let dataBuffer = pdfFile.path;
    dataBuffer = dataBuffer.replaceAll('\\','/');

	handleFiles(dataBuffer)
}

async function handleFiles(dataBuffer) {
	// console.log(dataBuffer);

    var data = await main.mod_pdfParsing(dataBuffer);
    gethtml_func(data)
	// part_weight = await weight_modify(part_weight)
	// exports.part_weight = part_weight
}

// function weight_modify(part_weight){
//     for(var i=0;i<part_weight.length;i++){
// 		part_weight[i] = part_weight[i].split(" ")[0]*1
// 		// // console.log(part_weight[i])
// 		if(part_weight[i]%5000 != 0){
// 			part_weight[i] -= part_weight[i]%5000
// 			part_weight[i] += 5000
// 			part_weight[i] = parseInt(part_weight[i]/1000)
// 		}
// 		else{
// 			part_weight[i] = parseInt(part_weight[i]/1000)
// 		}
// 	}
// 	return part_weight
// }

function gethtml_func(input){
    // input = input[2]+"_"+input[1]+"_"+input[0]
    let path = `${__dirname}/../savefile/htmlsave/${input}.html`
    let xl_num = input.split('_')
    xl_num = xl_num[xl_num.length-1]
    // console.log(xl_num)
    
    let html = fs.readFileSync(path)
    html = iconv.encode(html, "utf-8").toString();
    
    let parse = cheerio.load(html)
    
    let result = []
    
    let date = parseInt(parse('#req_date').text().slice(0,-1))
    let delivery_num = parseInt(parse('#delivery_num').text())
    let delivery_price = parseInt(parse('#delivery_price').text().split(",").join(""))
    let make_time = parseInt(parse('#make_time').text())
    let parse_part_name = parse(".part_name")
    let parse_part_weight = parse(".part_weight")
    let parse_part_num = parse(".part_num")
    let parse_item_name = parse("#item_name").text()
    parse_item_name = parse_item_name.split(" ")
    parse_item_name = parse_item_name[parse_item_name.length-1]
    console.log(parse_item_name)
    
    let part_num = []
    
    for(var i=0;i<parse_part_name.length;i++){
        part_name.push(parse_part_name[i].children[0].data)
        part_weight.push(parseInt(parse_part_weight[i].children[0].data))
        part_num.push(parseInt(parse_part_num[i].children[0].data))   
    }
    
    exports.part_weight = part_weight;
	exports.part_name = part_name;
	// console.log(part_name)

    let modeling = []
    modeling["modeling"] = parse('#modeling').text()
    modeling["modeling_res"] = parse('#modeling_res').text()
    modeling["modeling_date"] = parse('#modeling_date').text()
    modeling["modeling_price"] = parseInt(parse('#modeling_price').text().split(",").join(""))
    
    let painting = []
    painting["painting"] = parse('#painting').text()
    painting["painting_num"] = parse('#painting_num').text()
    painting["painting_price"] = parseInt(parse('#painting_price').text().split(",").join(""))
	
	if(isNaN(modeling["modeling_price"]))	modeling["modeling_price"] = ""
	if(isNaN(painting["painting_price"]))	painting["painting_price"] = ""
	if(isNaN(delivery_price))	delivery_price = ""
	if(isNaN(delivery_num))	delivery_num = ""
	if(isNaN(make_time))	make_time = ""

    result["date"] = date
    result["delivery_price"] = delivery_price
    result["delivery_num"] = delivery_num
    result["make_time"] = make_time
    // result["part_name"] = part_name
    // result["part_weight"] = part_weight
    result["part_num"] = part_num
    result["modeling"] = modeling
    result["painting"] = painting
    result["xl_num"] = xl_num
    result["property"] = parse_item_name
    
    applyhtml(result)
}

function applyhtml(result){

	let date = result.date
    let delivery_price = result.delivery_price
    let delivery_num = result.delivery_num
	let make_time = result.make_time
	let part_num = result.part_num
	// let part_weight = result.part_weight
	// let part_name = result.part_name
	let modeling = result.modeling
    let painting = result.painting
    let xl_num = result.xl_num
    let property = result.property

	document.getElementById("time").value = make_time
	document.getElementById("req_date").value = date
	document.getElementById("delivery_price").value = delivery_price
    document.getElementById("delivery_num").value = delivery_num
    
    document.querySelectorAll("option").forEach(function(val){
        if(val.value == property)   val.selected = true
        else    val.selected = false
    });

    let remove_table = document.querySelectorAll('.part_content tr');
    for(var i=1;i<remove_table.length;i++){
		remove_table[i].remove();
	}
	
    for(var i=0;i<part_name.length;i+=1){
		let addPart = document.createElement("tr");
		let partname = document.createElement("td");
		let count = document.createElement("td");
		let input = document.createElement("input");

		input.id = `part_${i}`
		input.value = part_num[i]
		partname.appendChild(document.createTextNode(part_name[i]));
		count.appendChild(input);
		addPart.appendChild(partname);
		addPart.appendChild(count);

		document.getElementById("part_content").appendChild(addPart);
	}

	document.getElementById("modeling").value = modeling["modeling"]
	document.getElementById("modeling_res").value = modeling["modeling_res"]
	document.getElementById("modeling_date").value = modeling["modeling_date"]
	document.getElementById("modeling_price").value = modeling["modeling_price"]
	
	document.getElementById("painting").value = painting["painting"]
	document.getElementById("painting_num").value = painting["painting_num"]
    document.getElementById("painting_price").value = painting["painting_price"]
    
    document.getElementById("excel_no").value = xl_num
}