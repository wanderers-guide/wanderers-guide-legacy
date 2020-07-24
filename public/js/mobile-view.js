/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

    checkViewportSize();
    $(window).resize(function() {
        checkViewportSize();
    });

});

function checkViewportSize(){

    if(window.location.pathname != '/' && window.location.pathname != '/auth/login') {

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

        if(vw < 950){
            $('#mobile-warning-message').html('<div class="hero is-danger"><div class="hero-body is-paddingless py-3"><div class="container"><p class="subtitle is-marginless has-text-centered has-text-weight-bold">Wanderer\'s Guide Currently Does Not Support Small Viewport Sizes</p><p class="has-text-grey-lighter has-text-centered is-size-8">If you\'re looking for a character manager on the phone, there\'s a great one in the <a class="has-text-light has-text-weight-bold" href="https://play.google.com/store/apps/details?id=com.redrazors.pathbuilder2e" target="_blank">Google Play Store</a>.</p></div></div></div>');
        } else {
            $('#mobile-warning-message').html('');
        }

    }

}