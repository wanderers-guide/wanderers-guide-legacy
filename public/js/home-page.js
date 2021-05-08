/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {
    
    $(".banner_w3lspvt-1").fadeTo(1000 , 1);



    $('#backReportBtn').click(function() {
        $('.modal').addClass('is-active');
        $('html').addClass('is-clipped');
    });
    $('.modal-card-close').click(function() {
        $('.modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
    });
    $('.modal-background').click(function() {
        $('.modal').removeClass('is-active');
        $('html').removeClass('is-clipped');
    });

    $('#report-confirmation-btn').click(function() {
        let backgroundID = $("#backReportBtn").attr("name");
        let email = $("#inputEmail").val();
        let message = $("#reportMessage").val();
        if(message != "" && email != "") {
            $("#inputEmail").removeClass("is-danger");
            $("#reportMessage").removeClass("is-danger");
            socket.emit("requestBackgroundReport", 
                backgroundID,
                email,
                message);
        } else {
            if(message == "") {
                $("#reportMessage").addClass("is-danger");
            } else {
                $("#reportMessage").removeClass("is-danger");
            }
            if(email == "") {
                $("#inputEmail").addClass("is-danger");
            } else {
                $("#inputEmail").removeClass("is-danger");
            }
        }
    });


});

socket.on("returnBackgroundReport", function() {
    window.location.href = '/';
});