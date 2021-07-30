

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

  let createPDFInterval = setInterval(() => {
    if(isSheetInit){
      createPDF();
      clearInterval(createPDFInterval);
    }
  }, 1000); // Every 1 second until sheet loaded

});

function createPDF(){

  var element = document.getElementById('center-body');
  html2pdf(element);

}