$(document).ready(function (){
    var more_toggle = $(".more_info");
    var more_info_table = $(".more_info_table");
    more_toggle.on("click", function(){
        more_info_table.toggle();
    })
})