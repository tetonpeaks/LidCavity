document.addEventListener("DOMContentLoaded", function() {
    const wrapper = document.querySelector(".intro-wrapper");
    const integralContainer = document.querySelector(".integral-container");
    //const bulletList = document.querySelector(".bullet-list");
    const textColumn = document.getElementById("text-column");
    var grid32 = document.querySelectorAll('.grid3x2__cell');

    const paper = document.querySelector('.paper');
    var pdf = document.querySelector('.pdf');
    var spd = 0.5;

    const listItems = [
        "The software application is an ode to the classic two-dimensional lid-driven cavity problem, which has been extensively used in the field of CFD to validate and verify numerical methods and codes. The scenario involves a square container or cavity with a fluid inside it, where the top lid of the cavity moves at a constant velocity while the other three walls remain stationary. This lid-driven motion generates a complex flow pattern within the cavity. The top lid moves with a specified velocity, creating a shearing motion in the fluid while the walls of the cavity enforce the no-slip condition, meaning the fluid velocity is zero at the walls. The fluid inside the cavity is assumed to be incompressible and governed by the Navier-Stokes (NS) equations for two-dimensional flow. The Semi-Implicit Method for Pressure-Linked Equations (SIMPLE) algorithm is used to solve the 2D Navier-Stokes (NS) equations to determine the velocity field in a lid-driven cavity.",
        "Many CFD codes have been benchmarked with this problem, which was first introduced by Ghia, Ghia, and Shin in the Journal of Computational Physics in 1982. Their publication, among others, and more importantly, their datasets, are a standard reference for verifying the accuracy, convergence, and reliability of different numerical methods that are used to solve the Navier-Stokes equations for incompressible fluid flow. The lid-driven cavity problem remains a fundamental and widely accepted benchmark in the CFD community due to its simplicity in setup, yet its ability to reveal complexities in fluid flow behavior and validate numerical methods in simulating viscous, incompressible flow in a controlled environment.",
        "Due to their significant computational power, parallel processing capabilities, and large memory capacities, HPC clusters are used to run massive CFD simulations to model intricate fluid flow phenomena accurately. Some notable machines include Summit and Frontera. In this case, some Heroku dyno. CFD codes run on HPC clusters have been used design real-world applications such as supersonic aircraft, space shuttles and rockets, and turbomachinery as well as played important roles in automotive industry innovation, weather prediction and climate modeling, and fluid dynamic applications in the biomedical industry. Here is a short video from Cerebras Systems.",
    ];

    var navierStokesLinked = false;

    function createDivWithLinks(div, liCtr) {
      //const div = document.getElementById('myDiv');

      const longString = listItems[liCtr];

      const indexNavierStokes = longString.indexOf('Navier-Stokes');

      if (indexNavierStokes !== -1) {
        const beforeNavierStokes = longString.substring(0, indexNavierStokes);
        const afterNavierStokes = longString.substring(indexNavierStokes + 'Navier-Stokes'.length);

        const linkText = "<span><a href='https://www.example.com/navier-stokes'>Navier-Stokes</a></span>";

        const paragraphWithLink = beforeNavierStokes + linkText + afterNavierStokes;

        div.innerHTML = paragraphWithLink;
        navierStokesLinked = true;
      } else {
        div.innerHTML = longString;
      }

      /* const words = longString.split(' ');

      let htmlContent = '';

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Check if the word is "Navier-Stokes" and if it's the first instance
        if (word === 'Navier-Stokes' && !navierStokesLinked) {
          word = `<a href='https://www.example.com/navier-stokes'>${word}</a>`;
          navierStokesLinked = true; // Update the flag to indicate linking
        }

        // Check if the word is "SIMPLE"
        if (word === 'SIMPLE') {
          word = `<a href='https://www.example.com/simple'>${word}</a>`;
        }

        // Add the word (whether modified or not) to the HTML content
        htmlContent += word + ' ';
      }

      div.innerHTML = htmlContent; */

    }

    // Function to delay each row's animation
    function fadeInSequentially(index) {

      const rows = document.querySelectorAll('.grid3x2__cell');

      if (index < rows.length) {
        setTimeout(function() {
          rows[index].classList.add('fade-in');
          fadeInSequentially(index + 1);
        }, 500); // Adjust the delay duration (in milliseconds) between each row's animation
      }
    }

    // Function to reset opacity of rows
    function resetOpacity() {
      const rows = document.querySelectorAll('.grid3x2__cell');
      rows.forEach(row => {
        row.style.opacity = 0;
        row.classList.remove('fade-in'); // Remove the fade-in class if needed
        console.log("hii")
      });
    }

    var grid0_height;

    wrapper.addEventListener("mouseover", function(event) {
      if (event.target.classList.contains('startEffect')) {
        // Toggle the display of the integral-container
        integralContainer.style.display = integralContainer.style.display === "none" ? "grid" : "none";

        // Clear the existing list content
        //bulletList.innerHTML = "";
        // Add multiple lines of random text in the list
        if (integralContainer.style.display === "grid") {
          //resetOpacity();
          navierStokesLinked = false;
          let liCtr = 0;
          for (let i = 0; i < 5; i+=2) {

            var integral = document.querySelector(".integral");
            document.documentElement.style.setProperty('--animation-integral', 'color 0.5s ease-out')
            //integral.classList.add('highlight-effect');

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
                      <span class="arrow--inner">&#8635;</span>
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
            } else if (i === 1) {
              /* grid32[i].innerHTML = `
                <div class="box-wrapper" id="box-wrapper">
                  <span class="arrowU">&#8594;</span>
                  <div class="box" id="box">
                    <div class="box__cell" id="box__cell">
                      <span class="arrow--inner">&#8635;</span>
                    </div>
                  </div>
                </div>
              `;

              const height = grid32[0].offsetHeight;
              document.documentElement.style.setProperty('--font-size-integral', `${height}px`);

              // Get the element containing the dynamic text content
              const dynamicContent = grid32[0];

              // Get the height of the dynamic text content
              grid0_height = dynamicContent.clientHeight;

              // Apply the height to the entire row (grid cell)
              //const cell1 = document.getElementById("cell-1");
              const cell2 = grid32[1];
              document.documentElement.style.setProperty('--cell0-height', grid0_height + "px");

              //cell1.style.height = textHeight + "px";
              cell2.style.height = grid0_height;
              cell2.style.width = grid0_height + "px"; */
            } else if (i === 3) {
              /* grid32[i].innerHTML = `
                <div class="paper">
                  <div class="content" id="content">Stephen Hodson</br>March 24, 2008</br>ME608</div>
                  <div class="vertical-line left zero"></div>
                  <div class="hole hole1"></div>
                  <div class="hole hole0"></div>
                  <div class="hole hole2"></div>
                </div>
              `; */
              /* Old School Paper */

              //const paper = document.querySelector('.paper');

              /* pdf.textContent = "Stephen Hodson March 24, 2008 ME608"; // Use textContent for performance reasons

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

              // NEED TO FIX
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
              } */

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


            } else if (i === 5) {
              /* const canvas = document.getElementById('matrixCanvas');
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

              animateMatrix(); */
            }

            //grid32[i].classList.remove('fade-in');
            //setTimeout(() => {
            //  grid32[i].classList.add('fade-in');
            //}, 500)

            //fadeInSequentially(3);
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
  });


