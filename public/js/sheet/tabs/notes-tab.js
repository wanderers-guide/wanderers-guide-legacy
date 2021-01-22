/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openNotesTab(data) {

  let notesAreaID = "notesArea";
  let notesAreaControlShellID = "notesAreaControlShell";

  $('#tabContent').html('<div id="'+notesAreaControlShellID+'" style="background-color: hsl(0, 0%, 18%);"><div id="'+notesAreaID+'" style="background-color: hsl(0, 0%, 20%); height: 550px; max-height: 550px; overflow-y: auto;">'+data.Character.notes+'</div></div>');

  // Init Quill
  let Font = Quill.import('formats/font');
  Font.whitelist = ['proza-libre', 'nanum-gothic', 'handwriting', 'dethek', 'iokharic', 'druidic'];
  Quill.register(Font, true);

  let quill = new Quill('#'+notesAreaID, {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }, 'blockquote'],

        [{ 'color': [] }, { 'background': [] }],
        
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [false, 'proza-libre', 'nanum-gothic', 'handwriting', 'dethek', 'iokharic', 'druidic'] }],
      ]
    },
    placeholder: 'Feel free to write information here about your character, campaign, or anything else you\'d like!',
    theme: 'snow'
  });

  quill.root.setAttribute('spellcheck', false);

  ///  ///

  quill.root.addEventListener('blur', function () {
    if(data.Character.notes != quill.container.innerHTML) {

      $("#"+notesAreaControlShellID).addClass("is-loading");

      socket.emit("requestNotesSave",
          getCharIDFromURL(),
          quill.container.innerHTML);
      
      data.Character.notes = quill.container.innerHTML;

    }
  });


  // Pages

  /*
  $('#tabContent').append('<div id="notesPageSection"><div class="field has-addons"><div class="control"><span class="button is-small is-info">Page</span></div><div class="control"><span class="button is-small is-info">...</span></div></div></div>');
  */

}

socket.on("returnNotesSave", function(){
    $("#notesAreaControlShell").removeClass("is-loading");
});