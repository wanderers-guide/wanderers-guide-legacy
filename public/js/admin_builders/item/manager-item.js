
let socket = io();

let activeModalItemID = -1;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let itemCards = $('.item-card');
    for(const itemCard of itemCards){

        let itemID = $(itemCard).attr('name');
        let cardEdit = $(itemCard).find('.item-card-edit');
        let cardDelete = $(itemCard).find('.item-card-delete');

        cardEdit.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/admin/edit/item/'+itemID;
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
            activeModalItemID = itemID;
        });

        $('.modal-card-close').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalItemID = -1;
        });
        $('.modal-background').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalItemID = -1;
        });

    }

    $('#delete-confirmation-btn').click(function() {
        socket.emit("requestAdminRemoveItem", activeModalItemID);
    });

}); 

socket.on("returnAdminRemoveItem", function() {
    window.location.href = '/admin/manage/item';
});