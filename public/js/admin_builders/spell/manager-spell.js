
let socket = io();

let activeModalSpellID = -1;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let spellCards = $('.spell-card');
    for(const spellCard of spellCards){

        let spellID = $(spellCard).attr('name');
        let cardEdit = $(spellCard).find('.spell-card-edit');
        let cardDelete = $(spellCard).find('.spell-card-delete');

        cardEdit.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/admin/edit/spell/'+spellID;
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
            activeModalSpellID = spellID;
        });

        $('.modal-card-close').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalSpellID = -1;
        });
        $('.modal-background').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalSpellID = -1;
        });

    }

    $('#delete-confirmation-btn').click(function() {
        socket.emit("requestAdminRemoveSpell", activeModalSpellID);
    });

}); 

socket.on("returnAdminRemoveSpell", function() {
    window.location.href = '/admin/manage/spell';
});