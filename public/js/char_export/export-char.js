/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  

});

function charExportBtn(qContent){

  qContent.append('<button id="char-export-btn" class="button is-info">Export Character</button>');

  $('#char-export-btn').click(function() {
    socket.emit("requestCharExport", getCharIDFromURL());
  });

}

socket.on("returnCharExport", function(charExportData){
  
  let charExportDataJSON = JSON.stringify(charExportData);
  let fileName = charExportData.character.name.replaceAll('[^a-zA-Z]', '').replaceAll(' ', '_');
  charExportDataFileDownload(fileName+'.guidechar', charExportDataJSON);

});


function charExportDataFileDownload(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
