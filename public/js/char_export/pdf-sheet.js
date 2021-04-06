
function initCharacterExportToPDF() {

  $('#btn-export-to-pdf').click(function() {
    //socket.emit("requestCharExportPDFInfo", activeModalCharID);
    getPDF();
  });

}

function getPDF() {

  let sheet = $('#character-pdf-container');
  sheet.html(`
  
    <div>
      <p>${'Name Here!'}</p>
    </div>
  
  `);

  html2pdf(sheet.html(), {
    margin:       10,
    filename:     'myfile.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, logging: true, dpi: 192, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });

}

