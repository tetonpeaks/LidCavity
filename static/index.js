
document.addEventListener("DOMContentLoaded", function () {
    const wrapper = document.querySelector(".intro-wrapper");
    const integralContainer = document.querySelector(".integral-container");
    var grid32 = document.querySelectorAll('.grid3x2__cell');

    const paper = document.querySelector('.paper');
    var pdf = document.querySelector('.pdf');
    var spd = 0.5;

    var grid0_height;
    var navierStokesLinked = false;

    wrapper.addEventListener("mouseover", function(event) {
      if (event.target.classList.contains('startEffect')) {

        // Toggle the display of the integral-container
        integralContainer.style.display = integralContainer.style.display === "none" ? "grid" : "none";

        if (integralContainer.style.display === "grid") {
          navierStokesLinked = false;
          let liCtr = 0;
          for (let i = 0; i < 5; i+=2) {

            document.documentElement.style.setProperty('--animation-integral', 'color 0.5s ease-out')

            grid32 = document.querySelectorAll('.grid3x2__cell');

            if (i === 0) {
              grid32[i].innerHTML = `
                <span>
                  The software application is an ode to the classic two-dimensional lid-driven cavity problem, which has been extensively used in the field of CFD to validate and verify numerical methods and codes. The scenario involves a square container or cavity with a fluid inside it, where the top lid of the cavity moves at a constant velocity while the other three walls remain stationary. This lid-driven motion generates a complex flow pattern within the cavity. The top lid moves with a specified velocity, creating a shearing motion in the fluid while the walls of the cavity enforce the <a class="no-slip" href="https://en.wikipedia.org/wiki/No-slip_condition">no-slip condition</a>, meaning the fluid velocity is zero at the walls. The fluid inside the cavity is assumed to be incompressible and governed by the
                  <a class="navier-stokes" href="https://www.goldenstateofmind.com">Navier-Stokes</a> (NS) equations for two-dimensional flow. The Semi-Implicit Method for Pressure-Linked Equations (<a class="simple" href="https://www.goldenstateofmind.com">SIMPLE</a>) algorithm is used to solve the 2D Navier-Stokes (NS) equations to determine the velocity field in a lid-driven cavity."
                </span>
              `;

              grid32[i+1].innerHTML = `
                <div class="box-wrapper" id="box-wrapper">
                  <span class="arrowU">&#8594;</span>
                  <div class="box" id="box">
                    <div class="box__cell" id="box__cell">
                      <span class="arrow--inner" id="arrow--inner">&#8635;</span>
                    </div>
                  </div>
                </div>
              `;

              const height = grid32[i].offsetHeight;
              document.documentElement.style.setProperty('--font-size-integral', `${height}px`);

              // Get the element containing the dynamic text content
              const dynamicContent = grid32[i];

              // Get the height of the dynamic text content
              grid0_height = dynamicContent.clientHeight;

              // Apply the height to the entire row (grid cell)
              //const cell1 = document.getElementById("cell-1");
              const cell2 = grid32[i+1];
              document.documentElement.style.setProperty('--cell0-height', grid0_height + "px");

              //cell1.style.height = textHeight + "px";
              cell2.style.height = grid0_height;
              cell2.style.width = grid0_height + "px";

              setTimeout(() => {
                document.documentElement.style.setProperty('--grid32-tran', 'opacity 0.5s ease-in-out');
                grid32[i].classList.add('fade-in');
                grid32[i+1].classList.add('fade-in');
              }, 200)


              document.documentElement.style.setProperty('--animation-links0', 'color 1s ease-in-out');
              const links = document.querySelectorAll('a');

              setTimeout(() => {
                links.forEach((link) => {
                  if (link.outerText === 'no-slip condition' || link.outerText === 'Navier-Stokes' || link.outerText === 'SIMPLE') {
                    link.style.color = 'rgba(255, 215, 0, 1)';
                  }
                })
              }, 500);

              //let link = document.querySelector('.navier-stokes');
              //link.classList.add('highlight-effect');
              //link = document.querySelector('.simple');
              //link.classList.add('highlight-effect');
              //link = document.querySelector('.no-slip');
              //link.classList.add('highlight-effect');
              //grid32[i].innerHTML = listItems[liCtr];
              //createDivWithLinks(grid32[i], liCtr);
              //navierStokesLinked = true; // Update the flag to indicate linking

              liCtr += 1;

            } else if (i === 2) {
              //grid32[i].innerHTML = listItems[liCtr];
              grid32[i].innerHTML = `
                <span>
                  Many CFD codes have been benchmarked with this problem, which was first introduced by <a class="ghia" href="https://www.sciencedirect.com/science/article/abs/pii/0021999182900584">Ghia, Ghia, and Shin</a> in the Journal of Computational Physics in 1982. Their publication, among others, and more importantly, their datasets, are a standard reference for verifying the accuracy, convergence, and reliability of different numerical methods that are used to solve the Navier-Stokes equations for <a class="incompressible" href="https://en.wikipedia.org/wiki/Incompressible_flow#:~:text=In%20fluid%20mechanics%2C%20or%20more,moves%20with%20the%20flow%20velocity.">incompressible fluid flow</a>. The lid-driven cavity problem remains a fundamental and widely accepted benchmark in the CFD community due to its simplicity in setup, yet its ability to reveal complexities in fluid flow behavior and validate numerical methods in simulating viscous, incompressible flow in a controlled environment.
                </span>
              `;

              pdf.textContent = "Stephen Hodson March 24, 2008 ME608"; // Use textContent for performance reasons

              let paperHeight = paper.offsetHeight;

              const verticalLineZero = document.querySelector('.vertical-line.zero');
              const holes = document.querySelectorAll('.hole');
              //var content = document.getElementById('content');

              // Calculate the horizontal center between the two edges
              const holeTop = (paper.offsetHeight / 2) - (holes[0].offsetHeight / 2);

              // Set the position of hole-1
              holes[0].style.top = `${holeTop}px`;

              // Calculate the distance between the left edge of .paper and the left box-shadow edge of vertical-line.zero
              const paperLeft = paper.getBoundingClientRect().left;
              const verticalLineZeroShadowLeft = verticalLineZero.getBoundingClientRect().left;

              /* NEED TO FIX */
              const center = `${(verticalLineZeroShadowLeft - paperLeft) / 2}`;

              var holeDia = (center / 2) * 0.5;

              const holeLeft = center;

              holes[1].style.width = `${holeDia}px`; holes[1].style.height = `${holeDia}px`;
              holes[1].style.left = `${holeLeft}px`; holes[1].style.top = `${holeTop * (1 / 3)}px`
              holes[0].style.width = `${holeDia}px`; holes[0].style.height = `${holeDia}px`;
              holes[0].style.left = `${holeLeft}px`;
              holes[2].style.width = `${holeDia}px`; holes[2].style.height = `${holeDia}px`;
              holes[2].style.left = `${holeLeft}px`; holes[2].style.top = `${holeTop * (1 + (1 - (1 / 3)))}px`

              //var xy = 1;

              //content.style.fontSize = `${xy * 0.9}vh`;
              //content.style.top = `${xy}%`; content.style.right = `${xy}%`;

              //var pdf = document.createElement('div');
              //pdf.classList.add('pdf'); pdf.id = 'pdf';
              //pdf.style.fontSize = `${xy * 6}vh`;

              //pdf.textContent = 'PDF';

              //paper.appendChild(pdf);

              var top = '';
              let bottomThreshold = paperHeight * 0.9; // 90% of the paper's height
              let iterations = Math.floor((bottomThreshold - top) / 3); // Calculate iterations based on step value 3

              top = 13;
              for (let i = 0; i < iterations; i++) {
                  let el = document.createElement('div');
                  el.className = `horizontal-line line${i}`;
                  el.id = `horizontal-line line${i}`;

                  //may not work
                  el.style.top = top + "%";
                  top += 3;

                  paper.appendChild(el);
              }

              setTimeout(() => {
                grid32[i].classList.add('fade-in');
                grid32[i+1].classList.add('fade-in');
              }, 350 - 150)

              document.documentElement.style.setProperty('--animation-links2', 'color 1s ease-in-out 0.15s');
              const links = document.querySelectorAll('a');

              setTimeout(() => {
                links.forEach((link) => {
                  if (link.outerText === 'Ghia, Ghia, and Shin' || link.outerText === 'incompressible fluid flow') {
                    link.style.color = 'rgba(255, 215, 0, 1)';
                  }
                })
              }, 500);

              liCtr += 1;
            } else if (i === 4) {
              //grid32[i].innerHTML = listItems[liCtr];
              grid32[i].innerHTML = `
              <span>
                Due to their significant computational power, parallel processing capabilities, and large memory capacities, HPC clusters are used to run massive CFD simulations to model intricate fluid flow phenomena accurately. Some notable machines include <a class="hpc" href="https://www.olcf.ornl.gov/summit/">Summit</a> and <a class="hpc" href="https://www.tacc.utexas.edu/systems/frontera/">Frontera</a>. In this case, some Heroku <a class="hpc" href="https://www.heroku.com/dynos">dyno</a>. CFD codes run on HPC clusters have been used design real-world applications such as supersonic aircraft, space shuttles and rockets, and turbomachinery as well as played important roles in automotive industry innovation, weather prediction and climate modeling, and fluid dynamic applications in the biomedical industry. Here is a short video from Cerebras Systems.
              </span>
              `;
              const canvas = document.getElementById('matrixCanvas');
              const ctx = canvas.getContext('2d');

              // Get the element containing the dynamic text content
              const dynamicContent = grid32[4];

              // Get the height of the dynamic text content
              const textHeight = dynamicContent.clientHeight;

              // Set canvas dimensions
              canvas.width = grid0_height;
              //canvas.height = textHeight;

              // Characters to display
              const characters = '01';
              const fontSize = 12;
              const columns = canvas.width / fontSize;

              // Create an array to store the dropping characters
              const drops = [];
              for (let i = 0; i < columns; i++) {
                drops[i] = 1; // Initialize each drop position
              }

              function draw() {
                // Set a semi-transparent background to create a trailing effect
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#0F0'; // Change color if needed
                ctx.font = `${fontSize}px monospace`;

                // Loop through each column to draw characters
                for (let i = 0; i < drops.length; i++) {
                  const text = characters[Math.floor(Math.random() * characters.length)];

                  // Draw the character at this column
                  ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                  // Move the character down
                  drops[i]++;

                  // Reset drop position if it goes out of the screen
                  if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
                    drops[i] = 0;
                  }
                }
              }

              function animateMatrix() {
                requestAnimationFrame(animateMatrix);
                draw();
              }

              animateMatrix();

              setTimeout(() => {
                grid32[i].classList.add('fade-in');
                grid32[i+1].classList.add('fade-in');
              }, 450 - 250)

              document.documentElement.style.setProperty('--animation-links4', 'color 1s ease-in-out 0.25s');
              const links = document.querySelectorAll('a');

              setTimeout(() => {
                links.forEach((link) => {
                  if (link.outerText === 'Summit' || link.outerText === 'Frontera' || link.outerText === 'dyno') {
                    link.style.color = 'rgba(255, 215, 0, 1)';
                  }
                })
              }, 500);

              //setTimeout(() => {
              //  animateMatrix();
              //}, 1000)

              liCtr += 1;

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
                  pdf.style.fontFamily = "Dancing Script, cursive";
                }, spd*1000 - 50)
              })
            }
          }
        }
      }
    });

    wrapper.addEventListener("mouseout", function(event) {
        grid32 = document.querySelectorAll(".grid3x2__cell");

        // Check if the mouse is outside the wrapper
        if (!wrapper.contains(event.relatedTarget)) {
          integralContainer.style.display = "none"; // Close the integral container
          grid32[0].classList.remove('fade-in');
          grid32[1].classList.remove('fade-in');
          grid32[2].classList.remove('fade-in');
          grid32[3].classList.remove('fade-in');
          grid32[4].classList.remove('fade-in');
          grid32[5].classList.remove('fade-in');
          //resetOpacity();
        }
    });

    grid32[3].addEventListener("click", function(event) {
      /* Open PDF */
      const pdfUrl = '/get_pdf'; // Route to fetch the PDF from the Flask backend

      fetch(pdfUrl)
        .then(response => response.blob())
        .then(blob => {
          const pdfObject = document.getElementById('pdfObject');
          pdfObject.setAttribute('data', URL.createObjectURL(blob));
          document.getElementById('pdfPopup').style.display = 'block';

          //const closePDF = document.querySelector(".closePDF");

          ///closePDF.addEventListener("click", function(event) {
          ///  closePdfPopup();
          ///})
        })
        .catch(error => {
          console.error('Error fetching the PDF:', error);
        });

    });

    function closePdfPopup() {
      document.getElementById('pdfPopup').style.display = 'none';
      integralContainer.style.display = 'grid';
    }

    // Check if the click occurred outside the PDF popup
    document.addEventListener('click', function(event) {
      const pdfPopup = document.getElementById('pdfPopup');
      const wrapper = document.querySelector('.wrapper');

      // Check if the clicked element is not within the PDF popup
      if (pdfPopup.style.display === 'block' && !pdfPopup.contains(event.target)) {
        closePdfPopup(); // Close the PDF popup
        // You can add other logic here related to wrapper behavior after closing the PDF popup
      }

      /* const pdfPopup = document.getElementById('pdfPopup');

      // Check if the clicked element is not within the PDF popup
      if (pdfPopup.style.display === 'block' && !pdfPopup.contains(event.target)) {
        closePdfPopup(); // Close the PDF popup
      } */
    });

    var grid0 = document.getElementById('grid0'); // u-momentum
    var grid1 = document.getElementById('grid1'); // v-momentum
    var grid2 = document.getElementById('grid2'); // pressure
    var grid__matrix = document.getElementsByClassName('grid--matrix')[0]; // solver

    const aniPlots = `fadeInText 4s ease-in`;
    const hero400 = document.getElementById('hero Re400 u');

    window.onscroll = function() {
        //console.log(scrollY)
        if (scrollY > 710*0.5) {
            document.documentElement.style.setProperty('--animation-grid00', 'slideRL 2s forwards');
        }
        if (scrollY > 3000*0.65) {
            document.documentElement.style.setProperty('--animation-Gaia400', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia400u', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia400v', aniPlots)
            document.getElementById('figname--400').style.opacity = '1';
            document.documentElement.style.setProperty('--animation-Gaia1000', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia1000u', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia1000v', aniPlots)
            document.getElementById('figname--1000').style.opacity = '1';
        }
        if (scrollY > 3000) {
            document.documentElement.style.setProperty('--animation-Gaia3200', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia3200u', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia3200v', aniPlots)
            document.getElementById('figname--3200').style.opacity = '1';
        }
        if (scrollY > 3000*1.2) {
            document.documentElement.style.setProperty('--animation-Gaia5000', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia5000u', aniPlots)
            document.documentElement.style.setProperty('--animation-Gaia5000v', aniPlots)
            document.getElementById('figname--5000').style.opacity = '1';
            //console.log('Hi', window.getComputedStyle(hero400, null).getPropertyValue('height'))
        }
    }

    var axesArrows = document.getElementsByClassName('arrows');
    var axesText = document.getElementsByClassName('text');

    document.documentElement.style.setProperty('--blinkingBackground0', 'blinkingBackground0 2s infinite');
    document.documentElement.style.setProperty('--blinkingBackground1', 'blinkingBackground1 2s infinite');
    document.documentElement.style.setProperty('--blinkingBackground2', 'blinkingBackground2 2s infinite');

    createGrid({ N: 8, grid: grid0, borderWidth: 1 });
    createGrid({ N: 4, grid: grid1, borderWidth: 2 });
    createGrid({ N: 3, grid: grid2, borderWidth: 3 });
    createGrid({ N: 5, grid: grid__matrix, borderWidth: 3 });

    var arrowPos = {
        w: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); left: calc(0px + (100% / 3 / 2) + 24px + 4px);`, //W
        e: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //E
        n: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //N
        s: `bottom: calc(0px + (100% / 3 / 2) + 24px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //S
        p: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //P
        ee: `top: calc(40px + (100% / 3 / 2) + 24px + 2px);right: calc(0px + (0% / 3 / 2) - 12px - 4px);`, //E, ee
        nne: `top: calc(0px + (100% / 3 / 2) - 12px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //N, nne
        sse: `bottom: calc(0px + (100% / 3 / 2) - 14px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //S, sse
        nn: `top: calc(0px + (0% / 3 / 2) - 12px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //N, nn
        nww: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(30px + 0px);`, //W, nww
        nee: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); right: calc(30px + 0px);`, //E, nee
    };

    var labelPos = {

        w: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (100% / 3 / 2) + 24px + 8px + 8px);`, //w
        e: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 8px);`, //e
        n: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //n
        s: `bottom: calc(0px + (100% / 3 / 2) + 24px - 10px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //s
        nn: `top: calc(0px + (0% / 3 / 2) + 0px + 0px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //nn
        nee: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) + 24px - 10px - 4px);`, //nee
        nww: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (0% / 3 / 2) + 24px + 8px + 12px);`, //
        nne: `top: calc(40px + (0% / 3 / 2) - 0px + 0px - 2px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //nne
        sse: `bottom: calc(0px + (0% / 3 / 2) + 24px - 12px + 0px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //sse
        ee: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) - 24px - 10px + 0px);`, //ee

    };

    var el = document.getElementById('example12');
    var info0 = document.getElementById('example12 info0');
    var info1 = document.getElementById('example12 info1');
    var info2 = document.getElementById('example12 info2');

    var disc = document.getElementsByClassName('discretization');

    var modals = {
        el: el,
        grid0: grid0,
        grid1: grid1,
        grid2: grid2,
        info0: info0,
        info1: info1,
        info2: info2,
    }

    var cls_info = [modals.info0.classList, modals.info1.classList, modals.info2.classList];

    function closeModals(e) {
        //console.log('Click happened for: ' + e.target.id)

        document.getElementById('grid0__cell49').style.pointerEvents = 'all';
        document.getElementById('grid1__cell10').style.pointerEvents = 'all';
        document.getElementById('grid2__cell3').style.pointerEvents = 'all';

        modals.info0.classList.remove('slideRight');
        modals.info0.classList.remove('slideLeft');
        modals.info0.classList.remove('open');
        modals.info1.classList.remove('slideRight');
        modals.info1.classList.remove('slideLeft');
        modals.info1.classList.remove('open');
        modals.info2.classList.remove('slideRight');
        modals.info2.classList.remove('slideLeft');
        modals.info2.classList.remove('open');

        modals.el.classList.remove('open');
        modals.grid0.classList.remove('open');
        modals.grid1.classList.remove('open');
        modals.grid2.classList.remove('open');
        axesArrows[0].classList.remove('open');
        axesArrows[1].classList.remove('open');
        axesArrows[2].classList.remove('open');
        axesText[0].classList.remove('open');
        axesText[1].classList.remove('open');
        document.documentElement.style.setProperty('--animation-axes', 'fadeOutText1 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-textU', 'fadeOutTextU 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-textV', 'fadeOutTextV 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-borderL', 'fadeOutBorderL 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-borderBL', 'fadeOutBorderBL 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-borderB', 'fadeOutBorderB 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-info0', 'fadeOutText1 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-info1', 'fadeOutText1 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-info2', 'fadeOutText1 1.5s ease-out');
        document.documentElement.style.setProperty('--animation-grid0', 'fadeInGrid0 1.5s ease-out');

        /* setTimeout(() => {
            grid0.children[57].style = `border-bottom: 2px solid rgba(207,207,196,1);`;
        }, 1500) */

        var i = 1;
        Array.prototype.forEach.call(modals.info0.children, function(child) {
            setTimeout(function() {
                child.classList.remove("visible");
            }, 50*i)
        }, i++)

        var i = 1;
        Array.prototype.forEach.call(modals.info1.children, function(child) {
            setTimeout(function() {
                child.classList.remove("visible");
            }, 50*i)
        }, i++)

        var i = 1;
        Array.prototype.forEach.call(modals.info2.children, function(child) {
            setTimeout(function() {
                child.classList.remove("visible");
            }, 50*i)
        }, i++)

        setTimeout(() => {
            modals.el.innerHTML = '';
            modals.el.style.visibility = "hidden";
            modals.info0.style.visibility = 'hidden';
            modals.info1.style.visibility = 'hidden';
            modals.info2.style.visibility = 'hidden';
            axesArrows[0].style.visibility = 'hidden';
            axesArrows[1].style.visibility = 'hidden';
            axesArrows[2].style.visibility = 'hidden';
            axesText[0].style.visibility = 'hidden';
            axesText[1].style.visibility = 'hidden';
            grid0.children[48].style = `border-left: 1px dashed rgba(207,207,196,1);
                box-shadow: inset var(--box-shadow1) 0 var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0);
            `;
            grid0.children[56].style = `border-left: 1px dashed rgba(207,207,196,1);
                border-bottom: 1px dashed rgba(207,207,196,1);
                box-shadow: var(--box-shadow1) var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0);
            `;
            grid0.children[57].style = `border-bottom: 1px dashed rgba(207,207,196,1);
                box-shadow: inset 0 var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0);
            `;
        }, 1500)

    };

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {

        document.getElementById('grid0__cell49').style.pointerEvents = 'none';

        let lengths = cls_info.map(a => a.length);
        let idx = lengths.indexOf(Math.max(...lengths));
        //console.log("lengths =", lengths)
        //console.log("lengths.indexOf =", lengths.indexOf(Math.max(...lengths)))
        let length = lengths[idx];

        //console.log(lengths.reduce((a, b) => a + b, 0))
        let clTotal = lengths.reduce((a, b) => a + b, 0);

        if (clTotal > 6) {
            let sideModal = cls_info[idx];
            let side = sideModal[length - 1];

            let sideModalName = sideModal[1];

            if (sideModalName === 'info1') {
                if (side === 'slideLeft') {
                    modals['info2'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info2'].classList.add('slideLeft');
                } else {
                    modals['info1'].classList.add('slideLeft')
                }
            } else if (sideModalName === 'info2') {
                if (side === 'slideLeft') {
                    modals['info1'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info1'].classList.add('slideLeft');
                } else {
                    modals['info2'].classList.add('slideLeft');
                }
            }
        }

        modals.info0.style.visibility = (modals.info0.style.visibility == "visible") ? "hidden" : "visible";
        if (modals.info0.style.visibility == "hidden") { modals.info0.style.visibility = "visible" }

        if (!modals.el.classList.contains('open')) { modals.el.classList.add('open') }

        modals.el.classList.add('open');
        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info0.classList.add('open');

        document.documentElement.style.setProperty('--animation-grid01', 'fadeOutGrid0 1.5s ease-in-out');

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');
        document.documentElement.style.setProperty('--info0-color', 'rgba(207,207,196,0.5)');

        let w = document.getElementsByClassName('w');
        let n = document.getElementsByClassName('n');

        if (w.length === 0 && modals.el.innerHTML === '') {
            let labels = ['wH','eH','nV','sV'];
            let innerHTML = `<span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
                <div class="circle small W">W</div>
                <div class="circle small P">P</div>
                <div class="circle small E">E</div>
                <div class="circle small N">N</div>
                <div class="circle small S">S</div>
                <div class="circle small NE">NE</div>
                <div class="circle small SW">SW</div>
                <div class="circle small NW">NW</div>
                <div class="circle small SE">SE</div>
                <div class="circle small p">p</div>
                <div class="circle small w">u<sub><sub>w</sub></sub></div>
                <div class="circle small e">u<sub><sub>e</sub></sub></div>
                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                <div class="circle small s">v<sub><sub>s</sub></sub></div>
            `;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            toggleAxes();
            toggleInfo( {id: 'P'} );
        } else if (w.length === 0 && n.length > 0) {
            let labels = ['wH','eH'];
            let innerHTML = `
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
                <div class="circle small w">u<sub><sub>w</sub></sub></div>
                <div class="circle small e">u<sub><sub>e</sub></sub></div>

            `;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            toggleInfo( {id: 'P'} );
        } else if (n.length === 0 && w.length > 0) {
            let labels = ['nV','sV'];
            let innerHTML = `
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                <div class="circle small s">v<sub><sub>s</sub></sub></div>
                `;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            toggleInfo( {id: 'P'} );
        } else {
            let labels = [];
            let innerHTML = `<div class="gridP" id="gridP"></div>`;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            toggleInfo( {id: 'P'} );
        }

        var i = 1;
            Array.prototype.forEach.call(modals.info0.children, function(child) {
                setTimeout(function() {
                    child.classList.add("visible");
                }, 500*i)
            }, i++)

        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    document.getElementById("grid1__cell10").addEventListener('click', function(e) {

        document.getElementById('grid1__cell10').style.pointerEvents = 'none';

        let lengths = cls_info.map(a => a.length);
        let idx = lengths.indexOf(Math.max(...lengths));
        let length = lengths[idx];

        let clTotal = lengths.reduce((a, b) => a + b, 0);

        if (clTotal > 6) {
            let sideModal = cls_info[idx];
            let side = sideModal[length - 1];

            let sideModalName = sideModal[1]

            if (sideModalName === 'info0') {

                if (side === 'slideLeft') {
                    modals['info1'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info1'].classList.add('slideLeft');
                } else {
                    modals['info0'].classList.add('slideLeft');
                }
            } else if (sideModalName === 'info1') {
                if (side === 'slideLeft') {
                    modals['info0'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info0'].classList.add('slideLeft');
                } else {
                    modals['info1'].classList.add('slideLeft')
                }

            }
        }

        modals.info2.style.visibility = (modals.info2.style.visibility == "visible") ? "hidden" : "visible";
        if (modals.info2.style.visibility == "hidden") { modals.info2.style.visibility = "visible";}


        if (!modals.el.classList.contains('open')) { modals.el.classList.add('open') }

        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info2.classList.add('open');

        document.documentElement.style.setProperty('--info2-color', 'rgba(119,221,119,0.5)');

        let nn = document.getElementsByClassName('nn');
        let ee = document.getElementsByClassName('ee');
        let e_ = document.getElementsByClassName('e');
        if (ee.length === 0 && modals.el.innerHTML === '') {
            let labels = ['wH','eH','eeH','nneH','sseH'];
            let innerHTML = `<span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridU" id="gridU"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
                <span class="arrow12 ee">&#8594;</span>
                <span class="arrow12 nne">&#8594;</span>
                <span class="arrow12 sse">&#8594;</span>
                <div class="circle small W">W</div>
                <div class="circle small P">P</div>
                <div class="circle small E">E</div>
                <div class="circle small N">N</div>
                <div class="circle small S">S</div>
                <div class="circle small NE">NE</div>
                <div class="circle small SW">SW</div>
                <div class="circle small NW">NW</div>
                <div class="circle small SE">SE</div>
                <div class="circle small p">p</div>
                <div class="circle small w">v<sub><sub>w</sub></sub></div>
                <div class="circle small e">v<sub><sub>e</sub></sub></div>
                <div class="circle small ee">v<sub><sub>ee</sub></sub></div>
                <div class="circle small nne">v<sub><sub>nne</sub></sub></div>
                <div class="circle small sse">v<sub><sub>sse</sub></sub></div>
            `;

            createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            let gridU = document.getElementById('gridU');
            createGrid({ N: 1, grid: gridU, borderWidth: 1 });
            gridU.style.cssText = `top: 50%;
                left: 50%;
                transform: translate(0%, -50%);
                background-color: rgba(119,221,119,0.4)`;

            toggleAxes();
            toggleInfo( {id: 'u'} );
            } else if (ee.length === 0 && (e_.length > 0)) {
                let labels = ['eeH','nneH','sseH'];
                let innerHTML = `
                    <div class="gridU" id="gridU"></div>
                    <span class="arrow12 ee">&#8594;</span>
                    <span class="arrow12 nne">&#8594;</span>
                    <span class="arrow12 sse">&#8594;</span>
                    <div class="circle small ee">v<sub><sub>ee</sub></sub></div>
                    <div class="circle small nne">v<sub><sub>nne</sub></sub></div>
                    <div class="circle small sse">v<sub><sub>sse</sub></sub></div>
                `;

                createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

                let gridU = document.getElementById('gridU');
                createGrid({ N: 1, grid: gridU, borderWidth: 1 });
                gridU.style.cssText = `top: 50%;
                    left: 50%;
                    transform: translate(0%, -50%);
                    background-color: rgba(119,221,119,0.4)`;
                toggleInfo( {id: 'u'} );
            } else if (ee.length === 0 && nn.length > 0) {
                let labels = ['wH','eH','eeH','nneH','sseH'];
                let innerHTML = `
                    <div class="gridU" id="gridU"></div>
                    <span class="arrow12 w">&#8594;</span>
                    <span class="arrow12 e">&#8594;</span>
                    <span class="arrow12 ee">&#8594;</span>
                    <span class="arrow12 nne">&#8594;</span>
                    <span class="arrow12 sse">&#8594;</span>
                    <div class="circle small w">v<sub><sub>w</sub></sub></div>
                    <div class="circle small e">v<sub><sub>e</sub></sub></div>
                    <div class="circle small ee">v<sub><sub>ee</sub></sub></div>
                    <div class="circle small nne">v<sub><sub>nne</sub></sub></div>
                    <div class="circle small sse">v<sub><sub>sse</sub></sub></div>
                `;

                createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

                let gridU = document.getElementById('gridU');
                createGrid({ N: 1, grid: gridU, borderWidth: 1 });
                gridU.style.cssText = `top: 50%;
                    left: 50%;
                    transform: translate(0%, -50%);
                    background-color: rgba(119,221,119,0.4)`;
                toggleInfo( {id: 'u'} );
            }

            var i = 1;
            Array.prototype.forEach.call(modals.info2.children, function(child) {
                setTimeout(function() {
                    child.classList.add("visible");
                }, 500*i)
            }, i++)

        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    document.getElementById("grid2__cell3").addEventListener('click', function(e) {

        document.getElementById('grid2__cell3').style.pointerEvents = 'none';

        let lengths = cls_info.map(a => a.length);
        let idx = lengths.indexOf(Math.max(...lengths));
        let length = lengths[idx];

        let clTotal = lengths.reduce((a, b) => a + b, 0);

        if (clTotal > 6) {

            let sideModal = cls_info[idx];
            let side = sideModal[length - 1];

            let sideModalName = sideModal[1]

            if (sideModalName === 'info0') {
                if (side === 'slideLeft') {
                    modals['info2'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info2'].classList.add('slideLeft');
                } else {
                    modals['info0'].classList.add('slideLeft')
                }
            } else if (sideModalName === 'info2') {
                if (side === 'slideLeft') {
                    modals['info0'].classList.add('slideRight');
                } else if (side === 'slideRight') {
                    modals['info0'].classList.add('slideLeft');
                } else {
                    modals['info2'].classList.add('slideLeft')
                }

            }
        }

        modals.info1.style.visibility = (modals.info1.style.visibility == "visible") ? "hidden" : "visible";
        if (modals.info1.style.visibility == "hidden") { modals.info1.style.visibility = "visible" };


        if (!modals.el.classList.contains('open')) { modals.el.classList.add('open') };

        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info1.classList.add('open');

        document.documentElement.style.setProperty('--info1-color', 'rgba(119,158,203,0.5)');

        let nn = document.getElementsByClassName('nn');
        let ee = document.getElementsByClassName('ee');
        let n = document.getElementsByClassName('n');
        if (nn.length === 0 && modals.el.innerHTML === '') {
            let labels = ['nV','sV','nnV','nwwV','neeV'];
            let innerHTML = `<span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridV" id="gridV"></div>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
                <span class="arrow12 nn">&#8595;</span>
                <span class="arrow12 nww">&#8595;</span>
                <span class="arrow12 nee">&#8595;</span>
                <div class="circle small W">W</div>
                <div class="circle small P">P</div>
                <div class="circle small E">E</div>
                <div class="circle small N">N</div>
                <div class="circle small S">S</div>
                <div class="circle small NE">NE</div>
                <div class="circle small SW">SW</div>
                <div class="circle small NW">NW</div>
                <div class="circle small SE">SE</div>
                <div class="circle small p">p</div>
                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                <div class="circle small s">v<sub><sub>s</sub></sub></div>
                <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            let gridV = document.getElementById('gridV');
            createGrid({ N: 1, grid: gridV, borderWidth: 1 });
            gridV.style.cssText = `top: calc(50% - 80px);
                left: 50%;
                transform: translate(-50%, 0%);
                background-color: rgba(119,158,203,0.4)
            `;

            toggleAxes();
            toggleInfo( {id: 'v'} );
        } else if (nn.length === 0 && n.length > 0) {
            let labels = ['nnV','nwwV','neeV'];
            let innerHTML = `
                <div class="gridV" id="gridV"></div>
                <span class="arrow12 nn">&#8595;</span>
                <span class="arrow12 nww">&#8595;</span>
                <span class="arrow12 nee">&#8595;</span>
                <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridV = document.getElementById('gridV');

            createGrid({ N: 1, grid: gridV, borderWidth: 1 });
            gridV.style.cssText = `top: calc(50% - 80px);
                left: 50%;
                transform: translate(-50%, 0%);
                background-color: rgba(119,158,203,0.4)
            `;
            toggleInfo( {id: 'v'} );
        } else if (nn.length === 0 && ee.length > 0) {
            let labels = ['nV','sV','nnV','nwwV','neeV'];
            let innerHTML = `
                <div class="gridV" id="gridV"></div>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
                <span class="arrow12 nn">&#8595;</span>
                <span class="arrow12 nww">&#8595;</span>
                <span class="arrow12 nee">&#8595;</span>
                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                <div class="circle small s">v<sub><sub>s</sub></sub></div>
                <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridV = document.getElementById('gridV');

            createGrid({ N: 1, grid: gridV, borderWidth: 1 });
            gridV.style.cssText = `top: calc(50% - 80px);
                left: 50%;
                transform: translate(-50%, 0%);
                background-color: rgba(119,158,203,0.4)
            `;
            toggleInfo( {id: 'v'} );
        }

        var i = 1;
        Array.prototype.forEach.call(modals.info1.children, function(child) {
            setTimeout(function() {
                child.classList.add("visible");
            }, 500*i)
        }, i++)

        //document.getElementById("close12").addEventListener('click', function() { closeModal() });
        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    var grid0_cell0 = document.getElementsByClassName('process--grid0 cell0')[0];
    var process__grid1 = document.getElementsByClassName('process--grid1')[0];
    var process__grid2 = document.getElementsByClassName('process--grid2')[0];
    var process__grid3 = document.getElementsByClassName('process--grid3')[0];
    var process__grid4 = document.getElementsByClassName('process--grid4')[0];
    var process__grid5 = document.getElementsByClassName('process--grid5')[0];
    var testline__wrapper = document.getElementsByClassName('testline--wrapper')[0];
    var mdot__wrapper = document.getElementsByClassName('mdot--wrapper')[0];
    var P__wrapper = document.getElementsByClassName('P--wrapper')[0];
    var check__wrapper = document.getElementsByClassName('check--wrapper')[0];
    var correct__wrapper = document.getElementsByClassName('correct--wrapper')[0];
    var iterate__wrapper = document.getElementsByClassName('iterate--wrapper')[0];

    grid0_cell0.addEventListener('mouseenter', function(e) {
        testline__wrapper.style.display = 'block';
        process__grid1.style.display = 'grid';

        process__grid1.addEventListener('mouseenter', function(e) {
            mdot__wrapper.style.display = 'flex';

            process__grid2.addEventListener('mouseenter', function(e) {
                P__wrapper.style.display = 'flex';

                process__grid3.addEventListener('mouseenter', function(e) {
                    check__wrapper.style.display = 'flex';

                    process__grid4.addEventListener('mouseenter', function(e) {
                        correct__wrapper.style.display = 'flex';

                        process__grid5.addEventListener('mouseenter', function(e) {
                            iterate__wrapper.style.display = 'flex';
                        })
                    })


                })
            })
        })
    })

    grid0_cell0.addEventListener('pointerenter', function(e) {
        //process__grid1.style.display = 'grid';
    })

    function createGrid4(params) {

        modals.el.innerHTML = modals.el.innerHTML + params.innerHTML;
        //const str = "hello,how,are,you,today?"
        //const pieces = str.split(/[\s,]+/)
        //console.log(str, pieces)

        let arrows = document.getElementsByClassName('arrow12');
        let labels = document.getElementsByClassName('circle');

        for (let i = 0; i < params.label.length; i++) {
            let dir = params.label[i].slice(0, -1);
            let ori = params.label[i].slice(-1);

            //let id = arrC.slice(-1);
            //console.log(params.label[i].split(/[V, ]+/));
            //console.log(params.label[i].slice(-1), params.label[i].slice(0, -1))

            let divArrow = Array.from(arrows).filter(cl => cl.classList.contains(dir));
            let divLabel = Array.from(labels).filter(cl => cl.classList.contains(dir));
            if (ori === 'H') {
                divArrow[0].style.cssText = arrowPos[dir] + params.animation[0];
                divLabel[0].style.cssText = labelPos[dir];

                divArrow[0].style.color = params.color[1];

                divLabel[0].style.color = params.color[1];
            } else if (ori === 'V') {
                divArrow[0].style.cssText = arrowPos[dir] + params.animation[1];
                divLabel[0].style.cssText = labelPos[dir];
                divArrow[0].style.color = params.color[2];
                divLabel[0].style.color = params.color[2];
            }
        };

        let grid4 = document.getElementById('grid4');
        if (params.id === 'P' && !modals.info1.classList.contains('open') && !modals.info2.classList.contains('open')) {
            createGrid({ N: 3, grid: grid4, borderWidth: 1 });
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.35)`;
        } else if (params.id === 'v' && !modals.info0.classList.contains('open') && !modals.info2.classList.contains('open')) {
            createGrid({ N: 3, grid: grid4, borderWidth: 1 });
        } else if (params.id === 'v' && modals.info0.classList.contains('open')) {
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.35)`;
        } else if (params.id === 'u' && !modals.info0.classList.contains('open') && !modals.info1.classList.contains('open')) {
            createGrid({ N: 3, grid: grid4, borderWidth: 1 });
        } else if (params.id === 'u' && modals.info0.classList.contains('open')) {
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.35)`;
        } else if (params.id === 'P') {
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.35)`;
        }
    };

    function toggleAxes() {
        axesArrows[0].classList.add('open'); axesArrows[1].classList.add('open'); axesArrows[2].classList.add('open');
        document.documentElement.style.setProperty('--animation-axes', 'fadeInText1 1.5s ease-in');
        axesArrows[0].style.visibility = 'visible'; axesArrows[1].style.visibility = 'visible'; axesArrows[2].style.visibility = 'visible';

        axesText[0].classList.add('open'); axesText[1].classList.add('open');
        document.documentElement.style.setProperty('--animation-textU', 'fadeInTextV 1.5s ease-in');
        document.documentElement.style.setProperty('--animation-textV', 'fadeInTextV 1.5s ease-in');
        axesText[0].style.visibility = 'visible'; axesText[1].style.visibility = 'visible';

        document.documentElement.style.setProperty('--animation-borderL', 'fadeInBorderL 1.5s ease-in');
        document.documentElement.style.setProperty('--animation-borderBL', 'fadeInBorderBL 1.5s ease-in');
        document.documentElement.style.setProperty('--animation-borderB', 'fadeInBorderB 1.5s ease-in');
        setTimeout(() => {
            grid0.children[48].style = `border-left: 2px solid rgba(207,207,196,1);
                box-shadow: inset var(--box-shadow1) 0 var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);`;
            grid0.children[56].style = `border-left: 2px solid rgba(207,207,196,1);
                border-bottom: 2px solid rgba(207,207,196,1);
                box-shadow: inset var(--box-shadow1) var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);
            `;
            grid0.children[57].style = `border-bottom: 2px solid rgba(207,207,196,1);
                box-shadow: inset 0 var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);`;
        }, 1500)

    }

    function toggleInfo(params) {
        switch(params.id) {
            case 'P':
                document.documentElement.style.setProperty('--animation-info0', 'fadeInText1 1.5s ease-in');
                break;
            case 'v':
                document.documentElement.style.setProperty('--animation-info1', 'fadeInText1 1.5s ease-in');
                break;
            case 'u':
                document.documentElement.style.setProperty('--animation-info2', 'fadeInText1 1.5s ease-in');
                break;
        }
    }

    const scheme = window.location.protocol == "https:" ? 'wss://' : 'ws://';
    const webSocketUri1 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/getRe'; // flask-socket address in main.py

    const socket1 = new WebSocket(webSocketUri1);
    socket1.onopen = function() {
        console.log(":: Connected to Socket 1 ::")
        socket1.send(JSON.stringify(
            {
                flag: 0,
            }
        ))
    }

    socket1.onmessage = function (e) {
        const newData = JSON.parse(e.data);
        //console.log('newData: ', newData)
        Re = [400,1000,3200,5000];
        var ctxsU = []; var ctxsV = [];
        for (let i = 0; i < 4; i++) {
            ctxsU[i] = document.getElementById(`Re${Re[i]}u`).getContext('2d');
            ctxsV[i] = document.getElementById(`Re${Re[i]}v`).getContext('2d');
        }

        Re400_top = document.getElementById('hero Re400 u')
        //console.log('Hi', window.getComputedStyle(Re400_top, null).getPropertyValue('top'))

        gaiaKeys = Object.keys(newData.Gaia)
        const dataGaia = [
            /* Re400 u and v */
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#77DD77",
                        backgroundColor: "#77DD77",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[0]}`]['u'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#77DD77',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[0]}`]['u']
                    }
                ]
            },
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#779ECB",
                        backgroundColor: "#779ECB",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[0]}`]['v'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#779ECB',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[0]}`]['v'],
                    }
                ]
            },
            /* Re1000 u and v */
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#77DD77",
                        backgroundColor: "#77DD77",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[1]}`]['u'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#77DD77',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[1]}`]['u'],
                    }
                ]
            },
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#779ECB",
                        backgroundColor: "#779ECB",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[1]}`]['v'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#779ECB',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[1]}`]['v'],
                    }
                ]
            },
            /* Re3200 u and v */
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#77DD77",
                        backgroundColor: "#77DD77",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[2]}`]['u'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#77DD77',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[2]}`]['u']
                    }
                ]
            },
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#779ECB",
                        backgroundColor: "#779ECB",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[2]}`]['v'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#779ECB',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[2]}`]['v'],
                    }
                ]
            },
            /* Re5000 u and v */
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#77DD77",
                        backgroundColor: "#77DD77",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[3]}`]['u'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#77DD77',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[3]}`]['u']
                    }
                ]
            },
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#779ECB",
                        backgroundColor: "#779ECB",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd[`${gaiaKeys[3]}`]['v'],
                        showLine: true,
                    },
                    {
                        label: 'Gaia et al.',
                        borderColor: '#779ECB',
                        backgroundColor: '#CFCFC4',
                        borderWidth: 1,
                        pointRadius: 4,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.Gaia[`${gaiaKeys[3]}`]['v'],
                    }
                ]
            }
        ];

        console.log(dataGaia)

        var Re400U = new Chart(ctxsU[0], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'y/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.4,
                        max: 1,
                        title: {
                            display: true,
                            text: 'u/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re400V = new Chart(ctxsV[0], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'x/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.5,
                        max: 0.4,
                        title: {
                            display: true,
                            text: 'v/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re1000U = new Chart(ctxsU[1], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'y/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.6,
                        max: 1,
                        title: {
                            display: true,
                            text: 'u/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re1000V = new Chart(ctxsV[1], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'x/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.6,
                        max: 0.4,
                        title: {
                            display: true,
                            text: 'v/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re3200U = new Chart(ctxsU[2], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'y/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.6,
                        max: 1,
                        title: {
                            display: true,
                            text: 'u/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re3200V = new Chart(ctxsV[2], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'x/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.8,
                        max: 0.6,
                        title: {
                            display: true,
                            text: 'v/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re5000U = new Chart(ctxsU[3], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'y/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.6,
                        max: 1,
                        title: {
                            display: true,
                            text: 'u/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });
        var Re5000V = new Chart(ctxsV[3], {
            //responsive: true,
            type: "scatter",
            data: [],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'x/L',
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1.01,

                        ticks: {
                            color: "#FDFD96",
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            padding: 10,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                    y: {
                        min: -0.8,
                        max: 0.6,
                        title: {
                            display: true,
                            text: 'v/U',
                            color: "#FDFD96",
                        },
                        ticks: {
                            color: "#FDFD96",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            }
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            drawTicks: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                    display: true,
                    }
                }
            },
        });

        gaiaCharts = [Re400U,Re400V,Re1000U,Re1000V,
                        Re3200U,Re3200V,Re5000U,Re5000V];

        for (let i = 0; i < 2*gaiaKeys.length; i++) {
            gaiaCharts[i].data = dataGaia[i];
            gaiaCharts[i].update();
        }
    }

    let tracker = [];
    let row = 5;
    let col = 5;
    let h = 0
    // Loop to initialize 2D array elements.
    for (let i = 0; i < row; i++) {
        tracker[i] = [];
        for (let j = 0; j < col; j++) {
            tracker[i][j] = h++;
        }
    }
    //console.log(tracker);
    //console.log(tracker.map((a, i) => a[i]))

});

function createGrid(input) {

    let N = input.N;
    let grid = input.grid;
    let width = input.borderWidth;

    let arrC = Array.from({length: N}, (_, i) => (N-1)+i*N); let element = arrC.slice(-1);
    let arrR = Array.from({length: N-1}, (_, i) => N**2-N + i);

    for (let i = 0; i < N**2; i++) {
        let div = document.createElement('div');

        div.className = `${grid.className}__cell ${grid.className}__cell${i}`; div.id =`${grid.className}__cell${i}`; div.innerHTML = ``;

        if (!arrC.includes(i) && !arrR.includes(i)) {
            div.style.borderWidth = `${width}px 0 0 ${width}px`; // removes R and B
        }

        if (arrR.includes(i)) {
            div.style.borderWidth = `${width}px 0 ${width}px ${width}px`; // removes R
            //console.log(i)
        }

        if (arrC.includes(i) && i !== element[0]) {
            //console.log(i)
            div.style.borderWidth = `${width}px ${width}px 0 ${width}px`; // removes B
        }

        grid.appendChild(div);

    };

    if (input.grid.className === 'grid--matrix') {

        let tracker = [];
        let row = 5;
        let col = 5;
        let h = 0

        // Loop to initialize 2D array elements
        for (let i = 0; i < row; i++) {
            tracker[i] = [];
            for (let j = 0; j < col; j++) {
                tracker[i][j] = h++;
            }
        }

        let diags = tracker.map((a, i) => a[i])
        //let diags_minor = diags.slice(1,-1)

        let rowID = 0;
        let cells = input.grid.children;
        for (let cell of cells) {
            let id = cell.id;
            //if (typeof id === 'string') {
            //    console.log('is string')
            //}

            let idg = id.match(/\d+/g).map(Number)[0];
            if (idg === 0 || idg === 4) {
                cells[idg].style.setProperty('border-top', '4px solid red');
            }
            if (idg === 20 || idg === 24) {
                cells[idg].style.setProperty('border-bottom', '4px solid red');
            }

            if (diags.slice(1,-1).includes(idg)) {
                cells[idg].innerHTML = `x`;
                cells[idg - 1].innerHTML = `x`;
                cells[idg + 1].innerHTML = `x`;
                cells[idg].style.setProperty('font-style', 'italic');
                cells[idg - 1].style.setProperty('font-style', 'italic');
                cells[idg + 1].style.setProperty('font-style', 'italic');
                tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                tracker[rowID].splice(tracker[rowID].indexOf(idg - 1), 1);
                tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
            } else if (idg === diags[0]) {
                cells[idg].innerHTML = `x`;
                cells[idg + 1].innerHTML = `x`;
                cells[idg].style.setProperty('font-style', 'italic')
                cells[idg + 1].style.setProperty('font-style', 'italic')
                tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
            } else if (idg === diags.slice(-1)[0]) {
                cells[idg].innerHTML = `x`;
                cells[idg - 1].innerHTML = `x`;
                cells[idg].style.setProperty('font-style', 'italic')
                cells[idg - 1].style.setProperty('font-style', 'italic')
                tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                tracker[rowID].splice(tracker[rowID].indexOf(idg - 1), 1);
            }

            for (let i = 0; i < tracker.length; i++) {
                for (let j = 0; j < tracker[i].length; j++) {
                    cells[tracker[i][j]].innerHTML = `0`;
                }
            }

            if (idg % 5 === 0 && idg !== 0) { rowID++ }
        }
    }
};