
$(function () {

    $(".text-processing").each(function(){
        $(this).html(processText($(this).text(), false));
    });

});