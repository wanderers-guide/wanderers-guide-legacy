// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let characterCards = $('.character-card');
    for(const characterCard of characterCards){

        let characterID = $(characterCard).attr('name');
        let cardContent = $(characterCard).find('.card-content');
        let cardEdit = $(characterCard).find('.character-card-edit');
        let cardDelete = $(characterCard).find('.character-card-delete');

        cardContent.mouseenter(function(){
            $(this).addClass('card-content-hover');
        });
        cardContent.mouseleave(function(){
            $(this).removeClass('card-content-hover');
        });
        cardContent.click(function() {
            window.location.href = '/profile/characters/'+characterID;
        });

        cardEdit.mouseenter(function(){
            $(this).addClass('card-footer-hover');
        });
        cardEdit.mouseleave(function(){
            $(this).removeClass('card-footer-hover');
        });
        cardEdit.click(function() {
            window.location.href = '/profile/characters/builder/'+characterID+'/page1';
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
        });

        $('.modal-card-close').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
        });
        $('.modal-background').click(function() {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
        });
        $('#delete-confirmation-btn').click(function() {
            window.location.href = '/profile/characters/delete/'+characterID;
        });

    }

}); 