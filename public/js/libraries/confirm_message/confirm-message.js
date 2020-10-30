/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

class ConfirmMessage {
  constructor(title, description, modalID, deleteBtnID) {
    this.title = title;
    this.description = description;
    this.modalID = modalID;
    this.deleteBtnID = deleteBtnID;
    $('#center-body').append('<div id="'+modalID+'" class="modal"><div id="'+modalID+'-background" class="modal-background"></div><div class="modal-card"><header class="modal-card-head"><p class="modal-card-title is-size-4 has-text-light">'+title+'</p><button id="'+modalID+'-card-close" class="delete modal-card-close" aria-label="close"></button></header><section class="modal-card-body"><p class="has-text-light has-text-centered">'+description+'</p></section><footer class="modal-card-foot is-paddingless p-3 field is-grouped is-grouped-centered"><p class="control"><a class="button is-danger is-outlined" id="'+deleteBtnID+'">Delete</a></p></footer></div></div>');
    $('#'+modalID+'-card-close').click(function() {
      $('#'+modalID).removeClass('is-active');
      $('html').removeClass('is-clipped');
    });
    $('#'+modalID+'-background').click(function() {
      $('#'+modalID).removeClass('is-active');
      $('html').removeClass('is-clipped');
    });
    $('#'+deleteBtnID).click(function() {
      $('#'+modalID).removeClass('is-active');
      $('html').removeClass('is-clipped');
    });
  }
  open() {
    $('#'+this.modalID).addClass('is-active');
    $('html').addClass('is-clipped');
  }
}