const remote = require('electron').remote
const fs = require('fs')
const main = remote.require('./main.js')


console.log(main.result)

let est_time = main.result.est_time
let file_name = main.result.file_name
let req_date = main.result.req_date
let delivery_price = main.result.delivery_price
let part_weight = main.result.part_weight
let part_name = main.result.part_name
let part_num = main.result.part_num
let xlresult = main.result.xlresult

let machine = xlresult[0]
let machine_t = 0
let model = "error"
let model_g = 0

if(machine == 'SLA'){
    machine_t = 30000
    model = "ABS like"
    model_g = 700
}
else if(machine == 'SLA(clear)'){
    machine_t = 50000
    model = "clear"
    model_g = 700
}
else if(machine == 'SLS'){
    machine_t = 50000
    model = "PA12"
    model_g = 1000
}

// 숫자 타입에서 쓸 수 있도록 money() 함수 추가
Number.prototype.money = function(){
    if(isNaN(this)) return "-";
    if(this==0) return "-";

	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + '');

	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

	return n;
};

// 문자열 타입에서 쓸 수 있도록 money() 함수 추가
String.prototype.money = function(){
    var num = parseFloat(this);
	if( isNaN(num) ) return "-";

	return num.money();
};




let dom_group_name = document.getElementById("group_name")
let dom_item_name = document.getElementById("item_name")
let dom_item_name2 = document.getElementById("item_name2")
let dom_item_name3 = document.getElementById("item_name3")
let dom_item_name4 = document.getElementById("item_name4")
let dom_result_price = document.getElementById("result_price2")
let dom_req_date = document.getElementById("req_date")

let dom_make_modeling_table = document.getElementById("make_modeling_table")
let dom_make_printing_table = document.getElementById("make_printing_table")

let dom_model = document.getElementById("model")
let dom_model_g = document.getElementById("model_g")
let dom_machine = document.getElementById("machine")
let dom_machine_t = document.getElementById("machine_t")

let dom_painting_table = document.getElementById("painting_table")
let dom_delivery_table = document.getElementById("delivery_table")

let dom_delivery_price = document.getElementById("delivery_price")
let dom_delivery_price2 = document.getElementById("delivery_price2")
let dom_delivery_price3 = document.getElementById("delivery_price3")

let table_result_modeling = document.getElementById("result_modeling")
let table_result_printing = document.getElementById("result_printing")
let table_result_painting = document.getElementById("result_painting")
let table_result_delivery = document.getElementById("result_delivery")
let table_sum_price = document.getElementById("sum_price")
let table_sum = document.getElementById("sum")
let table_vat = document.getElementById("vat")
let table_result_price = document.getElementById("result_price")

let dom_today = document.getElementById("today")



dom_group_name.innerHTML = `<p>${xlresult[2]} ${xlresult[1]}</p>`
dom_item_name.innerHTML = `${xlresult[3]} 제작`
dom_item_name2.innerHTML = `${xlresult[3]} 제작`
dom_item_name3.innerHTML = `${xlresult[3]}`
dom_item_name4.innerHTML = `${xlresult[3]} 제작`
dom_result_price.innerHTML = `(합계금액)`
dom_req_date.innerHTML = `${req_date}일`


dom_model.innerHTML = `${model}`
dom_model_g.innerHTML = `${model_g}원/g`
dom_machine.innerHTML = `${machine}`
dom_machine_t.innerHTML = `${machine_t.money()}원/시간`

function printing_func(){
    var sum = 0;
    for(var i=0;i<part_weight.length+1;i++){
        console.log(part_weight.length)
        if(i == part_weight.length){
            let addPart = document.createElement("tr")
            let no = document.createElement("td")
            let price = document.createElement("td")

            no.appendChild(document.createTextNode("소계"))

            price.appendChild(document.createTextNode(" ₩ "))
            let span1 = document.createElement("span")
            span1.style="float: right;"
            span1.appendChild(document.createTextNode("-"))
            price.appendChild(span1)

            no.colSpan = 7
            price.className = "left_td"
            span1.id="sum_price2"

            addPart.appendChild(no)
            addPart.appendChild(price)

            dom_make_printing_table.appendChild(addPart)
        }
        else if(i == 0){
            
            let addPart = document.createElement("tr")
            let no = document.createElement("td")
            let name = document.createElement("td")
            let date = document.createElement("td")
            let date_price = document.createElement("td")
            let weight = document.createElement("td")
            let num = document.createElement("td")
            let price = document.createElement("td")
            let sum_price = document.createElement("td")

            date.rowSpan=part_weight.length
            date_price.rowSpan=part_weight.length
            sum_price.rowSpan=part_weight.length
            date_price.className="left_td"
            sum_price.className="left_td"
            price.className="left_td"
            
            no.appendChild(document.createTextNode(i+1))
            name.appendChild(document.createTextNode(part_name[i]))
            date.appendChild(document.createTextNode(est_time))

            date_price.appendChild(document.createTextNode(" ₩ "))
            let span1 = document.createElement("span")
            span1.style="float: right;"
            span1.appendChild(document.createTextNode((est_time*machine_t).money()))
            console.log(est_time)
            console.log(machine_t)
            console.log(machine_t*est_time)
            date_price.appendChild(span1)

            weight.appendChild(document.createTextNode(part_weight[i]))
            num.appendChild(document.createTextNode(part_num[i]))


            price.appendChild(document.createTextNode(" ₩ "))
            let span2 = document.createElement("span")
            span2.style="float: right;"
            span2.appendChild(document.createTextNode((part_weight[i]*model_g*part_num[i]).money()))
            price.appendChild(span2)

            
            sum_price.appendChild(document.createTextNode(" ₩ "))
            let span3 = document.createElement("span")
            span3.style="float: right;"
            span3.id = "sum_price"
            span3.appendChild(document.createTextNode(0))
            sum_price.appendChild(span3)

            sum += (part_weight[i]*model_g*part_num[i])

            addPart.appendChild(no)
            addPart.appendChild(name)
            addPart.appendChild(date)
            addPart.appendChild(date_price)
            addPart.appendChild(weight)
            addPart.appendChild(num)
            addPart.appendChild(price)
            addPart.appendChild(sum_price)

            dom_make_printing_table.appendChild(addPart)
        }
        else{
            let addPart = document.createElement("tr")
            let no = document.createElement("td")
            let name = document.createElement("td")
            let weight = document.createElement("td")
            let num = document.createElement("td")
            let price = document.createElement("td")
            price.className="left_td"
            
            no.appendChild(document.createTextNode(i+1))
            name.appendChild(document.createTextNode(part_name[i]))
            weight.appendChild(document.createTextNode(part_weight[i]))
            num.appendChild(document.createTextNode(part_num[i]))
            
            price.appendChild(document.createTextNode(" ₩ "))
            let span1 = document.createElement("span")
            span1.style="float: right;"
            span1.appendChild(document.createTextNode((part_weight[i]*model_g*part_num[i]).money()))
            price.appendChild(span1)

            sum += (part_weight[i]*model_g*part_num[i])

            addPart.appendChild(no)
            addPart.appendChild(name)
            addPart.appendChild(weight)
            addPart.appendChild(num)
            addPart.appendChild(price)

            dom_make_printing_table.appendChild(addPart)
        }
    }
    sum += est_time*machine_t
    document.getElementById("sum_price").innerHTML = sum.money()
    document.getElementById("sum_price2").innerHTML = sum.money()
    console.log(sum)
    
    return sum
}

function money2kr(num) {
    num += ""
    var hanA = new Array("","일","이","삼","사","오","육","칠","팔","구","십");
    var danA = new Array("","십","백","천","","십","백","천","","십","백","천","","십","백","천");
    var result = "";
    for(i=0;i<num.length;i++) {
        str = "";
        han = hanA[num.charAt(num.length-(i+1))];
        if(han != "") str += han+danA[i];
        if(i == 4) str += "만";
        if(i == 8) str += "억";
        if(i == 12) str += "조";
        result = str + result;
    }
    if(num != 0) result = result + " 원정";
    return result;
}


let modeling_price = 0;
let printing_price = printing_func()
let painting_price = 0;

dom_delivery_price.innerHTML = delivery_price.money()
dom_delivery_price2.innerHTML = delivery_price.money()
dom_delivery_price3.innerHTML = delivery_price.money()

table_result_modeling.innerHTML = modeling_price.money()
table_result_printing.innerHTML = printing_price.money()
table_result_painting.innerHTML = painting_price.money()
table_result_delivery.innerHTML = delivery_price.money()

let result_sum = modeling_price + printing_price + painting_price + delivery_price

table_sum_price.innerHTML = result_sum.money()
table_sum.innerHTML = result_sum.money()
table_vat.innerHTML = parseInt(result_sum/10).money()

let last_price = result_sum + parseInt(result_sum/10)

table_result_price.innerHTML = last_price.money()
dom_result_price.innerHTML = `${money2kr(last_price)} ( ₩${last_price.money()} ) (V.A.T.포함)`

var today = new Date()

dom_today.innerHTML = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`


let string = new XMLSerializer().serializeToString(document);
fs.writeFileSync(`./savefile/htmlsave/${file_name}.html`,string)


// var element = document.getElementById("content");
// var opt = {
//     margin: 0,
//     filename: `${file_name}.pdf`,
//     pagebreak: {
//         // mode: 'avoid-all'
//     },
//     html2canvas:{
//         width: 1320,
//     },
//     jsPDF: {
//         format: 'a4',
//         unit:'in'
//     }
// }
// html2pdf(element,opt)