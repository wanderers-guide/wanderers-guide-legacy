/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openPageChoose(){

  $('#section-shop-customize').addClass('is-hidden');
  $('#section-shop-generate').addClass('is-hidden');
  $('#section-shop-choose').removeClass('is-hidden');


  // Shop Presets
  $('#shop-type').html('<option value="chooseDefault">Choose a Shop</option>');
  for(const [presetID, shopPreset] of g_shopPresets){
    $('#shop-type').append(`<option value="${presetID}">${shopPreset.name}</option>`);
  }

  $('#shop-type').off();
  $('#shop-type').change(function(){
    let presetID = $(this).val();
    if(presetID != 'chooseDefault'){
      
      setShop(presetID);

      openPageGenerate();
    }
  });

  shopInitImport();

}

function openPageGenerate(){

  $('#section-shop-choose').addClass('is-hidden');
  $('#section-shop-customize').addClass('is-hidden');
  $('#section-shop-generate').removeClass('is-hidden');

  $('#shop-name').text(g_shop.name);

  $('#exit-shop-btn').off();
  $('#exit-shop-btn').click(function(){
    
    if(isShopEdited()){
      new ConfirmMessage('Lose Shop Changes', '<p class="has-text-centered">Exiting this shop will undo any changes you\'ve made to it. To save your changes, you can export this shop.</p><p class="has-text-centered">Are you sure you want to continue?</p>', 'Exit Shop', 'modal-exit-shop', 'modal-exit-shop-btn');
      $('#modal-exit-shop-btn').click(function() {
        deleteShop();
        openPageChoose();
      });
    } else {
      deleteShop();
      openPageChoose();
    }

  });

  $('#customize-shop-btn').off();
  $('#customize-shop-btn').click(function(){
    openPageCustomize();
  });

  $('#export-shop-btn').off();
  $('#export-shop-btn').click(function() {
    shopExport();
  });


  // Books
  $('#input-books').html('');
  for(const bookSource of g_contentSources){
    $('#input-books').append(`<option value="${bookSource.CodeName}">${bookSource.TextName}</option>`);
  }
  $('#input-books').chosen();

  // Homebrew Bundles
  $('#input-homebrew').html('');
  for(const bookSource of g_contentSources){
    $('#input-homebrew').append(`<option value="${bookSource.CodeName}">${bookSource.TextName}</option>`);
  }
  $('#input-homebrew').chosen();


  $('.chosen-container .chosen-choices').addClass('use-custom-scrollbar');

  
  $('#inventory-size').ionRangeSlider();
  $('#price-markup').ionRangeSlider();


}

function openPageCustomize(){

  startSpinnerSubLoader();

  setTimeout(() => {

    $('#section-shop-choose').addClass('is-hidden');
    $('#section-shop-generate').addClass('is-hidden');
    $('#section-shop-customize').removeClass('is-hidden');

    loadItemProfiles();

    $('#customize-back-btn').off();
    $('#customize-back-btn').click(function(){
      openPageGenerate();
    });

    $('#customize-shop-name').val(g_shop.name);
    $('#customize-shop-name').off();
    $('#customize-shop-name').change(function(){
      g_shop.name = $(this).val();
    });

    stopSpinnerSubLoader();

  }, 50);// After 0.05 second

}