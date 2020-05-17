
let socket = io();

let activeModalFeatID = -1;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let featCards = $('.feat-card');
    for(const featCard of featCards){

        let featID = $(featCard).attr('name');
        let cardEdit = $(featCard).find('.feat-card-edit');
        let cardDelete = $(featCard).find('.feat-card-delete');

        cardEdit.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/admin/edit/feat-action/'+featID;
        });

        cardDelete.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardDelete.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardDelete.click(function() {
            $('.modal').addClass('is-active');
            $('html').addClass('is-clipped');
            activeModalFeatID = featID;
        });

        $('.modal-card-close').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalFeatID = -1;
        });
        $('.modal-background').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalFeatID = -1;
        });

    }

    $('#delete-confirmation-btn').click(function() {
        socket.emit("requestAdminRemoveFeat", activeModalFeatID);
    });

}); 

socket.on("returnAdminRemoveFeat", function() {
    window.location.href = '/admin/manage/feat-action';
});