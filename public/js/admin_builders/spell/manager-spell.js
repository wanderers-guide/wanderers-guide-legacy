
let socket = io();

let activeModalSpellID = -1;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let entries = $('.entryListing');
    for(const entry of entries){

        let spellID = $(entry).attr('name');
        let cardEdit = $(entry).find('.entry-update');
        let cardDelete = $(entry).find('.entry-delete');

        cardEdit.mouseenter(function(){
            $(this).addClass('entry-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('entry-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/admin/edit/spell/'+spellID;
        });

        cardDelete.mouseenter(function(){
            $(this).addClass('entry-footer-hover');
        });
        cardDelete.mouseleave(function(){
            $(this).removeClass('entry-footer-hover');
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