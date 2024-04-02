document.addEventListener("DOMContentLoaded", function () {
  const paper = document.querySelector('.paper');
  var pdf = document.querySelector('.pdf');
  var spd = 0.5;

  //pdf.innerHTML = "Sample Text";
  pdf.textContent = "Stephen Hodson March 24, 2008 ME608"; // Use textContent for performance reasons

  paper.addEventListener('mouseover', function(event) {
    document.documentElement.style.setProperty('--animation-pdf', `shrinkPDF ${spd}s linear`);
    pdf.style.letterSpacing = 'normal'; // Set initial letter-spacing

    setTimeout(() => {
      //pdf.innerHTML = "";
      pdf.textContent = "";
      document.documentElement.style.setProperty('--animation-pdf', `revealPDF ${spd}s linear`);
      pdf.textContent = "PDF";
      pdf.style.letterSpacing = "normal";
      /* pdf.style.fontSize = "2em"; */
      pdf.style.fontFamily = "Lato, sans-serif";
    }, spd*1000 - 50)
  })

  paper.addEventListener('mouseout', function(event) {
    document.documentElement.style.setProperty('--animation-pdf', `shrinkPDF ${spd}s linear`);
    pdf.style.letterSpacing = 'normal'; // Set initial letter-spacing

    setTimeout(() => {
      pdf.textContent = "";
      document.documentElement.style.setProperty('--animation-pdf', `revealPDF ${spd}s linear`);
      pdf.textContent = "Stephen Hodson March 24, 2008 ME608";
      pdf.style.letterSpacing = "normal";
      pdf.style.fontFamily = "Dancing Script, sans-serif";
    }, spd*1000 - 50)
  })

})
