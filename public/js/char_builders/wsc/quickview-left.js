/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  let quickviews = bulmaQuickview.attach();

});

function openLeftQuickView(type, data){
  
  $('#quickViewLeftTitle').html('');
  $('#quickViewLeftContent').html('');
  $('#quickViewLeftContent').scrollTop(0);

  $('#quickViewLeftTitleClose').html('<a id="quickViewLeftClose" class="delete"></a>');
  $('#quickViewLeftClose').click(function(){
    closeQuickViewLeft();
  });

  $('#quickviewLeftDefault').addClass('is-active');

  if(type == 'skillsView'){
    openLeftSkillsQuickview(data);
  }

}

function closeQuickViewLeft() {
  $('#quickviewLeftDefault').removeClass('is-active');
}
