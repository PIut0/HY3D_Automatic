const remote = require('electron').remote
const fs = require('fs')
const main = remote.require('./main.js')


//console.log(main.result)

let est_time = main.result.est_time
// let file_name = main.result.file_name
let req_date = main.result.req_date
let delivery_num = main.result.delivery_num
let delivery_price = main.result.delivery_price
let part_weight = main.result.part_weight
let part_name = main.result.part_name
let part_num = main.result.part_num

let modeling = main.result.modeling
let modeling_res = main.result.modeling_res
let modeling_date = main.result.modeling_date
let modeling_price2 = main.result.modeling_price

let painting = main.result.painting
let painting_num = main.result.painting_num
let painting_price2 = main.result.painting_price
let property = main.result.property

let xl_num = main.result.xl_num

console.log(main.result)

console.log(part_weight)


if(modeling_price2 == "")    modeling_price2="0"
if(painting_price2 == "")    painting_price2="0"

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
let dom_modeling = document.getElementById("modeling")
let dom_modeling_res = document.getElementById("modeling_res")
let dom_modeling_date = document.getElementById("modeling_date")
let dom_modeling_price = document.getElementById("modeling_price")
let dom_modeling_result_price = document.getElementById("modeling_result_price")
let dom_modeling_result_price2 = document.getElementById("modeling_result_price2")

let dom_make_printing_table = document.getElementById("make_printing_table")


let dom_model = document.getElementById("model")
let dom_model_g = document.getElementById("model_g")
let dom_machine = document.getElementById("machine")
let dom_machine_t = document.getElementById("machine_t")

let dom_painting_table = document.getElementById("painting_table")
let dom_painting = document.getElementById("painting")
let dom_painting_num = document.getElementById("painting_num")
let dom_painting_price = document.getElementById("painting_price")
let dom_painting_result_price = document.getElementById("painting_result_price")
let dom_painting_result_price2 = document.getElementById("painting_result_price2")


let dom_delivery_table = document.getElementById("delivery_table")

let dom_delivery_num = document.getElementById("delivery_num")
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
let pairing_id = document.getElementById("pairing_id")


dom_group_name.innerHTML = `<p>${xlresult[2]}</p>`
dom_item_name.innerHTML = `${xlresult[3]} ${property}`
dom_item_name2.innerHTML = `${xlresult[3]} ${property}`
dom_item_name4.innerHTML = `${xlresult[3]} ${property}`
dom_result_price.innerHTML = `(합계금액)`
dom_req_date.innerHTML = `${req_date}일`

dom_modeling.innerHTML = `${modeling}`
dom_modeling_res.innerHTML = `${modeling_res}`
dom_modeling_date.innerHTML = `${modeling_date}`
dom_modeling_price.innerHTML = `${modeling_price2.money()}`

dom_painting.innerHTML = `${painting}`
dom_painting_num.innerHTML = `${painting_num}`
dom_painting_price.innerHTML = `${painting_price2.money()}`


painting_num = parseInt(painting_num)
modeling_date = parseInt(modeling_date)
delivery_num = parseInt(delivery_num)

if(isNaN(painting_num))    painting_num=0
if(isNaN(modeling_date))    modeling_date=0
if(isNaN(delivery_num))    delivery_num=0


let modeling_price = parseInt(modeling_price2)*parseInt(modeling_date);
let printing_price = printing_func()
let painting_price = parseInt(painting_price2)*parseInt(painting_num);

dom_model.innerHTML = `${model}`
dom_model_g.innerHTML = `${model_g.money()}원/g`
dom_machine.innerHTML = `${machine}`
dom_machine_t.innerHTML = `${machine_t.money()}원/시간`

dom_modeling_result_price.innerHTML = `${modeling_price.money()}`
dom_modeling_result_price2.innerHTML = `${modeling_price.money()}`

dom_painting_result_price.innerHTML = `${painting_price.money()}`
dom_painting_result_price2.innerHTML = `${painting_price.money()}`


function printing_func(){
    var sum = 0;
    for(var i=0;i<part_weight.length+1;i++){
        //console.log(part_weight.length)
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
            date.id = "make_time"
            // name.id = `part_name${i}`
            // weight.id = `part_weight${i}`
            // num.id = `part_num${i}`
            name.classList.add('part_name')
            weight.classList.add('part_weight')
            num.classList.add('part_num')
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
            //console.log(est_time)
            //console.log(machine_t)
            //console.log(machine_t*est_time)
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
            // name.id = `part_name${i}`
            // weight.id = `part_weight${i}`
            // num.id = `part_num${i}`
            name.classList.add('part_name')
            weight.classList.add('part_weight')
            num.classList.add('part_num')
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
    //console.log(sum)
    
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


let delivery_price2 = delivery_price * delivery_num;
if(delivery_num != 0){
    dom_item_name3.innerHTML = `${xlresult[3]}`
    dom_delivery_num.innerHTML = delivery_num
    dom_delivery_price.innerHTML = delivery_price.money()
    dom_delivery_price2.innerHTML = delivery_price2.money()
    dom_delivery_price3.innerHTML = delivery_price2.money()
}

table_result_modeling.innerHTML = modeling_price.money()
table_result_printing.innerHTML = printing_price.money()
table_result_painting.innerHTML = painting_price.money()
table_result_delivery.innerHTML = delivery_price2.money()

console.log(modeling_price)
console.log(printing_price)
console.log(painting_price)
console.log(delivery_price2)

let result_sum = modeling_price + printing_price + painting_price + delivery_price2

table_sum_price.innerHTML = result_sum.money()
table_sum.innerHTML = result_sum.money()
table_vat.innerHTML = parseInt(result_sum/10).money()

let last_price = result_sum + parseInt(result_sum/10)

table_result_price.innerHTML = last_price.money()
dom_result_price.innerHTML = `${money2kr(last_price)} ( ₩${last_price.money()} ) (V.A.T.포함)`

var today = new Date()

var year = today.getFullYear()
var month = today.getMonth()+1
var date = today.getDate()

month = month + ""
date = date + ""
if(month.length == 1)   month = "0"+month
if(date.length == 1)   date = "0"+date

dom_today.innerHTML = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`

var rand = Math.random()*10
let pairing = `${year}${month}${date}_${xlresult[3]}_${xlresult[2]}_${last_price.money()}_${rand}_${xl_num}`
pairing_id.innerHTML = `[id]${pairing}[id]`
let string = new XMLSerializer().serializeToString(document);
fs.writeFileSync(`${__dirname}/savefile/htmlsave/${pairing}.html`,string)


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