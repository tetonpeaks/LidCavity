document.addEventListener("DOMContentLoaded", function() {

    document.getElementById('navDropDown').classList.remove('disabled');

    const navbar = document.querySelector(".navbar");

    const navbarHeight = navbar.getBoundingClientRect().top + navbar.offsetHeight;
    const computedStyles = window.getComputedStyle(navbar);
    const borderWidth = parseFloat(computedStyles.getPropertyValue("border-bottom-width"));

    document.querySelector('.dropdown-list').style.top = `${navbarHeight - borderWidth}px`;

    const loginButton = document.getElementById('loginButton');

    var loggedIn = null

    const socketIsUserLoggedIn = io.connect('/is_user_logged_in')

    socketIsUserLoggedIn.on('connect', () => {
        //console.log('Client connected to /is_user_logged_in')
    });

    socketIsUserLoggedIn.emit('message', {
        //flag: `is_user_logged_in`,
    })

    socketIsUserLoggedIn.on('response', (data) => {
        let obj = JSON.parse(data);
        loggedIn = obj.msg
        //console.log('loggedIn: ', loggedIn)
    })

    //const loggedIn = {{ loggedIn|default(False)|lower }};

    /* loginButton.addEventListener('click', function() {
        // Perform logout logic, e.g., redirect to the logout route

        const socketLogout = io.connect('/logout')

        socketLogout.on('connect', () => {
            console.log('Client connected to /logout')
        });

        socketLogout.emit('message', {
            flag: 'logout',
        })

        socketLogout.on('response', (data) => {
            let obj = JSON.parse(data);
            alert(obj.msg);
            window.location.href = loginButton.getAttribute('data-logout-url');
        })

    });

    // update the button text and behavior based on the user's login status
    loginButton.innerHTML = `Logout`; */

    function enableButtons() {
        document.getElementById('welcome').classList.remove('disabled');
        document.getElementById('home').classList.remove('disabled');
        document.getElementById('simulate').classList.remove('disabled');
    }

    enableButtons()

    function addHoverAndFocusStyles(element) {
        element.addEventListener('mouseover', function () {
            element.style.boxShadow = '0px 0px 7.5px rgba(253, 181, 21, 1)';
            element.style.transition = '0.3s ease';
        });

        element.addEventListener('focus', function () {
            element.style.boxShadow = '0px 0px 7.5px rgba(253, 181, 21, 1)';
            element.style.transition = '0.3s ease';
        });

        element.addEventListener('mouseout', function () {
            element.style.boxShadow = 'none';
            element.style.transition = 'none';
        });

        element.addEventListener('blur', function () {
            element.style.boxShadow = 'none';
            element.style.transition = 'none';
        });
    }

    const welcomeLi = document.getElementById('welcome');
    const homeButton = document.getElementById('home');
    const simulateButton = document.getElementById('simulate');

    addHoverAndFocusStyles(welcomeLi);
    addHoverAndFocusStyles(homeButton);
    addHoverAndFocusStyles(simulateButton);
    //addHoverAndFocusStyles(loginButton);

    const logoSim = document.querySelector('.logo-sim');
    const ddCFD = document.querySelector('.dropdown-CFD');

    setTimeout(() => {
        const KNXXX = document.getElementById('KNXXX-text-container');
        const knxxxWidth = KNXXX.offsetWidth;
        const knxxxLeft = KNXXX.offsetLeft;

        ddCFD.style.width = `${knxxxWidth}px`;
        ddCFD.style.left = `${knxxxLeft}px`;
    }, 1000)

    logoSim.addEventListener('mouseover', () => {
        //console.log('add active')
        ddCFD.classList.add('active');
    });

    ddCFD.addEventListener('mouseleave', () => {
        //console.log('remove active')
        ddCFD.classList.remove('active');
    });

    function removeAnimation() {
        document.querySelector('.logo-sim-text').style.animation = 'none';
        document.querySelector('.logo-sim-text').style.boxShadow = '0 0 0.25rem 0 #CEB888';
        document.querySelector('.logo-sim').removeEventListener('mouseover', removeAnimation);
    }

    document.querySelector('.logo-sim').addEventListener('mouseover', removeAnimation);
    document.querySelector('.logo-sim').addEventListener('mouseover', removeAnimation);

    const computedStyle = getComputedStyle(document.documentElement);
    const cellWidth = computedStyle.getPropertyValue('--cell-width');

    const handleVPChange = () => {

        const introWrapper = document.querySelector('.intro-wrapper');
        const introTextContainer = document.querySelector('.intro-text-container');

        const containerHeight = introTextContainer.clientHeight;
        introWrapper.style.height = containerHeight + 'px';

        const containerWidth = introTextContainer.clientWidth;
        document.documentElement.style.setProperty('--intro-text-width', containerWidth + 'px')

    };

    window.addEventListener('resize', handleVPChange);

    handleVPChange();

    const introWrapper = document.querySelector('.intro-wrapper');
    const introTextContainer = document.querySelector('.intro-text-container');
    const introBWrapper = document.querySelector('.intro-b-wrapper');
    const introBTextContainer = document.querySelector('.intro-b-text-container');
    const introCWrapper = document.querySelector('.intro-c-wrapper');
    const introCTextContainer = document.querySelector('.intro-c-text-container');
    const introDWrapper = document.querySelector('.intro-d-wrapper');
    const introDTextContainer = document.querySelector('.intro-d-text-container');
    const introEWrapper = document.querySelector('.intro-e-wrapper');
    const introETextContainer = document.querySelector('.intro-e-text-container');
    const introFWrapper = document.querySelector('.intro-f-wrapper');
    const introFTextContainer = document.querySelector('.intro-f-text-container');
    const fourthWrapper = document.querySelector('.fourth-wrapper');
    const fourthTextContainer = document.querySelector('.fourth-text-container');
    const fourthBWrapper = document.querySelector('.fourth-b-wrapper');
    const fourthBTextContainer = document.querySelector('.fourth-b-text-container');
    const fourthCWrapper = document.querySelector('.fourth-c-wrapper');
    const fourthCTextContainer = document.querySelector('.fourth-c-text-container');
    const fourthCCWrapper = document.querySelector('.fourth-cc-wrapper');
    const fourthCCTextContainer = document.querySelector('.fourth-cc-text-container');
    const fourthDWrapper = document.querySelector('.fourth-d-wrapper');
    const fourthDTextContainer = document.querySelector('.fourth-d-text-container');
    const poopAWrapper = document.querySelector('.poop-a-wrapper');
    const poopATextContainer = document.querySelector('.poop-a-text-container');
    const poopBWrapper = document.querySelector('.poop-b-wrapper');
    const poopBTextContainer = document.querySelector('.poop-b-text-container');
    const poopCWrapper = document.querySelector('.poop-c-wrapper');
    const poopCTextContainer = document.querySelector('.poop-c-text-container');
    const poopDWrapper = document.querySelector('.poop-d-wrapper');
    const poopDTextContainer = document.querySelector('.poop-d-text-container');
    const bottomRow = document.querySelector('.bottom-row');
    const integralContainer = document.querySelector(".integral-container");
    const fourthRow = document.querySelector('.fourth-row');
    const calculusRow = document.querySelector('.calculus-row');
    const calculusOuterWrapper = document.querySelector('.calculus-outer-wrapper');
    const algoOuterWrapper = document.querySelector('.algo-outer-wrapper');
    const proofRow = document.querySelector('.proof-row');
    const shitTextContainer = document.querySelector('.shit-text-container');
    const shitWrapper = document.querySelector('.shit-wrapper');
    const shitBTextContainer = document.querySelector('.shit-b-text-container');
    const shitBWrapper = document.querySelector('.shit-b-wrapper');
    const fignames_Re = document.querySelectorAll('.figname--Re');
    const fignames_vel = document.querySelectorAll('.figname--vel');
    const techstackRow = document.querySelector('.techstack-row');
    const techstackTextContainer = document.querySelector('.techstack-text-container');
    const techstackWrapper = document.querySelector('.techstack-wrapper');
    const techstackBRow = document.querySelector('.techstack-b-row');
    const techstackBTextContainer = document.querySelector('.techstack-b-text-container');
    const techstackBWrapper = document.querySelector('.techstack-b-wrapper');
    const techstackCTextContainer = document.querySelector('.techstack-c-text-container');
    const techstackCWrapper = document.querySelector('.techstack-c-wrapper');
    const techstackDTextContainer = document.querySelector('.techstack-d-text-container');
    const techstackDWrapper = document.querySelector('.techstack-d-wrapper');

    proofRow.style.gridRow = '12';

    startTypeWriter('KNXXX', 'KNXXX');

    var Re400U; var Re400V; var Re1000U; var Re1000V; var Re3200U; var Re3200V; var Re5000U; var Re5000V;

    // adjust wrapper height based on content
    const adjustWrapperHeight = (wrapper, textContainer) => {
        const containerWidth = textContainer.clientWidth;
        document.documentElement.style.setProperty(`--${textContainer.dataset.textWidth}`, `${containerWidth}px`);

        const containerHeight = textContainer.clientHeight;
        wrapper.style.height = `${containerHeight}px`;
    };

    // set up observer for specific wrapper + text container
    const setupObserver = (wrapper, textContainer) => {
        // initial adjustment
        adjustWrapperHeight(wrapper, textContainer);

        // create a MutationObserver to watch for changes in the text container
        const observer = new MutationObserver(() => adjustWrapperHeight(wrapper, textContainer));

        // config object for the observer (observe changes in childList and subtree)
        const observerConfig = {
            childList: true,
            subtree: true,
        };

        // start observing changes in the text container
        observer.observe(textContainer, observerConfig);
    };

    techstackCTextContainer.dataset.textWidth = 'techstack-c-text-width';
    setupObserver(techstackCWrapper, techstackCTextContainer);

    techstackDTextContainer.dataset.textWidth = 'techstack-d-text-width';
    setupObserver(techstackDWrapper, techstackDTextContainer);

    techstackTextContainer.dataset.textWidth = 'techstack-text-width';
    setupObserver(techstackWrapper, techstackTextContainer);

    techstackBTextContainer.dataset.textWidth = 'techstack-b-text-width';
    setupObserver(techstackBWrapper, techstackBTextContainer);

    introTextContainer.dataset.textWidth = 'intro-text-width';
    setupObserver(introWrapper, introTextContainer);

    introBTextContainer.dataset.textWidth = 'intro-b-text-width';
    setupObserver(introBWrapper, introBTextContainer);

    introCTextContainer.dataset.textWidth = 'intro-c-text-width';
    setupObserver(introCWrapper, introCTextContainer);

    introDTextContainer.dataset.textWidth = 'intro-d-text-width';
    setupObserver(introDWrapper, introDTextContainer);

    //introETextContainer.dataset.textWidth = 'intro-e-text-width';
    //setupObserver(introEWrapper, introETextContainer);

    introFTextContainer.dataset.textWidth = 'intro-f-text-width';
    setupObserver(introFWrapper, introFTextContainer);

    fourthTextContainer.dataset.textWidth = 'fourth-text-width';
    setupObserver(fourthWrapper, fourthTextContainer);

    fourthBTextContainer.dataset.textWidth = 'fourth-b-text-width';
    setupObserver(fourthBWrapper, fourthBTextContainer);

    fourthCTextContainer.dataset.textWidth = 'fourth-c-text-width';
    setupObserver(fourthCWrapper, fourthCTextContainer);

    fourthCCTextContainer.dataset.textWidth = 'fourth-cc-text-width';
    setupObserver(fourthCCWrapper, fourthCCTextContainer);

    fourthDTextContainer.dataset.textWidth = 'fourth-d-text-width';
    setupObserver(fourthDWrapper, fourthDTextContainer);

    poopATextContainer.dataset.textWidth = 'poop-a-text-width';
    setupObserver(poopAWrapper, poopATextContainer);

    poopBTextContainer.dataset.textWidth = 'poop-b-text-width';
    setupObserver(poopBWrapper, poopBTextContainer);

    poopCTextContainer.dataset.textWidth = 'poop-c-text-width';
    setupObserver(poopCWrapper, poopCTextContainer);

    poopDTextContainer.dataset.textWidth = 'poop-d-text-width';
    setupObserver(poopDWrapper, poopDTextContainer);

    shitTextContainer.dataset.textWidth = 'shit-text-width';
    setupObserver(shitWrapper, shitTextContainer);

    shitBTextContainer.dataset.textWidth = 'shit-b-text-width';
    setupObserver(shitBWrapper, shitBTextContainer);

    const algoRow = document.querySelector('.algo-row');
    const grid_behind = document.querySelector('.grid-behind');

    grid_behind.style.display = 'none';

    //grid_behind.dataset.textWidth = 'grid__behind-text-width';
    //setupObserver(algoRow, grid_behind);;

    const vhPX = window.innerHeight;

    var grid32 = document.querySelectorAll('.grid3x2__cell');

    const paper = document.querySelector('.paper');
    var pdf = document.querySelector('.pdf');
    var spd = 0.1;

    var arrowInnerTran = 0.5;

    var colorDuration = 0.05;

    const videoPopup = document.getElementById('video-popup');
    const videoId = '5ad9f70ORvQ';

    var animationFrameId;
    var isPaused = true;
    var savedDrops;

    function draw() {
        // set a semi-transparent background to create trailing effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        // Llop through each column to draw characters
        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];

            // draw the character at this column
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // move the character down
            drops[i]++;

            // reset drop position
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
                drops[i] = 0;
            }
        }
    }

    function animateMatrix() {
        //requestAnimationFrame(animateMatrix);
        animationFrameId = requestAnimationFrame(() => animateMatrix());
        //console.log("isPaused: ", isPaused)
        if (!isPaused) {
            draw();
        }
    }

    const canvas = document.getElementById('matrixCanvas');
    var ctx = canvas.getContext('2d');

    canvas.style.width = `${grid0_height}px`;

    const characters = '01';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    var drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1; // initialize drop position
    }

    isPaused = false;
    animateMatrix();
    setTimeout(() => {
        isPaused = true;
        savedDrops = [...drops];
        cancelAnimationFrame(animationFrameId);
    }, 200)

    var grid0_height;

    var isTechStackCWriterOff = true;
    var isTechStackDWriterOff = true;
    var isTechStackWriterOff = true;
    var isTechStackBWriterOff = true;
    var isWhyWriterOff = true;
    var isWhyBWriterOff = true;
    var isWhyCWriterOff = true;
    var isWhyDWriterOff = true;
    var isWhyEWriterOff = true;
    var isWhyFWriterOff = true;
    var isFourthWriterOff = true;
    var isAlgoWriterOff = true;
    var isAlgoBWriterOff = true;
    var isAlgoCWriterOff = true;
    var isAlgoDWriterOff = true;
    var isProofWriterOff = true;
    var isProofBWriterOff = true;
    var isFourthBWriterOff = true;
    var isFourthCWriterOff = true;
    var isFourthCCWriterOff = true;
    var isFourthDWriterOff = true;

    var isBottomRowOpen = false;
    var isCalculusRowOpen = false;

    function startTypeWriter(classList, prefix) {

        //console.log('classList (startTypeWriter): ', classList, 'prefix: ', `.startEffect${prefix}`)

        setTimeout(() => {

            //console.log("circles.keys: ", Object.keys(circles))

            var textContent;
            const text = document.createElement('div');

            const textContainer = document.querySelector(`.${prefix}-text-container`);

            //console.log('prefix: ', prefix, 'classList: ', classList)
            if (classList === "KNXXX") {
                text.classList.add('KNXXX-text');
                text.id = 'dialog';
                textContent = `K5WFF Productions`;
            } else if (classList === "intro-f") {
                text.classList.add('intro-f-text');
                text.id = 'dialog';
                textContent = `This type writer idea came from the popular 1990s TV sitcom, Doogie Howser, M.D. This one goes out to everyone I met along the way!`;
            } else if (classList === "intro-e") {
                text.classList.add('intro-e-text');
                text.id = 'dialog';
                textContent = `The simulator can be accessed from the navigation bar in the upper right. The app is best viewed on newer machines running Google Chrome, Mozilla Firefox, or Safari and can be viewed on desktops, laptops, tablets, and mobile devices in landscape. Both the repository for this application and my LinkedIn profile can also be accessed by hovering over or clicking on the pulsating logo above. Both the home and simulator pages are packed with useful information about this software application as well as my diverse skill sets and how I’ve cohesively rendered it here. If I had enough time and resources, I would implement ML and DL concepts into the codebase and transform it into a personalized learning or adaptive learning platform for academic purposes using sentiment analysis and emotion recognition.`;
            } else if (classList === "intro-d") {
                text.classList.add('intro-d-text');
                text.id = 'dialog';
                textContent = `The app is best viewed in newer machines running Google Chrome, Mozilla Firefox, or Safari. The app can be viewed on desktops, laptops, tablets, and mobile devices.`;
            } else if (classList === "intro-c") {
                text.classList.add('intro-c-text');
                text.id = 'dialog';
                textContent = `I am just scratching the surface in web design, FE/BE services, and SD in general, yet that is what excites me the most about the future. I have intense curiosity and interests in developing software that analyzes stock market dynamics real-time or client services in Fintech. I want to learn more about microservices, data science, data engineering, and database management. I have natural interest in applying my previous academic and professional experiences to new horizons, using my engineering, math, physics, and SD skills to improve any data-driven technology. Whether that is to develop robo-advisor and trading platforms that are efficient and effective for users, dive deep into algorithmic trading, or work on projects that use opinion mining and emotion recognition for customer feedback, brand monitoring/reputation management, market research/competitive analysis, or health care/patient feedback. Software development in general is a giant ocean to me and I just want to go swim in it. I plan to specialize my skill set and certify myself on machine learning from Coursera, finish my certification at Full Stack Open and unpeel pattern recognition and deep learning.`;
            } else if (classList === "intro-b") {
                text.classList.add('intro-b-text');
                text.id = 'dialog';
                textContent = `Web design and communicating globally with ease with useful information has always been an interest of mine so this application represents a grassroots movement for myself. In high school as a hobby back in 2000, I used to make primitive HTML websites to consolidate information for scheduling groups of Everquest players. At Cal, I started to become a mechanical engineer because I liked Top Gun and Apollo 13. At Purdue, I became a mechanical engineer at the highest level, trying to figure out ways to cool these heat generating GPUs and CPUs with carbon nanotubes back then with all that math, physics, systems engineering, nonlinear regression, uncertainty quantification, interdisciplinary projects and publications and yet I have found myself going back in time to figure out where I want to go in the future. Developing this app from scratch has been difficult and tortuous, but extremely rewarding personally and I’ve had the time of my life developing it and releasing it to production. Now I have to maintain it haha. I have learned so much more about frontend/backend web design and computer science than I had imagined when this application was just an idea.`;
            } else if (classList === "techstack-d") {
                text.classList.add('techstack-d-text');
                text.id = 'dialog';
                textContent = `The simulator can be accessed from the navigation bar in the upper right. The app is best viewed on newer machines running Google Chrome, Mozilla Firefox, or Safari and can be viewed on desktops, laptops, tablets, and mobile devices in landscape. Both the repository for this application and my LinkedIn profile can also be accessed by hovering over or clicking on the pulsating logo above. Both the home and simulator pages are packed with useful information about this software application as well as my diverse skill set and how I’ve cohesively rendered it here. If I had enough time and resources, I would implement ML and DL concepts into the codebase and transform it into a personalized learning or adaptive learning platform for academic purposes using sentiment analysis and emotion recognition.`;
            } else if (classList === "techstack-c") {
                text.classList.add('techstack-c-text');
                text.id = 'dialog';
                textContent = `Thank you for visiting. This webpage is a scientific web application and simulator toolkit that runs Computational Fluid Dynamics (CFD) calculations using Fortran code on a Heroku dyno backend and served to you on this frontend. The CFD solver was written in 2008 for a graduate level course project on Numerical Methods in Heat, Mass, and Momentum Transfer that solves the coupled nonlinear Navier-Stokes and continuity equations in two-dimensions. A PDF file under The Why and The Background comprises more detailed information. The problem at hand is the Lid-Driven Cavity Flow Problem, which has and is still used extensively in the field of CFD to validate and verify numerical methods and codes. The solver uses a variant of the Semi-Implicit Method for Pressure-Linked Equations (SIMPLE) algorithm and a third order accurate Quadratic Upwind Interpolation for Convective Kinetics (QUICK) scheme is used to upwind face velocities. The domain is discretized using the finite volume method (FVM) as the technique enforces and preserves the conservation principles and fundamental laws of physics.`;
            } else if (classList === "techstack-b") {
                text.classList.add('techstack-b-text');
                text.id = 'dialog';
                textContent = `Python C/API extension modules of the solver and ODE integrator needed to be built in order to interface the solver and ODE integrator with the Flask web framework on the backend written in Python. In addition, the backend communicates with a MySQL database in order to manage data generated when users run simulations. Functions needed to be written in order to handle saving and retrieving user requests for the velocity field, particle displacements, and storage of the image source files generated by Matplotlib in a Socket.IO route. Socket.IO was chosen for suitability in long-polling environments as well as its room management, event-based communication, and reconnection handling features. The backend serves the frontend written in JavaScript, which controls the HTML5 template and CSS3 styles, creating the interactive and hopefully visually appealing user interface of the web application. The application uses the Mailgun to handle registration and password reset requests (commented for efficient usage, no login, etc). The PDF file is served to you using an Amazon S3 bucket.`;
            } else if (classList === "shit-b") {
                text.classList.add('shit-b-text');
                text.id = 'dialog';
                textContent = `Shown below, a repeat of the validation in 2008 was performed. The velocity fields were resolved for various Reynolds’ numbers on this software application and compared to the datasets of their publication. Finer meshes can improve the congruence between the datasets, particularly at sharp inflections in the velocity profiles.`;
            } else if (classList === "poop-a") {
                text.classList.add('poop-a-text');
                text.id = 'dialog';
                textContent = `The matrices are linear systems of algebraic equations that are solved iteratively using the SIMPLEC algorithm in the CFD solver. SIMPLEC is a variant of the SIMPLE algorithm, which was first proposed by Patanker and Spalding in 1972 and was designed to solve coupled nonlinear Navier-Stokes and continuity equations. By working the math differently, SIMPLEC offers faster convergence at less computational expense.`;
            } else if (classList === "poop-b") {
                text.classList.add('poop-b-text');
                text.id = 'dialog';
                textContent = `The solver starts with an initial guess for the pressure field, <i>P</i> and the <i>u</i> and <i>v</i> velocities are then calculated from the discrete momentum equations. A discrete pressure correction equation derived from continuity uses these velocities to create corrections for the pressure and velocity fields, ultimately enforcing them to satisfy mass conservation. The continuity satisfying terms are iterated continuously until they satisfy both the continuity and momentum equations. Qualitatively, the pressure correction nudges the velocity field to satisfy the fundamental laws governing the lid-driven cavity flow.`;
            } else if (classList === 'poop-c') {
                text.classList.add('poop-c-text');
                text.id = 'dialog';
                textContent = `The solver can under relax the pressure correction by a factor between 0 at each iteration. Larger relaxation values are necessary at higher Reynolds’ numbers to suppress large numerical oscillations that may cause the system to diverge. The Reynolds’ number is a dimensionless quantity in fluid mechanics that represents the ratio between inertial and viscous forces.`;
            } else if (classList === 'poop-d') {
                text.classList.add('poop-d-text');
                text.id = 'dialog';
                textContent = `The matrices are sparse and banded, meaning the majority of elements in the matrix are zero and the non-zero elements are diagonally bounded. Inversion of the matrix can be performed to solve the linear system of equations, but is computationally expensive with <i>O(N<sup>2</sup>)</i>. Therefore, the solver uses a simplified form of Gaussian elimination to solve the linear system of equations called the Thomas algorithm of order <i>O(N)</i>. Better computational performance can be expected with recursive multigrid methods, but is out of the scope of this portfolio project. `;
            } else if (classList === "fourth-d") {
                text.classList.add('fourth-d-text');
                text.id = 'dialog';
                textContent = `By clicking on any of the flashing cell centroids, a closer look at the staggered grid approach with FVM can be viewed.`;
            } else if (classList === "fourth-c") {
                text.classList.add('fourth-c-text');
                text.id = 'dialog';
                textContent = `The grids are staggered to prevent a checkerboarded velocity field, which is a consequence of the calculus and mathematics behind discretizing the partial differential equations of the momentum balances in the <i>x</i> and <i>y</i> directions using FVM on an unstaggered system of grids. A checkerboarded velocity field can persist to the converged solution, which would not be useful to a design engineer. Therefore, a staggered approach was implemented in the CFD solver for this application. With a staggered approach, each scalar quantity, <i>u</i>, <i>v</i>, or <i>P</i> are stored on cell centroids of its own respective grid. On the grid where the continuity equation is solved and pressure is determined from the velocity field, the superposition of the staggered grids over the main computational grid shows that the face velocities in either direction on the main computational grid are the cell centroids of the staggered grids on which primitive forms of the Navier-Stokes equations are solved in both directions. For each cell centroid on the main computational domain, the completed discretization comprises convective and diffusive information about the main cell itself as well as its immediate neighbors and access to information about pressure and the velocity field. The information for each cell centroid on any grid is stored in N x N matrices.`;
            } else if (classList === "fourth-cc") {
                text.classList.add('fourth-cc-text');
                text.id = 'dialog';
                textContent = `In this application, a third order accurate Quadratic Upwind Interpolation for Convective Kinetics (QUICK) scheme is used to upwind those face velocities on their respective momentum grids. QUICK uses a parabolic correction differencing scheme compared to a first-order accurate upwind difference scheme and linear interpolant. The purpose of implementing QUICK into the CFD solver is to mitigate spatial oscillations prevalent in first-order upwind difference and second-order central difference schemes and maintain at least second-order accuracy [3, see PDF].`;
            } else if (classList === "fourth-b") {
                text.classList.add('fourth-b-text');
                text.id = 'dialog';
                textContent = `The computational domain for the lid-driven cavity flow shown below consists of three grids, one of which is the main computational domain on which the continuity equation is solved and where pressure is stored. The two other grids are staggered by a half-width of a cell centroid about the main computational domain in horizontal or vertical directions and represent the domains on which the velocities in the <i>x</i> and <i>y</i> directions are computed from their respective momentum balances. The resultant velocity field is used to determine the pressure by solving the continuity equation on each cell centroid of the main computational domain.`;
            //} else if (classList === "bottom-row") {
            } else if (classList === 'techstack') {
            //} else if (classList.contains('techstack-row')) {
                text.classList.add('techstack-text');
                text.id = 'dialog';
                textContent = `Starting closest to the machine, the tech stack starts with its computational engine, the CFD solver and integrator of the velocity field. The solver was written in Fortran modules (F90) in 2008 and did not undergo major reconstruction. I considered writing the solver in C/C++ and running speed tests, but in the interest of time I decided to move forward with my existing code. In order to generate the positions of the particles over time, the velocity field generated by the solver needs to be integrated over a specified time interval, so I wrote another set of code in F90 to handle the ordinary differential equation (ODE). The code to integrate the velocity field to find position or displacement uses a fourth-order Runge-Kutta numerical method, RK4. In order to deal with the Taylor series of the RK4 method, I borrowed a 2D piecewise linear interpolator distributed under the GNU LGPL license from John Burkardt.`;
            } else if (classList.contains("bottom-row")) {
                text.classList.add('intro-text');
                text.id = 'dialog';
                textContent = `At Purdue University in the ME department, I took a course on CFD. If I span across every scholastic course I have taken beginning in high school and throughout my journey to a doctorate degree, it is this course that I enjoyed the most. CFD combines calculus with physics and high-performance computing (HPC). Developing this software application was simply a portfolio project. A nuanced application through which I could concisely convey to you a small look at what I am capable of based on my past achievements and experience, where I want to go in the future, while writing this in the present. I consider myself to be a complex problem solver based on the rigor that my previous academics, internships, and industry work experiences required of me. I developed this application from almost nothing, just some CFD code I had written in graduate school.`;
            } else if (classList.contains('calculus-row')) {
                text.classList.add('fourth-text');
                text.id = 'dialog';
                textContent = `A primary step to solving the 2D Navier-Stokes pressure-linked equations is to first define a computational domain and discretize the control volumes (CV) spatially using the finite volume method (FVM). FVM is an important spatial discretization method because it gives us the ability to directly derive discrete forms of conservation equations for each CV from the integral form of the governing equations. Consequently, FVM enforces and preserves the conservation principles and fundamental laws inherent in fluid flow problems. Scalar values such as mass, momentum, and energy resulting from CFD solvers that utilize FVM are physically plausible and can be inferred with greater confidence as a fluid flow design engineer for example. This property makes FVM well-suited for simulating physical processes governed by mass, momentum, and energy conservation. Commercially available software packages are readily available and used extensively world-wide. The CFD solver behind FLUENT uses a FVM discretization approach while COMSOL uses another common discretization approach called finite element method (FEA). However, the finite element method does not enforce the governing laws of physics and only attempts to approximate them.`;
            } else if (classList.contains('algo-outer-wrapper')) { // this is the odd ball of the bunch
                text.classList.add('poop-text');
                text.id = 'dialog';
                textContent = `The matrices are linear systems of algebraic equations that are solved iteratively using the SIMPLEC algorithm in the CFD solver. SIMPLEC is a variant of the SIMPLE algorithm, which was first proposed by Patanker and Spalding in 1972 and was designed to solve coupled nonlinear Navier-Stokes and continuity equations. By working the math differently, SIMPLEC offers faster convergence at less computational expense.`;
            } else if (classList.contains('proof-row')) {
                text.classList.add('shit-text');
                text.id = 'dialog';
                textContent = `In 2008, the CFD solver for this software application was validated against the benchmark datasets of Ghia, Ghia, and Shin in their publication in 1982. Validation of any CFD solver is an important step so that the solver’s accuracy and reliability in representing real-world phenomena can be assessed. The solver should be capable of reproducing the behavior observed in physical experiments or well-established benchmark cases.`;

            }
            textContainer.appendChild(text)

            // split text into array of words
            const words = textContent.split(' ');

            let index = 0;
            const textDiv = text;

            function typeWriter() {
                if (index < words.length) {

                    const word = words[index];

                    const link = document.createElement('a');
                    link.setAttribute('target', '_blank');

                    function splitandhighlight(word) {
                        const chars = word.split('').map((char) => {
                            const span = document.createElement('span');
                            span.textContent = char;
                            return span;
                        });

                        chars.forEach((charSpan, index) => {
                            // exclude highlight effect w/o the special character
                            if (word === 'Dynamics,' && word.endsWith(',') && index === word.length - 1) {
                                link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'interpolant.' && word.endsWith('.') && index === word.length -1) {
                                link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'conservation.' && word.endsWith('.') && index === word.length -1) {
                                link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'banded,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'Cal,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'science,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'microservices,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'trading,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'engineering,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'regression,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'quantification,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'Problem,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'Burkardt.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === '13.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'recognition.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'Coursera,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'analysis,' && word.endsWith(',') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'learning.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'right.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else if (word === 'Fintech.' && word.endsWith('.') && index === word.length - 1) {
                                    link.appendChild(document.createTextNode(charSpan.textContent));
                            } else {
                                link.appendChild(charSpan);
                                setTimeout(() => {
                                    charSpan.classList.add('highlight-effect');
                                }, index / index); // speed of highlight effect
                            }
                        });

                        // add space between words
                        textDiv.appendChild(document.createTextNode(' '));
                    }

                    if ((word === 'Numerical' || word === 'Methods' || word === 'Heat,' || word === 'Mass,' || word === 'Momentum' || word === 'Transfer') ||
                        (words[index - 1] === 'Methods' && word === 'in') ||
                        (words[index - 1] === 'Mass,' && word === 'and') && isWhyWriterOff == true) {
                        link.setAttribute('href', 'https://engineering.purdue.edu/online/courses/numerical-methods-heat-mass-momentum-transfer');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'robo-advisor')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Robo-advisor');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Fintech.')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Fintech');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'data' || word === 'science,') && words[index-1] !== 'manage') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Data_science');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'microservices,')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Microservices');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'machine' || word === 'learning') && words[index-1] !== 'personalized' && words[index-1] !== 'adaptive') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Machine_learning');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Cal,')) {
                        link.setAttribute('href', 'https://www.berkeley.edu/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Purdue')) {
                        link.setAttribute('href', 'https://www.purdue.edu/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'PDF')) {
                        link.setAttribute('href', pdfBlobUrl);
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'algorithmic' || word === 'trading,') && words[index+1] !== 'platforms') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Algorithmic_trading');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'upper' || word === 'right.' || word === 'simulator') {
                        link.setAttribute('href', 'https://desolate-bastion-69064.herokuapp.com/simulate');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Computational' || word === 'Fluid' || word === 'Dynamics') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Computational_fluid_dynamics');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'finite' || word === 'volume' || word === 'method') && (words[index-1] !== 'discretization' && words[index-1] !== 'element' && words[index-1] !== 'called' && words[index+1] !== 'element') ) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Finite_volume_method');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'conservation' || word === 'principles' || word === 'and' || word ==='fundamental' || word === 'laws') && (words[index-1] === 'principles' || words[index+1] === 'principles' || words[index-1] === 'conservation' || words[index+1] === 'laws' || words[index-1] === 'fundamental') && (words[index-2] !== 'satisfy' || words[index-3] !== 'satisfy')) {
                        if (isAlgoWriterOff) {
                            link.setAttribute('href', 'https://en.wikipedia.org/wiki/Conservation_law');
                            textDiv.appendChild(link);
                            splitandhighlight(word);
                        }
                    } else if ((word === 'continuity') && (words[index-2] === 'Navier-Stokes')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Continuity_equation');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'partial' || word === 'differential' || word === 'equations') && (words[index-1] === 'the' || words[index-1] === 'partial' || words[index-1] === 'differential')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Partial_differential_equation');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (
                        (word === 'Quadratic' || word === 'Upwind' || word === 'Interpolation' || word === 'Convective' || word === 'Kinetics' || word === 'for') &&
                        (words[index-1] === 'accurate' || words[index-1] === 'Quadratic') || words[index-1] === 'Upwind' || words[index-1] === 'Interpolation' || words[index+1] === 'Kinetics' || words[index-1] === 'Convective' ) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/QUICK_scheme');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'convective') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Convection');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'diffusive') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Diffusion');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'differencing' || word === 'scheme') && (words[index-1] === 'correction' || words[index-1] === 'differencing')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Finite_difference');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'linear' || word === 'interpolant.') && (word[index+1] === 'system' || index[index-2] === 'are')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Interpolation');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Patanker' || word === 'and' || word === 'Spalding') && (words[index-1] === 'by' || words[index-1] === 'Patanker' || words[index+2] == 1972)) {
                        link.setAttribute('href', 'https://www.amazon.com/Numerical-Transfer-Hemisphere-Computational-Mechanics/dp/0891165223');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'pressure' || word ==='correction') && (words[index-1] === 'discrete' || words[index-1] === 'pressure') && (words[index+1] !== 'nudges')) {
                        if (isAlgoCWriterOff == true) {
                            link.setAttribute('href', 'https://en.wikipedia.org/wiki/Pressure-correction_method');
                            textDiv.appendChild(link);
                            splitandhighlight(word);
                        }
                    } else if ((word === 'mass' || word ==='conservation.') && (words[index-1] === 'satisfy' || words[index-2] === 'satisfy')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Conservation_of_mass');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === `${word}` || word ==='numbers') && (words[index-1] === 'higher' || words[index-2] === 'higher')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Reynolds_number');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'sparse') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Sparse_matrix');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'banded,') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Band_matrix');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Inversion') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Invertible_matrix');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Gaussian' || word === 'elimination')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Gaussian_elimination');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Thomas' || word === 'algorithm') && (words[index-1] === 'the' || words[index-1] === 'Thomas')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Gaussian_elimination');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'multigrid') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Multigrid_method');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Ghia,' || word === 'and' || word === 'Shin') && (words[index-1] === 'of' || words[index-1] === 'Ghia,' || words[index-1] === 'and')) {
                        link.setAttribute('href', 'https://www.sciencedirect.com/science/article/abs/pii/0021999182900584');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Fortran' && words[index+1] === 'code') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Fortran');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'C/C++') {
                        link.setAttribute('href', 'https://cplusplus.com/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'ordinary' || word === 'differential' || word === 'equation') && words[index-1] !== 'continuity') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Ordinary_differential_equation');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Runge-Kutta') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Taylor' || word === 'series')) {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Taylor_series');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'John' || word === 'Burkardt.')) {
                        link.setAttribute('href', 'https://people.sc.fsu.edu/~jburkardt/f_src/test_interp_2d/test_interp_2d.html');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Python') {
                        link.setAttribute('href', 'https://www.python.org/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'extension' || word === 'modules') && words[index-1] !== 'Fortran') {
                        link.setAttribute('href', 'https://numpy.org/doc/stable/f2py/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Flask') {
                        link.setAttribute('href', 'https://flask.palletsprojects.com/en/3.0.x/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'MySQL') {
                        link.setAttribute('href', 'https://www.mysql.com/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Matplotlib') {
                        link.setAttribute('href', 'https://matplotlib.org/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Socket.IO' && words[index+1] === 'route.') {
                        link.setAttribute('href', 'https://socket.io/docs/v4/tutorial/introduction');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'JavaScript') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/JavaScript');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'HTML5') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/HTML5');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'CSS3') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/CSS');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Mailgun') {
                        link.setAttribute('href', 'https://www.mailgun.com/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Amazon' || word === 'S3') {
                        link.setAttribute('href', 'https://aws.amazon.com/s3');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === '2000') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Year_2000_problem');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Everquest') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/EverQuest');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Top' || word === 'Gun') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Top_Gun');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Apollo' || word === '13.') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Apollo_13_(film)');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'systems' || word === 'engineering,') && (words[index-1] !== 'data' && words[index-1] !== 'microservices,' && words[index-2] !== 'microservices,' && words[index-1] !== 'my') && words[index-1] !== 'linear') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Systems_engineering');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'data' || word === 'engineering,') && words[index-1] !== 'my' && words[index-1] !== 'manage') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Data_engineering');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'nonlinear' || word === 'regression,') && words[index+1] !== 'Navier-Stokes') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Nonlinear_regression');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'uncertainty' || word === 'quantification,') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Uncertainty_quantification');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Full' || word === 'Stack' || word === 'Open') {
                        link.setAttribute('href', 'https://fullstackopen.com/en/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Doogie' || word === 'Howser,' || word === 'M.D.') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Doogie_Howser,_M.D.');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'control' || word === 'volumes') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Control_volume');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'repository') {
                        link.setAttribute('href', 'https://github.com/tetonpeaks/LidCavity');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'LinkedIn') {
                        link.setAttribute('href', 'https://www.linkedin.com/in/stephen-hodson-880b38a5/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'dyno') {
                        link.setAttribute('href', 'https://www.heroku.com/dynos');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'Semi-Implicit' || word === 'Method' || word === 'for' || word === 'Pressure-Linked' || word === 'Equations') &&
                    (words[index-1] === 'the' || words[index-1] === 'Semi-Implicit' || words[index-1] === 'Method' || words[index-1] === 'for' || words[index-1] === 'Pressure-Linked')
                        && isProofBWriterOff == true)
                    {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/SIMPLE_algorithm');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Lid-Driven' || word === 'Cavity' || word === 'Flow' || word === 'Problem,') {
                        link.setAttribute('href', 'https://www.sciencedirect.com/science/article/abs/pii/0021999182900584');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'Navier-Stokes') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Navier-Stokes_equations');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'high-performance' || word === 'computing') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/High-performance_computing');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === "Coursera,") {
                        link.setAttribute('href', 'https://www.coursera.org/specializations/machine-learning-introduction');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'C/C++') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/C%2B%2B');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'FLUENT') {
                        link.setAttribute('href', 'https://www.ansys.com/products/fluids/ansys-fluent');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    //} else if (word === 'sentiment' || word === 'analysis,') {
                    //    link.setAttribute('href', 'https://en.wikipedia.org/wiki/Sentiment_analysis');
                    //    textDiv.appendChild(link);
                    //    splitandhighlight(word);
                    } else if (word === 'pattern' || word === 'recognition') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Pattern_recognition');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'deep' || word === 'learning.') && words[index-1] !== 'dive') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Deep_learning');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'opinion' || word === 'mining') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Sentiment_analysis');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if ((word === 'emotion' || word === 'recognition') && words[index+1] !== 'recognition.') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/Emotion_recognition');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'COMSOL') {
                        link.setAttribute('href', 'https://www.comsol.com/');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'KNXXX' || word === 'Productions') {
                        splitandhighlight(word);
                        textDiv.appendChild(document.createTextNode(word + ' '));
                    } else {
                        // apply html tags if necessary
                        if (word.includes('<i>') && word.includes('</i>')) {
                            textDiv.innerHTML += word + ' ';
                        } else if (word.includes('<sup>') && word.includes('<sup>')) {
                            textDiv.innerHTML += word + ' ';
                        } else {
                            // append as regular text
                            textDiv.appendChild(document.createTextNode(word + ' '));
                        }
                    }

                    index++;

                    introWrapper.style.setProperty('--intro-text-height', '98%')
                    introWrapper.style.setProperty('--intro-text-width', '99.5%')

                    // set speed
                    if (classList === 'KNXXX') {
                        setTimeout(typeWriter, 100);
                    } else {
                        setTimeout(typeWriter, 50);
                    }
                }
            }

            setTimeout(() => {
                textContainer.style.display = 'flex';
                typeWriter();
            }, 500);

        }, 250);

        if (classList === 'KNXXX') {
            return;
        } else if (classList === 'intro-f'){
            isWhyFWriterOff = false
        } else if (classList === 'intro-e'){
            isWhyEWriterOff = false
        } else if (classList === 'intro-d'){
            isWhyDWriterOff = false
        } else if (classList === 'intro-c') {
            isWhyCWriterOff = false
        } else if (classList === 'intro-b') {
            isWhyBWriterOff = false
        } else if (classList === 'techstack') {
            isTechStackWriterOff = false;
        } else if (classList === 'techstack-c') {
            isTechStackCWriterOff = false;
        } else if (classList === 'techstack-d') {
            isTechStackDWriterOff = false;
        } else if (classList === 'techstack-b') {
            isTechStackBWriterOff = false;
        } else if (classList === 'shit-b') {
            isProofBWriterOff = false;
        } else if (classList === 'poop-a') {
            isAlgoWriterOff = false;
        } else if (classList === 'poop-b') {
            isAlgoBWriterOff = false;
        } else if (classList === 'poop-c') {
            isAlgoCWriterOff = false;
        } else if (classList === 'poop-c') {
            isAlgoDWriterOff = false;
        } else if (classList === 'poop-d') {
            isAlgoDWriterOff = false;
        } else if (classList === 'fourth-d') {
            isFourthDWriterOff = false;
        } else if (classList === 'fourth-c') {
            isFourthCWriterOff = false;
        } else if (classList === 'fourth-cc') {
            isFourthCCWriterOff = false;
        } else if (classList === 'fourth-b') {
            isFourthBWriterOff = false;
        } else if (classList.contains('techstack-row')) {
            isTechStackWriterOff = false;
        } else if (classList.contains('bottom-row')) {
            isWhyWriterOff = false;
        } else if (classList.contains('calculus-row')) {
            isFourthWriterOff = false;
        } else if (classList.contains('algo-row')) {
            isAlgoWriterOff = false;
        } else if (classList.contains('proof-row')) {
            isProofWriterOff = false;
        }
    }

    var deltaY = 0;
    var lastY = 0;

    document.addEventListener('mousemove', (event) => {
        const currentY = event.clientY;

        deltaY = currentY - lastY;

        lastY = currentY;
    });

    if (!localStorage.getItem('pageReloaded')) {
        localStorage.setItem('pageReloaded', true);
        location.reload();

        console.log('Page Reloaded!')
    } else {
        localStorage.removeItem('pageReloaded');
    }

    var newFontSize;
    let htmlFontSize;

    /* this is absolutely key to maintaining positions of divs relative to each other */
    /* and needs to stay outside of algo event listener */
    window.addEventListener('resize', () => {

        //setIntegralIntroPosition();

        const windowWidth = window.innerWidth;
        const algoGridContainer = document.querySelector('.algo-grid-container');
        const cells = algoGridContainer.querySelectorAll('.algo-text');
        const matrix_text_containers = algoGridContainer.querySelectorAll('.matrix-text-container');

        const matrixCells = document.querySelectorAll('.grid--matrix__cell');
        const bracketLs = document.querySelectorAll('.bracket-L');
        const bracketRs = document.querySelectorAll('.bracket-R');
        const AAs = document.querySelectorAll('.AA');
        const AABs = document.querySelectorAll('.AAB');

        const initialFontSizeRem = 1;
        const decreaseFactor = 0.005;

        htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const initialFontSizePx = initialFontSizeRem * htmlFontSize;

        newFontSize = initialFontSizePx;

        const solverWrapper = document.querySelector('.solver--wrapper');
        const introScale = document.querySelector('.calculus-scale');

        const initialMaxWidth = 1920;
        const initialNewGridGapRem = 10;
        const initialStep7GridGapRem = 18;
        //const fontSize = 1.25*parseFloat(getComputedStyle(document.documentElement).fontSize); // Font size in pixels
        const fontSize = 1.5*parseFloat(getComputedStyle(document.documentElement).fontSize); // Font size in pixels

        // convert initial grid gap from rem to pixels
        const initialNewGridGap = initialNewGridGapRem * fontSize;
        const initialStep7GridGap = initialStep7GridGapRem * fontSize;

        const minWidth = 1366; // minimum width at which the grid gap stops decreasing

        const gridGapFactorDefault = '62';
        const gridGapFactorDefaultFloat = parseFloat(gridGapFactorDefault);
        const gridGapFactor = calculateGridGapFactor(windowWidth);

        document.documentElement.style.setProperty('--grid-gap-factor', `${gridGapFactorDefaultFloat}`);

        function calculateGridGapFactor(windowWidth) {
            let factor = gridGapFactorDefault;
            //let factor = 1.75*gridGapFactorDefault - (1366 - windowWidth) * decreaseFactor;
            return factor;
        }

        let newIntroScaleFactor;
        let newIntroTrnY;
        let newCalculusScaleFactor;
        let newNewGridGap;
        let newStep7GridGap;
        let newMatrixGridGap;

        const initialIntroScaleFactor = 1;
        const initialIntroTrnY = 2;
        const initialCalculusScaleFactor = 1;
        const initialScaleFactor = 1;

        const newFontSizeSlope = (initialFontSizePx - initialFontSizePx * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const newGridSlope = (initialNewGridGap - initialNewGridGap * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const step7Slope = (initialStep7GridGap - initialStep7GridGap * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const gridGapSlope = (gridGapFactorDefaultFloat - gridGapFactorDefaultFloat * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const scaleIntroFactorSlope = (initialIntroScaleFactor - initialIntroScaleFactor * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const scaleCalculusFactorSlope = (initialCalculusScaleFactor - initialCalculusScaleFactor * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const scaleFactorSlope = (initialScaleFactor - initialScaleFactor * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);

        const introTrnYSlope = (initialIntroTrnY + 4 * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);

        newNewGridGap = initialNewGridGap;
        newStep7GridGap = initialStep7GridGap;
        newMatrixGridGap = gridGapFactorDefaultFloat;

        document.documentElement.style.setProperty('--grid-gap-factor', `${newMatrixGridGap}`);

        introScale.style.transform = `scale(${initialIntroScaleFactor}) translate(-1rem, ${initialIntroTrnY}rem)`;
        calculusOuterWrapper.style.transform = `scale(${initialCalculusScaleFactor})`;
        solverWrapper.style.transform = 'scale(1)';

        //console.log("windowWidth: ", windowWidth)

        if (windowWidth < 1920) {

            newFontSize = initialFontSizePx - 0.75*newFontSizeSlope * (initialMaxWidth - windowWidth);

            newNewGridGap = initialNewGridGap - 0.75*newGridSlope * (initialMaxWidth - windowWidth);

            newStep7GridGap = initialStep7GridGap - 1.5*step7Slope * (initialMaxWidth - windowWidth);

            newMatrixGridGap = gridGapFactorDefaultFloat - 0.005*gridGapSlope * (initialMaxWidth - windowWidth);

            newScaleFactor = initialScaleFactor - 0.75*scaleFactorSlope * (initialMaxWidth - windowWidth);

            solverWrapper.style.transform = `scale(${newScaleFactor})`;

            newCalculusScaleFactor = initialCalculusScaleFactor - 0.25*scaleCalculusFactorSlope * (initialMaxWidth - windowWidth);

            calculusOuterWrapper.style.transform = `scale(${newCalculusScaleFactor})`;

            newIntroScaleFactor = initialIntroScaleFactor - 0.5*scaleIntroFactorSlope * (initialMaxWidth - windowWidth);

            newIntroTrnY = initialIntroTrnY - 0.75*introTrnYSlope * (initialMaxWidth - windowWidth);

            introScale.style.transform = `scale(${newIntroScaleFactor}) translate(-1rem, ${newIntroTrnY}rem)`;
        } else if (windowWidth < (667 - 200)) {
            newNewGridGap = initialNewGridGap * (minWidth / initialMaxWidth);
            newStep7GridGap = initialStep7GridGap * (minWidth / initialMaxWidth);
        }

        cells.forEach(cell => {
            cell.style.fontSize = `${newFontSize / htmlFontSize}rem`;
        });

        document.documentElement.style.setProperty('--new-grid-grid0-gap', `${newNewGridGap / fontSize}rem`);
        document.documentElement.style.setProperty('--step7-grid-gap', `${newStep7GridGap / fontSize}rem`);
        document.documentElement.style.setProperty('--grid-gap-factor', `${newMatrixGridGap}`);

        const algoOuterWrapperTop = algoOuterWrapper.getBoundingClientRect().top;

        const algoOuterWrapperHeight = document.querySelector('.algo-outer-wrapper').offsetHeight;

        const newGridContainer = document.querySelector('.new-grid-container');
        const step7Container = document.querySelector('.step7-container');

        const newGridGrid0Cells = Array.from(document.querySelector('.new-grid-grid0').children);
        const processWrapper2Cells = Array.from(document.querySelector('.process--grid2').children);

        /* top */
        const processWrapper2 = document.getElementById('process--wrapper2');
        const wrapper2Midpoint = processWrapper2.getBoundingClientRect().top + processWrapper2.offsetHeight / 2;
        const processWrapper2Top = processWrapper2.getBoundingClientRect().top;
        document.documentElement.style.setProperty('--wrapper2-midpoint', `calc(${(processWrapper2Top - algoOuterWrapperTop) + processWrapper2.offsetHeight / 2 - algoOuterWrapperHeight}px - 1rem)`);

        /* height */
        const continuityWrapper = document.getElementById('continuity-wrapper');
        const continuityWrapperMidpoint = continuityWrapper.getBoundingClientRect().top + continuityWrapper.offsetHeight / 2;
        document.documentElement.style.setProperty('--continuitywrapper-midpoint', `${continuityWrapperMidpoint - wrapper2Midpoint}px`);

        newGridGrid0Cells.forEach((newGridGrid0Cell) => {
            newGridGrid0Cell.style.width = `${processWrapper2Cells[0].clientWidth}px`;
        })

        /* top */
        const fieldsWrapper = document.querySelector('.fields-wrapper');
        const fieldsWrapperMidpoint = fieldsWrapper.getBoundingClientRect().top + fieldsWrapper.offsetHeight / 2;
        const fieldsWrapperTop = fieldsWrapper.getBoundingClientRect().top;

        document.documentElement.style.setProperty('--fieldswrapper-midpoint', `calc(${(fieldsWrapperTop - algoOuterWrapperTop) + processWrapper2.offsetHeight / 2 - algoOuterWrapperHeight}px - 1rem)`);

        /* height */
        const updateWrapper = document.querySelector('.update-wrapper');
        const updateWrapperMidpoint = updateWrapper.getBoundingClientRect().top + updateWrapper.offsetHeight / 2;
        document.documentElement.style.setProperty('--updatewrapper-midpoint', `calc(${updateWrapperMidpoint - fieldsWrapperMidpoint}px + 0vw)`);

        /* centering horizontally */
        const gridContainer = document.querySelector('.algo-grid-container');
        const gridContainerMP = gridContainer.offsetLeft + gridContainer.offsetWidth / 2;

        const step7ContainerMP = step7Container.offsetLeft + step7Container.offsetWidth / 2;

        document.documentElement.style.setProperty('--grid-container-mp-outer', `calc(${gridContainerMP - step7ContainerMP}px)`);

        const newGridContainerMP = newGridContainer.offsetLeft + newGridContainer.offsetWidth / 2;

        document.documentElement.style.setProperty('--grid-container-mp-inner', `${gridContainerMP - newGridContainerMP}px`);
    });

    // initial setup on page load
    window.dispatchEvent(new Event('resize'));

    techstackRow.addEventListener('mouseenter', (event) => {
        //if (isCalculusRowOpen == true) {

            let classList = event.target.classList;

            if (isTechStackCWriterOff === true && classList.contains("techstack-row")) {
                document.getElementById('techstack-c-dialog-row').style.display = 'flex';
                document.getElementById('techstack-c-wrapper').style.display = 'block';
                startTypeWriter("techstack-c", 'techstack-c');
                setTimeout(() => {
                    document.querySelector('.techstack-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isTechStackDWriterOff === true) {
                    setTimeout(() => {

                        document.getElementById('techstack-d-dialog-row').style.display = 'flex';
                        document.getElementById('techstack-d-wrapper').style.display = 'block';

                        startTypeWriter('techstack-d', 'techstack-d');

                        setTimeout(() => {
                            document.querySelector('.techstack-d-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                        if (isTechStackWriterOff === true) {
                            setTimeout(() => {
                                document.getElementById('techstack-dialog-row').style.display = 'flex';
                                document.getElementById('techstack-wrapper').style.display = 'block';

                                startTypeWriter('techstack', 'techstack');

                                setTimeout(() => {
                                    document.querySelector('.techstack-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                }, 250)

                                if (isTechStackBWriterOff === true) {
                                    setTimeout(() => {

                                        document.getElementById('techstack-b-dialog-row').style.display = 'flex';
                                        document.getElementById('techstack-b-wrapper').style.display = 'block';
                                        startTypeWriter('techstack-b', 'techstack-b');

                                        setTimeout(() => {
                                            document.querySelector('.techstack-b-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                        }, 250)

                                    }, 11000 - 3000)
                                }
                            }, 9000 - 1000)
                        }
                    }, 10000)
                }

            }

        //}
    })

    const pdfUrl = '/get_pdf';

    var pdfBlobUrl;

    fetch(pdfUrl)
        .then(response => response.blob())
        .then(blob => {
            pdfBlobUrl = URL.createObjectURL(blob);
            const pdfLink = document.getElementById('pdfLink');
            pdfLink.href = pdfBlobUrl;
        })
        .catch(error => {
            console.error('Error fetching the PDF:', error);
        });

    bottomRow.addEventListener("mouseover", function(event) {

        //console.log('event.target.classList: ', event.target.classList)

        let classList = event.target.classList;

        //integralContainer.style.display === 'none';

        if ((classList.contains("bottom-row") || classList.contains("mid-row"))) {
        //if ((classList.contains("bottom-row") || classList.contains("mid-row")) && isTechStackBWriterOff == false) {

            isBottomRowOpen = true;

            //bottomRow.style.borderWidth = `var(--border-grids) 0px var(--border-grids) 0px`;

            //integralIntroWrapper.classList.add('open'); // Commented: Mon Jan 22, 1:19PM (NOT NEEDED)

            if (isWhyWriterOff === true) {
                document.getElementById('intro-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                startTypeWriter(classList, 'intro')

                setTimeout(() => {
                    document.querySelector('.intro-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isWhyBWriterOff === true) {
                    setTimeout(() => {

                        document.getElementById('intro-b-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                        startTypeWriter('intro-b', 'intro-b')

                        setTimeout(() => {
                            document.querySelector('.intro-b-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                        if (isWhyCWriterOff === true) {
                            setTimeout(() => {

                                document.getElementById('intro-c-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                                startTypeWriter('intro-c', 'intro-c')

                                setTimeout(() => {
                                    document.querySelector('.intro-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                }, 250)

                                if (isWhyDWriterOff === true) {
                                    setTimeout(() => {

                                        document.getElementById('intro-d-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                                        startTypeWriter('intro-d', 'intro-d')

                                        setTimeout(() => {
                                            document.querySelector('.intro-d-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                        }, 250)

                                        //if (isWhyEWriterOff === true) {
                                        //    setTimeout(() => {
                                        //        document.getElementById('intro-e-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                                        //        startTypeWriter('intro-e', 'intro-e')
                                        //        setTimeout(() => {
                                        //            document.querySelector('.intro-e-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                        //        }, 250)

                                        if (isWhyFWriterOff === true) {
                                            setTimeout(() => {

                                                document.getElementById('intro-f-wrapper').style.display = 'block'; // Commented: Mon Jan 22, 1:19PM
                                                startTypeWriter('intro-f', 'intro-f')

                                                setTimeout(() => {
                                                    document.querySelector('.intro-f-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                                }, 250)

                                            }, 4000)
                                        }
                                        //    }, 3000)
                                        //}
                                    }, 12000 - 0)
                                }
                            }, 16500 - 5000)
                        }
                    }, 15500 - 6500)
                }
            }

            integralContainer.style.display = 'grid'; // Commented: Mon Jan 22, 1:19PM

            bottomRow.style.paddingTop = '1rem';
            bottomRow.style.paddingBottom = '2rem';

            if (integralContainer.style.display === "grid") {
                navierStokesLinked = false;
                let liCtr = 0;
                for (let i = 0; i < 5; i+=2) {
                    document.documentElement.style.setProperty('--animation-integral', `integralAnimation ${colorDuration * 20}s ease-out`);
                    grid32 = document.querySelectorAll('.grid3x2__cell');

                    if (i === 0) {
                        grid32[i].innerHTML = `
                        <span class="paragraph">
                            The software application is an ode to the classic two-dimensional lid-driven cavity problem, which has been extensively used in the field of CFD to validate numerical methods and codes. The scenario involves a square container or cavity with a fluid inside it, where the top lid of the cavity moves at a constant velocity while the other three walls remain stationary. This lid-driven motion generates a complex flow pattern within the cavity. The top lid moves with a specified velocity, creating a shearing motion in the fluid while the walls of the cavity enforce the <a class="no-slip" href="https://en.wikipedia.org/wiki/No-slip_condition" target="_blank">no-slip condition</a>, meaning the fluid velocity is zero at the walls. The fluid inside the cavity is assumed to be incompressible and governed by the
                            <a class="navier-stokes" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations" target="_blank">Navier-Stokes</a> (NS) equations for two-dimensional flow. The Semi-Implicit Method for Pressure-Linked Equations (<a class="simple" href="https://en.wikipedia.org/wiki/SIMPLE_algorithm#:~:text=In%20computational%20fluid%20dynamics%20(CFD,Method%20for%20Pressure%20Linked%20Equations." target="_blank">SIMPLE</a>) algorithm is used to solve the 2D Navier-Stokes (NS) equations to determine the velocity field in a lid-driven cavity.
                        </span>
                        `;

                        grid32[i].style.boxShadow = `0px 0px var(--gridicons-shad)  rgba(10, 10, 10, 0.85)`;

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

                        let box = document.querySelector('.box');
                        box.style.backgroundColor = `rgba(92,171,176,1)`;

                        grid0_height = grid32[0].offsetHeight;

                        document.documentElement.style.setProperty('--font-size-integral', `${grid0_height}px`);
                        document.documentElement.style.setProperty('--cell0-height', grid0_height + "px");
                        document.documentElement.style.setProperty('arrowU-tranY', `${20 * 100 / vhPX}vh`);

                        setTimeout(() => {
                            document.documentElement.style.setProperty('--grid32-tran', 'opacity 0.5s ease-in-out');
                            grid32[i].classList.add('fade-in');
                            grid32[i+1].classList.add('fade-in');
                        }, 200)

                        liCtr += 1;

                    } else if (i === 2) {
                        grid32[i].innerHTML = `
                            <span class="paragraph">
                                Many CFD codes have been benchmarked with this problem, which was first introduced by <a class="ghia" href="https://www.sciencedirect.com/science/article/abs/pii/0021999182900584" target="_blank">Ghia, Ghia, and Shin</a> in the Journal of Computational Physics in 1982. Their publication, among others, and more importantly, their datasets, are a standard reference for verifying the accuracy, convergence, and reliability of different numerical methods that are used to solve the Navier-Stokes equations for <a class="incompressible" href="https://en.wikipedia.org/wiki/Incompressible_flow#:~:text=In%20fluid%20mechanics%2C%20or%20more,moves%20with%20the%20flow%20velocity." target="_blank">incompressible fluid flow</a>. The lid-driven cavity problem remains a fundamental and widely accepted benchmark in the CFD community due to its simplicity in setup, yet its ability to reveal complexities in fluid flow behavior and validate numerical methods in simulating viscous, incompressible flow in a controlled environment.
                            </span>
                        `;

                        grid32[i].style.boxShadow = `0px 0px var(--gridicons-shad) rgba(10, 10, 10, 0.85)`;

                        paper.style.width = `${grid0_height}px`;

                        pdf.textContent = "Stephen Hodson March 24, 2008 ME608"; // use textContent for performance reasons

                        let paperHeight = paper.offsetHeight;

                        const verticalLineZero = document.querySelector('.vertical-line.zero');
                        const holes = document.querySelectorAll('.hole');

                        // calculate the horizontal center between the two edges
                        const holeTop = (paper.offsetHeight / 2) - (holes[0].offsetHeight / 2);

                        holes[0].style.top = `${holeTop}px`;

                        // calculate the distance between the left edge of .paper and the left box-shadow edge of vertical-line.zero
                        const paperLeft = paper.getBoundingClientRect().left;
                        const verticalLineZeroShadowLeft = verticalLineZero.getBoundingClientRect().left;

                        const center = `${(verticalLineZeroShadowLeft - paperLeft) / 2}`;

                        var holeDia = (center / 2) * 0.5;

                        const holeLeft = center;

                        holes[1].style.width = `${holeDia}px`; holes[1].style.height = `${holeDia}px`;
                        holes[1].style.left = `${holeLeft}px`; holes[1].style.top = `${holeTop * (1 / 3)}px`
                        holes[0].style.width = `${holeDia}px`; holes[0].style.height = `${holeDia}px`;
                        holes[0].style.left = `${holeLeft}px`;
                        holes[2].style.width = `${holeDia}px`; holes[2].style.height = `${holeDia}px`;
                        holes[2].style.left = `${holeLeft}px`; holes[2].style.top = `${holeTop * (1 + (1 - (1 / 3)))}px`

                        var top = '';
                        let bottomThreshold = paperHeight * 0.9;

                        // calculate iterations based on step value 3
                        let iterations = Math.floor((bottomThreshold - top) / 3);

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

                        liCtr += 1;
                    } else if (i === 4) {
                        grid32[i].innerHTML = `
                            <span class="paragraph">
                                Due to their significant computational power, parallel processing capabilities, and large memory capacities, HPC clusters are used to run massive CFD simulations to model intricate fluid flow phenomena accurately. Some notable machines include <a class="hpc" href="https://www.olcf.ornl.gov/summit/" target="_blank">Summit</a> and <a class="hpc" href="https://www.tacc.utexas.edu/systems/frontera/" target="_blank">Frontera</a>. In this case, some Heroku <a class="hpc" href="https://www.heroku.com/dynos" target="_blank">dyno</a>. CFD codes run on HPC clusters have been used in the design of real-world applications such as supersonic aircraft, space shuttles and rockets, and turbomachinery as well as played important roles in automotive industry innovation, weather prediction and climate modeling, and fluid dynamic applications in the biomedical industry.
                            </span>
                        `;

                        grid32[i].style.boxShadow = `0px 0px var(--gridicons-shad) rgba(10, 10, 10, 0.85)`;

                        canvas.style.width = `${grid0_height}px`;

                        // characters to display
                        const characters = '01';
                        const fontSize = 12;
                        const columns = canvas.width / fontSize;

                        setTimeout(() => {
                            grid32[i].classList.add('fade-in');
                            grid32[i+1].classList.add('fade-in');
                        }, 450 - 250)

                        liCtr += 1;

                        paper.addEventListener('mouseover', function(event) {
                            document.documentElement.style.setProperty('--animation-pdf', `shrinkPDF ${spd}s linear`);
                            pdf.style.letterSpacing = 'normal';

                            setTimeout(() => {
                                pdf.textContent = "";
                                document.documentElement.style.setProperty('--animation-pdf', `revealPDF ${spd}s linear`);
                                pdf.textContent = "PDF";
                                pdf.style.letterSpacing = "normal";
                                pdf.style.fontFamily = "Lato, sans-serif";
                                }, spd*1000 - 0)
                            })

                        paper.addEventListener('mouseout', function(event) {
                            document.documentElement.style.setProperty('--animation-pdf', `shrinkPDF ${spd}s linear`);
                            pdf.style.letterSpacing = 'normal';

                            setTimeout(() => {
                            pdf.textContent = "";
                            document.documentElement.style.setProperty('--animation-pdf', `revealPDF ${spd}s linear`);
                            pdf.textContent = "Stephen Hodson March 24, 2008 ME608";
                            pdf.style.letterSpacing = "normal";
                            pdf.style.fontFamily = "Dancing Script, cursive";
                            }, spd*1000 - 0)
                        })
                    }
                }

                for (let j = 0; j < 6; j++) {
                    grid32[j].addEventListener("mouseover", async function() {
                        grid32[j].style.boxShadow = `0px 0px var(--gridicons-shad) rgba(0, 51, 102, 1)`;

                        document.documentElement.style.setProperty(`--animation-links${j}`, `colorIn ${0.1}s ease-out`);

                        var links;

                        links = document.querySelectorAll('a');

                        switch (j) {
                            case 0:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'no-slip condition' || link.outerText === 'Navier-Stokes' || link.outerText === 'SIMPLE') {
                                            link.style.color = 'rgba(253, 181, 21, 1)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 1:
                                let box = document.getElementById('box');
                                let arrowInner = document.querySelector('.arrow--inner');

                                var img_src;

                                const res = await fetch('/static/images/default.txt');

                                if (res.ok) {
                                    img_src = await res.text();

                                    box.style.backgroundImage = `url(${img_src})`;
                                    box.style.backgroundColor = `rgba(10,10,10,0.85)`;
                                    box.style.backgroundSize = 'cover'; // cover the entire container
                                    box.style.backgroundRepeat = 'no-repeat';
                                } else {
                                    console.error('Failed to fetch the image source');
                                }

                                document.documentElement.style.setProperty('--arrowInner-anim', `left ${arrowInnerTran}s ease, top ${arrowInnerTran}s ease`
                                );

                                arrowInner.classList.toggle('streamlineimg');

                                setTimeout(() => {
                                    arrowInner.style.left = `7.5%`;
                                    arrowInner.style.top = `-12%`;
                                }, arrowInnerTran*1000)

                                break;
                            case 2:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'Ghia, Ghia, and Shin' || link.outerText === 'incompressible fluid flow') {
                                            link.style.color = 'rgba(253, 181, 21, 1)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 3:
                                break;
                            case 4:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'Summit' || link.outerText === 'Frontera' || link.outerText === 'dyno') {
                                            link.style.color = 'rgba(253, 181, 21, 1)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 5:
                                break;
                        }
                    })

                    grid32[j].addEventListener("mouseout", function() {
                        grid32[j].style.boxShadow = `0px 0px var(--gridicons-shad)  rgba(10, 10, 10, 0.85)`;

                        document.documentElement.style.setProperty(`--animation-links${j}`, `colorOut ${colorDuration}s ease-in`);
                        const links = document.querySelectorAll('a');

                        switch (j) {
                            case 0:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'no-slip condition' || link.outerText === 'Navier-Stokes' || link.outerText === 'SIMPLE') {
                                            link.style.color = 'rgba(255, 255, 255, 0.4)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 1:
                                let box = document.getElementById('box');
                                box.style.backgroundColor = `rgba(92,171,176,1)`;
                                box.style.backgroundImage = ``;

                                let arrowInner = document.querySelector('.arrow--inner');

                                document.documentElement.style.setProperty('--arrowInner-anim', `left ${arrowInnerTran}s ease, top ${arrowInnerTran}s ease`
                                );
                                arrowInner.classList.toggle('center');

                                setTimeout(() => {
                                    arrowInner.style.left = `0%`;
                                    arrowInner.style.top = `0%`;
                                }, arrowInnerTran*1000)
                            case 2:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'Ghia, Ghia, and Shin' || link.outerText === 'incompressible fluid flow') {
                                            link.style.color = 'rgba(255, 255, 255, 0.4)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 3:
                                break;
                            case 4:
                                setTimeout(() => {
                                    links.forEach((link) => {
                                        if (link.outerText === 'Summit' || link.outerText === 'Frontera' || link.outerText === 'dyno') {
                                            link.style.color = 'rgba(255, 255, 255, 0.4)';
                                        }
                                    })
                                }, colorDuration*1000);
                                break;
                            case 5:
                                break;
                        }
                    })

                    if (j === 3) {
                        grid32[j].addEventListener("click", function(event) {
                            const pdfLink = document.getElementById('pdfLink');

                            const isMobile = /iPad|iPhone/i.test(navigator.userAgent);

                            if (isMobile) {
                                pdfLink.target = '_blank';
                                pdfLink.click();
                            } else {
                                pdfLink.target = '_blank';
                                pdfLink.click();
                            }
                    })
                    } else if (j === 5) {
                        grid32[j].addEventListener("click", function(event) {
                            videoPopup.style.display = 'block';

                            videoPopup.innerHTML = `
                                <span class="close" id="close-video-popup">&times;</span>
                                <iframe id="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                            `;

                            const closeVideoPopup = document.getElementById('close-video-popup');

                            videoPopup.addEventListener("mouseover", function(event) {
                                videoPopup.style.boxShadow = `0px 0px var(--gridicons-shad) rgba(0, 51, 102, 1)`;
                            })
                            videoPopup.addEventListener("mouseout", function(event) {
                                videoPopup.style.boxShadow = `0px 0px var(--gridicons-shad) rgba(10,10,10,0.85)`;
                            })

                            closeVideoPopup.addEventListener('click', function() {
                                videoPopup.innerHTML = ``;
                                videoPopup.style.display = 'none';

                                videoPopup.style.boxShadow = `0px 0px var(--gridicons-shad) rgba(10,10,10,0.85)`;
                            });
                        })
                    }
                }
            }
        }
    })


    grid32[5].addEventListener("mouseover", function(event) {

        grid32[5].style.boxShadow = `0px 0px var(--gridicons-shad) rgba(0, 51, 102, 1)`;

        isPaused = false;
        animateMatrix();
    })
    grid32[5].addEventListener("mouseout", function(event) {

        grid32[5].style.boxShadow = `0px 0px var(--gridicons-shad)  rgba(10, 10, 10, 0.85)`;

        isPaused = true;
        savedDrops = [...drops];
        cancelAnimationFrame(animationFrameId);
    })
    // resume animation
    grid32[5].addEventListener("mouseover", function(event) {
        if (isPaused && savedDrops) {
            // set drops to saved positions
            drops = [...savedDrops];
            resumeAnimation();
        }
    });
    function closePdfPopup() {
        document.getElementById('pdfPopup').style.display = 'none';

        const integralContainer = document.getElementById('integral-container');
        integralContainer.style.display = "grid";

        const textContent = document.getElementById('text-column');
        textContent.style.display = "grid";
    }

    document.addEventListener('click', function(event) {
      const pdfPopup = document.getElementById('pdfPopup');

      if (pdfPopup.style.display === 'block' && !pdfPopup.contains(event.target)) {
        closePdfPopup();
      }
    });

    var grid012Container = document.getElementById('grid012-container');
    var grid0 = document.getElementById('grid0'); // u-momentum
    var grid1 = document.getElementById('grid1'); // v-momentum
    var grid2 = document.getElementById('grid2'); // pressure
    var grid__matrix = document.getElementsByClassName('grid--matrix')[0]; // solver

    const aniPlots = `fadeInText 4s ease-in`;
    const hero400 = document.getElementById('hero Re400 u');

    var axesArrows = document.getElementsByClassName('arrows');
    var axesText = document.getElementsByClassName('text');

    document.documentElement.style.setProperty('--blinkingBackground1', 'blinkingBackground1 2s infinite');
    document.documentElement.style.setProperty('--blinkingBackground0', 'blinkingBackground0 2s infinite');
    document.documentElement.style.setProperty('--blinkingBackground2', 'blinkingBackground2 2s infinite');

    createGridCalcRow({ N: 8, grid: grid0, borderWidth: `var(--calc-grid-rem)`, id: `P` });
    createGridCalcRow({ N: 4, grid: grid1, borderWidth: `var(--calc-grid-rem)`, id: `u` });
    createGridCalcRow({ N: 3, grid: grid2, borderWidth: `var(--calc-grid-rem)`, id: `v` });

    var example12 = document.getElementById('example12');
    var info0 = document.getElementById('example12 info0');
    var info1 = document.getElementById('example12 info1');
    var info2 = document.getElementById('example12 info2');

    var disc = document.getElementsByClassName('discretization');

    var modals = {
        el: example12,
        grid0: grid0,
        grid1: grid1,
        grid2: grid2,
        info0: info0,
        info1: info1,
        info2: info2,
        container: grid012Container,
    }

    var cls_info = [modals.info0.classList, modals.info1.classList, modals.info2.classList];

    // create mouseout event for calculusRow
    calculusRow.addEventListener("mouseover", function(event) {

        let classList = event.target.classList;

        if (classList.contains("calculus-row") && isBottomRowOpen == true) {
            fourthRow.style.display = 'flex';

            calculusOuterWrapper.style.display = 'grid';
            calculusOuterWrapper.classList.toggle('open', true);

            isCalculusRowOpen = true;

            if (!isCalculusRowOpen) { grid1.style.opacity = 0; grid2.style.opacity = 0; }

            if (isFourthWriterOff === true) {
                document.getElementById('fourth-wrapper').style.display = 'block';

                startTypeWriter(classList, 'fourth');

                document.documentElement.style.setProperty('--animation-grid10', 'appearANDtranslate1');
                document.documentElement.style.setProperty('--animation-grid20', 'appearANDtranslate2');
                grid1.style.opacity = 1; grid2.style.opacity = 1;

                setTimeout(() => {
                    document.querySelector('.fourth-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)


                if (isFourthBWriterOff === true) {


                    setTimeout(() => {
                        document.querySelector('.fourth-b-row').style.display = 'flex';
                        document.getElementById('fourth-b-wrapper').style.display = 'block';
                        startTypeWriter('fourth-b', 'fourth-b');

                        setTimeout(() => {
                            document.querySelector('.fourth-b-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                        if (isFourthDWriterOff === true) {


                            setTimeout(() => {
                                document.querySelector('.fourth-d-row').style.display = 'flex';
                                document.getElementById('fourth-d-wrapper').style.display = 'block';

                                document.getElementById('grid0__cell49').style.pointerEvents = 'auto';
                                document.getElementById('grid1__cell10').style.pointerEvents = 'auto';
                                document.getElementById('grid2__cell3').style.pointerEvents = 'auto';

                                startTypeWriter('fourth-d', 'fourth-d');

                                setTimeout(() => {
                                    document.querySelector('.fourth-d-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                }, 250)

                            }, 10000 - 3000)
                        }
                    }, 17000 - 7000)
                }

            }

        }
    });

    var areModalsOpen = false;

    var totalHeight;

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {

        if (isFourthCWriterOff === true) {

            setTimeout(() => {
                document.querySelector('.fourth-c-row').style.display = 'flex';
                document.getElementById('fourth-c-wrapper').style.display = 'block';
                startTypeWriter('fourth-c', 'fourth-c');

                setTimeout(() => {
                    document.querySelector('.fourth-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isFourthCCWriterOff === true) {

                    setTimeout(() => {
                        document.querySelector('.fourth-cc-row').style.display = 'flex';
                        document.getElementById('fourth-cc-wrapper').style.display = 'block';
                        startTypeWriter('fourth-cc', 'fourth-cc');

                        setTimeout(() => {
                            document.querySelector('.fourth-cc-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                    }, 17500 - 5000)
                }

            }, 500)
        }

        grid1.style.opacity = 1; grid2.style.opacity = 1;

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

        modals.container.classList.add('open');
        modals.el.classList.add('open');
        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info0.classList.add('open');

        document.querySelector('.grid012-container').classList.add('open');

        const info0 = document.querySelector('.example12.info0');

        totalHeight = example12.offsetHeight;
        calculusOuterWrapper.style.height = `calc(${totalHeight}px + 14 * var(--cell-width-rem))`;

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');
        document.documentElement.style.setProperty('--info0-color', 'rgba(207,207,196,0.5)');

        let w = document.getElementsByClassName('w');
        let n = document.getElementsByClassName('n');

        if (w.length === 0 && modals.el.innerHTML === '') {
            let labels = ['wH','eH','nV','sV'];
            let innerHTML = `
                <span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
            `;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            toggleAxes();
            toggleInfo( {id: 'P'} );

            console.log('Hi')

            areModalsOpen = true;
        } else if (w.length === 0 && n.length > 0) {
            let labels = ['wH','eH'];
            let innerHTML = `
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
            `;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridP = document.getElementById('gridP');
            createGridCalcRow({ N: 1, grid: gridP, borderWidth: `0.1vw`, id: `gridP` });
            gridP.style.cssText = `top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(207,207,196,0.35)`;

            toggleInfo( {id: 'P'} );
        } else if (n.length === 0 && w.length > 0) {
            let labels = ['nV','sV'];
            let innerHTML = `
                <div class="gridP" id="gridP"></div>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
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

        if (isFourthCWriterOff === true) {

            setTimeout(() => {
                document.querySelector('.fourth-c-row').style.display = 'flex';
                document.getElementById('fourth-c-wrapper').style.display = 'block';
                startTypeWriter('fourth-c', 'fourth-c');

                setTimeout(() => {
                    document.querySelector('.fourth-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isFourthCCWriterOff === true) {

                    setTimeout(() => {
                        document.querySelector('.fourth-cc-row').style.display = 'flex';
                        document.getElementById('fourth-cc-wrapper').style.display = 'block';
                        startTypeWriter('fourth-cc', 'fourth-cc');

                        setTimeout(() => {
                            document.querySelector('.fourth-cc-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                    }, 17500 - 5000)
                }

            }, 500)
        }

        grid1.style.opacity = 1; grid2.style.opacity = 1;

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

        modals.container.classList.add('open');
        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info2.classList.add('open');

        const info1 = document.querySelector('.example12.info1');

        totalHeight = example12.offsetHeight;
        calculusOuterWrapper.style.height = `calc(${totalHeight}px + 14 * var(--cell-width-rem))`;

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');
        document.documentElement.style.setProperty('--info2-color', 'rgba(119,221,119,0.5)');

        let nn = document.getElementsByClassName('nn');
        let ee = document.getElementsByClassName('ee');
        let e_ = document.getElementsByClassName('e');

        if (ee.length === 0 && modals.el.innerHTML === '') {
            let labels = ['wH','eH','eeH','nneH','sseH'];
            let innerHTML = `
                <span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridU" id="gridU"></div>
                <span class="arrow12 w">&#8594;</span>
                <span class="arrow12 e">&#8594;</span>
                <span class="arrow12 ee">&#8594;</span>
                <span class="arrow12 sse">&#8594;</span>
                <span class="arrow12 nne">&#8594;</span>
            `;

            createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            let gridU = document.getElementById('gridU');
            createGridCalcRow({ N: 1, grid: gridU, borderWidth: `0.1vw`, id: `gridU` });
            gridU.style.cssText = `top: 50%;
                left: 0%;
                transform: translate(150%, -50%);
                background-color: rgba(119,221,119,0.4)`;

            toggleAxes();
            toggleInfo( {id: 'u'} );

            areModalsOpen = true;
        } else if (ee.length === 0 && (e_.length > 0)) {
            let labels = ['eeH','nneH','sseH'];
            let innerHTML = `
                <div class="gridU" id="gridU"></div>
                <span class="arrow12 ee">&#8594;</span>
                <span class="arrow12 nne">&#8594;</span>
                <span class="arrow12 sse">&#8594;</span>
            `;

            createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridU = document.getElementById('gridU');
            createGridCalcRow({ N: 1, grid: gridU, borderWidth: `0.1vw`, id: `gridU` });
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
            `;

            createGrid4( {id: 'u', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridU = document.getElementById('gridU');
            createGridCalcRow({ N: 1, grid: gridU, borderWidth: `0.1vw`, id: `gridU` });
            gridU.style.cssText = `top: 50%;
                left: 0%;
                transform: translate(150%, -50%);
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

        if (isFourthCWriterOff === true) {

            setTimeout(() => {
                document.querySelector('.fourth-c-row').style.display = 'flex';
                document.getElementById('fourth-c-wrapper').style.display = 'block';
                startTypeWriter('fourth-c', 'fourth-c');

                setTimeout(() => {
                    document.querySelector('.fourth-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isFourthCCWriterOff === true) {

                    setTimeout(() => {
                        document.querySelector('.fourth-cc-row').style.display = 'flex';
                        document.getElementById('fourth-cc-wrapper').style.display = 'block';
                        startTypeWriter('fourth-cc', 'fourth-cc');

                        setTimeout(() => {
                            document.querySelector('.fourth-cc-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)

                    }, 17500 - 5000)
                }

            }, 500)
        }

        grid1.style.opacity = 1; grid2.style.opacity = 1;

        document.getElementById('grid2__cell3').style.pointerEvents = 'none';

        document.documentElement.style.setProperty('--animation-integral', `integralAnimation ${colorDuration * 20}s ease-out`);

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

        modals.container.classList.add('open');
        modals.grid0.classList.add('open');
        modals.grid1.classList.add('open');
        modals.grid2.classList.add('open');
        modals.info1.classList.add('open');

        const info2 = document.querySelector('.example12.info2');

        totalHeight = example12.offsetHeight;
        calculusOuterWrapper.style.height = `calc(${totalHeight}px + 14 * var(--cell-width-rem))`;

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');
        document.documentElement.style.setProperty('--info1-color', 'rgba(119,158,203,0.5)');

        let nn = document.getElementsByClassName('nn');
        let ee = document.getElementsByClassName('ee');
        let n = document.getElementsByClassName('n');
        if (nn.length === 0 && modals.el.innerHTML === '') {
            let labels = ['nV','sV','nnV','nwwV','neeV'];
            let innerHTML = `
                <span class="close12" id="close12">&times;</span>
                <div class="grid4" id="grid4"></div>
                <div class="gridV" id="gridV"></div>
                <span class="arrow12 n">&#8595;</span>
                <span class="arrow12 s">&#8595;</span>
                <span class="arrow12 nn">&#8595;</span>
                <span class="arrow12 nww">&#8595;</span>
                <span class="arrow12 nee">&#8595;</span>
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
            modals.el.style.visibility = (modals.el.style.visibility == "visible") ? "hidden" : "visible";
            modals.el.classList.add('open');

            let gridV = document.getElementById('gridV');
            createGridCalcRow({ N: 1, grid: gridV, borderWidth: `0.1vw`, id: `gridV` });
            gridV.style.cssText = `top: 0;
                left: 50%;
                transform: translate(-50%, 50%);
                background-color: rgba(119,158,203,0.4)
            `;

            toggleAxes();
            toggleInfo( {id: 'v'} );

            areModalsOpen = true;
        } else if (nn.length === 0 && n.length > 0) {
            let labels = ['nnV','nwwV','neeV'];
            let innerHTML = `
                <div class="gridV" id="gridV"></div>
                <span class="arrow12 nn">&#8595;</span>
                <span class="arrow12 nww">&#8595;</span>
                <span class="arrow12 nee">&#8595;</span>
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridV = document.getElementById('gridV')
            createGridCalcRow({ N: 1, grid: gridV, borderWidth: `0.1vw`, id: `gridV` });
            gridV.style.cssText = `top: 0;
                left: 50%;
                transform: translate(-50%, 50%);
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
            `;

            createGrid4( {id: 'v', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );

            let gridV = document.getElementById('gridV');

            createGridCalcRow({ N: 1, grid: gridV, borderWidth: `0.1vw`, id: `gridV` });
            gridV.style.cssText = `top: 0;
                left: 50%;
                transform: translate(-50%, 50%);
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

        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    function createGrid4(params) {

        modals.el.innerHTML = modals.el.innerHTML + params.innerHTML;
        //const str = "hello,how,are,you,today?"
        //const pieces = str.split(/[\s,]+/)
        //console.log(str, pieces)

        let subscripts = params.label;

        let grid4 = document.getElementById('grid4');

        if (params.id === 'P' && areModalsOpen === false) {
            createGrid4CalcRow({ N: 3, grid: grid4, borderWidth: `var(--calc-grid-rem)`, id: params.id, areModalsOpen: areModalsOpen });
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.4)`;
        } else if (params.id === 'P' && areModalsOpen === true) {
            subscripts.forEach((subscript) => {
                let circle = document.querySelector(`.circle.small.${subscript.slice(0,-1)}`);
                if (!circle) { showLabel(params.id, subscript); }
            });
            document.getElementById('grid4__cell4').style.backgroundColor = `rgba(207,207,196,0.4)`;
        } else if (params.id === 'v' && areModalsOpen === false) {
            createGrid4CalcRow({ N: 3, grid: grid4, borderWidth: `0.2vw`, id: params.id, areModalsOpen: areModalsOpen });
        } else if (params.id === 'v' && areModalsOpen === true) {
            subscripts.forEach((subscript) => {
                let circle = document.querySelector(`.circle.small.${subscript.slice(0,-1)}`);
                if (!circle) {
                    showLabel(params.id, subscript);
                }
            });
        } else if (params.id === 'u' && areModalsOpen === false) {
            createGrid4CalcRow({ N: 3, grid: grid4, borderWidth: `0.2vw`, id: params.id, areModalsOpen: areModalsOpen });
        } else if (params.id === 'u' && areModalsOpen === true) {
            subscripts.forEach((subscript) => {
                let circle = document.querySelector(`.circle.small.${subscript.slice(0,-1)}`);
                if (!circle) {
                    showLabel(params.id, subscript);
                }
            });
        }

        let arrows = document.getElementsByClassName('arrow12');
        let labels = document.getElementsByClassName('circle'); //console.log(": ", labels)

        for (let i = 0; i < params.label.length; i++) {
            let dir = params.label[i].slice(0, -1);
            let ori = params.label[i].slice(-1);

            //let id = arrC.slice(-1);
            //console.log(params.label[i].split(/[V, ]+/));
            //console.log(params.label[i].slice(-1), params.label[i].slice(0, -1))

            let divArrow = Array.from(arrows).filter(cl => cl.classList.contains(dir));
            let divLabel = Array.from(labels).filter(cl => cl.classList.contains(dir));

            if (ori === 'H') {
                divArrow[0].style.cssText = params.animation[0];
                divArrow[0].style.color = params.color[1];
                divLabel[0].style.color = params.color[1];
            } else if (ori === 'V') {
                divArrow[0].style.cssText = params.animation[1];
                divArrow[0].style.color = params.color[2];
                divLabel[0].style.color = params.color[2];
            }
        };
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
            grid0.children[48].style = `
                border-left: var(--calc-grid-rem) solid rgba(207,207,196,1);
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                box-shadow: inset var(--box-shadow1) 0 var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);
                border-right: 0; border-bottom: 0;
            `;
            grid0.children[56].style = `
                border-left: var(--calc-grid-rem) solid rgba(207,207,196,1);
                border-bottom: var(--calc-grid-rem) solid rgba(207,207,196,1);
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                box-shadow: inset var(--box-shadow1) var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);
                height: calc(var(--cell-width-rem) + var(--calc-grid-rem));
                border-right: 0;
            `;
            grid0.children[57].style = `
                border-bottom: var(--calc-grid-rem) solid rgba(207,207,196,1);
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-left: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                box-shadow: inset 0 var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,1);
                height: calc(var(--cell-width-rem) + var(--calc-grid-rem));
                border-right: 0;
            `;
        }, 1500)

    };

    function toggleInfo(params) {
        switch(params.id) {
            case 'P':
                document.documentElement.style.setProperty('--animation-info0', 'fadeInText1 1.5s ease-in');
                document.documentElement.style.setProperty('--animation-math0', `mathInAnimation ${colorDuration * 40}s ease-out ${1.25}s`);
                break;
            case 'v':
                document.documentElement.style.setProperty('--animation-info1', 'fadeInText1 1.5s ease-in');
                document.documentElement.style.setProperty('--animation-math1', `mathInAnimation ${colorDuration * 40}s ease-out ${1.25}s`);
                break;
            case 'u':
                document.documentElement.style.setProperty('--animation-info2', 'fadeInText1 1.5s ease-in');
                document.documentElement.style.setProperty('--animation-math2', `mathInAnimation ${colorDuration * 40}s ease-out ${1.25}s`);
                break;
        }

    };

    function closeModals(e) {
        //console.log('Click happened for: ' + e.target.id)

        grid1.style.opacity = 1; grid2.style.opacity = 1;

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

        modals.container.classList.remove('open');
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
        document.documentElement.style.setProperty('--animation-math0', `colorOut ${colorDuration * 40}s ease-in`);
        document.documentElement.style.setProperty('--animation-math1', `colorOut ${colorDuration * 40}s ease-in`);
        document.documentElement.style.setProperty('--animation-math2', `colorOut ${colorDuration * 40}s ease-in`);

        calculusOuterWrapper.style.height = `calc(${totalHeight}px - 8 * var(--cell-width-rem))`;

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

            grid0.children[48].style = `
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-left: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                /* box-shadow: inset var(--box-shadow1) 0 var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0); */
                border-right: 0; border-bottom: 0;
            `;
            grid0.children[56].style = `
                border-left: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-bottom: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                /* box-shadow: var(--box-shadow1) var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0); */
                height: calc(var(--cell-width-rem) + var(--calc-grid-rem));
                border-right: 0;
            `;
            grid0.children[57].style = `
                border-top: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-bottom: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                border-left: var(--calc-grid-rem) dashed rgba(207,207,196,1);
                /* box-shadow: inset 0 var(--box-shadow0) var(--box-shadow1) var(--box-shadow0) rgba(207,207,196,0); */
                border-right: 0;
                height: calc(var(--cell-width-rem) + var(--calc-grid-rem));
            `;
        }, 1500)

        areModalsOpen = false;
    };

    if (navigator.userAgent.indexOf("Firefox") != -1) {
        document.querySelector('.integral-intro-wrapper mi').style.fontSize = '38rem';
    } else {
        document.querySelector('.integral-intro-wrapper mi').style.fontSize = 'calc(44*var(--cell-width-rem))';
    }

    let isAlgoWrapperOpen = false;

    const algoGridContainer = document.querySelector('.algo-grid-container');

    algoGridContainer.style.height = '0px';

    // mouseout event for algoOuterWrapper
    algoOuterWrapper.addEventListener("mouseover", function(event) {

        let classList = event.target.classList;

        if (classList.contains("algo-outer-wrapper") && isCalculusRowOpen == true) {

            grid_behind.style.display = 'grid';

            if (!isAlgoWrapperOpen) {

                isAlgoWrapperOpen = true;

                algoGridContainer.style.height = `21.4375rem`;

                var grid__matrices = Array.from(document.getElementsByClassName('grid--matrix'));

                const gridElements = document.querySelectorAll(
                    '.fields-wrapper, ' +
                    '.process--grid2.cell0, ' +
                    '.process--grid2.cell1, ' +
                    '.massflow-wrapper, ' +
                    '.pressure-wrapper, ' +
                    '.continuity-wrapper, ' +
                    '.correct-wrapper, ' +
                    '.update-wrapper');


                function fadeElementsInSuccession(index) {

                    if (index < gridElements.length) {
                        let delay = 1000;
                        if (gridElements[index].classList.contains('cell0')) {
                            delay = 2000;
                        } else if (gridElements[index].classList.contains('cell1')) {
                            delay = 500;
                        } else if (gridElements[index].classList.contains('continuity-wrapper')) {
                            delay = 1000; // default 1000
                        } else if (gridElements[index].classList.contains('correct-wrapper')) {
                            delay = 2000;
                        }

                        grid_behind.style.height = 'auto';

                        setTimeout(function () {

                            if (gridElements[index].classList.contains('cell0')) {
                                algoGridContainer.style.height = 'auto';
                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid1.cell0').classList.add('visible');
                            } else if (gridElements[index].classList.contains('cell1')) {
                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid1.cell1').classList.add('visible');

                                let delay = 6000; // Default 6000

                                setTimeout(() => {
                                    const newGridWrapper = document.querySelector('.new-grid-wrapper');
                                    newGridWrapper.style.display = 'flex';

                                    document.querySelector('.new-grid-grid0.cell1').classList.add('visible');
                                    window.dispatchEvent(new Event('resize'));
                                }, delay);

                            } else if (gridElements[index].classList.contains('massflow-wrapper')) {
                                gridElements[index].classList.add('visible');

                                document.querySelector('.process--wrapper3').style.display = 'flex';

                                document.querySelector('.process--grid3.cell0').classList.add('visible');
                                setTimeout(() => {
                                    document.querySelector('.process--grid3.cell1').classList.add('visible');
                                }, 500)
                            } else if (gridElements[index].classList.contains('pressure-wrapper')) {
                                document.querySelector('.process--wrapper4').style.display = 'flex';

                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid4.cell0').classList.add('visible');
                                setTimeout(() => {
                                    document.querySelector('.process--grid4.cell1').classList.add('visible');
                                }, 0)
                            } else if (gridElements[index].classList.contains('continuity-wrapper')) {
                                document.querySelector('.process--wrapper5').style.display = 'flex';

                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid5.cell0').classList.add('visible');
                                setTimeout(() => {
                                    document.querySelector('.process--grid5.cell1').classList.add('visible');
                                    document.querySelector('.new-grid-grid0.cell0').classList.add('visible');
                                    window.dispatchEvent(new Event('resize'));
                                }, 0);
                            } else if (gridElements[index].classList.contains('correct-wrapper')) {

                                document.querySelector('.process--wrapper6').style.display = 'flex';

                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid6.cell0').classList.add('visible');
                                setTimeout(() => {
                                    document.querySelector('.process--grid6.cell1').classList.add('visible');
                                }, 0)
                            } else if (gridElements[index].classList.contains('update-wrapper')) {

                                if (!gridElements[index].classList.contains('visible')) {

                                    const testWrapper = document.querySelector('.test-wrapper');
                                    testWrapper.style.display = 'flex';

                                    grid__matrices.forEach((grid__matrix) => {
                                        createGridAlgoRow({ N: 5, grid: grid__matrix, borderWidth: 3 });
                                    });

                                    showText(grid__matrices[1].children);
                                    setTimeout(() => {
                                        setInterval(() => {
                                            showText(grid__matrices[1].children);
                                        }, 2000);
                                    }, 0);

                                    showText(grid__matrices[0].children);
                                    setTimeout(() => {
                                        setInterval(() => {
                                            showText(grid__matrices[0].children);
                                        }, 2000);
                                    }, 1000);

                                    //window.dispatchEvent(new Event('resize'));
                                }

                                document.querySelector('.process--wrapper7').style.display = 'flex';

                                gridElements[index].classList.add('visible');
                                document.querySelector('.process--grid7.cell0').classList.add('visible');

                                setTimeout(() => {
                                    document.querySelector('.process--grid7.cell1').classList.add('visible');
                                }, 0)


                                setTimeout(() => {
                                    const step7Wrapper = document.querySelector('.step7-wrapper');
                                    step7Wrapper.style.display = 'flex';
                                    document.querySelector('.step7-grid0.cell0').classList.add('visible');
                                    window.dispatchEvent(new Event('resize'));
                                }, 500);

                                if (isAlgoWriterOff === true) {
                                    setTimeout(() => {

                                        document.getElementById('poop-a-row').style.display = 'flex';
                                        document.getElementById('poop-a-wrapper').style.display = 'block';
                                        startTypeWriter('poop-a', 'poop-a');

                                        setTimeout(() => {
                                            document.querySelector('.poop-a-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                        }, 250)

                                        if (isAlgoBWriterOff === true) {
                                            setTimeout(() => {
                                                document.getElementById('poop-b-row').style.display = 'flex';
                                                document.getElementById('poop-b-wrapper').style.display = 'block';
                                                startTypeWriter('poop-b', 'poop-b');

                                                setTimeout(() => {
                                                    document.querySelector('.poop-b-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                                }, 250)

                                                if (isAlgoCWriterOff === true) {
                                                    setTimeout(() => {
                                                        document.getElementById('poop-c-row').style.display = 'flex';
                                                        document.getElementById('poop-c-wrapper').style.display = 'block';
                                                        startTypeWriter('poop-c', 'poop-c');

                                                        setTimeout(() => {
                                                            document.querySelector('.poop-c-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                                        }, 250)

                                                        if (isAlgoDWriterOff === true) {
                                                            setTimeout(() => {
                                                                document.getElementById('poop-d-row').style.display = 'flex';
                                                                document.getElementById('poop-d-wrapper').style.display = 'block';
                                                                startTypeWriter('poop-d', 'poop-d');

                                                                setTimeout(() => {
                                                                    document.querySelector('.poop-d-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                                                                }, 250)

                                                            }, 3000)
                                                        }
                                                    }, 5500)
                                                }
                                            }, 4500)
                                        }
                                    }, 2000)
                                }

                            } else if (gridElements[index].classList.contains('.algo-dialogue-wrapper')) {
                                gridElements[index].classList.add('visible');
                            } else {
                                gridElements[index].classList.add('visible');
                            }

                            // move to next step after a delay
                            setTimeout(function () {
                                fadeElementsInSuccession(index + 1);
                            }, 500);
                        }, delay);
                    }
                }

                fadeElementsInSuccession(0);

                const newGridContainerElements = document.querySelectorAll('.new-grid-container > div');
                const step7gridElements = document.querySelectorAll('.step7-grid0 > div');

                function fadeNewGridRowElementsInSuccession(index) {
                    if (index < newGridContainerElements.length) {
                        setTimeout(function () {
                            newGridContainerElements[index].classList.add('visible');
                            fadeNewGridRowElementsInSuccession(index + 1);
                        }, 8900);
                    }
                }

                fadeNewGridRowElementsInSuccession(0);

                function fadeStep7ElementsInSuccession(index) {
                    if (index < step7gridElements.length) {
                        setTimeout(function () {
                            /* turns on right side of grid */
                            step7gridElements[index + 1].classList.add('visible');
                            //fadeStep7ElementsInSuccession(index + 1);
                        }, 14000); // default 14000s, set to 0 for convenience
                    }
                }

                fadeStep7ElementsInSuccession(0);

            }
        }
    });

    function showText(grid_matrix_children) {
        let textElements = document.querySelectorAll('.AA, .AAB, .bracket-L, .bracket-R, .B');
        let colorDuration = 0.05;

        textElements.forEach((element, index) => {

            setTimeout(() => {
                element.classList.add('text-appear');
                if (element.classList.contains('B')) {
                    document.documentElement.style.setProperty('--animation-grid-matrix', `gridMatrixAnimation ${colorDuration * 20}s ease-out`);
                } else {
                    document.documentElement.style.setProperty('--animation-matrix', `matrixAnimation ${colorDuration * 20}s ease-out`);
                }

            }, index * 0);

            let tracker = [];
            let row = 5;
            let col = 5;
            let h = 0

            // loop to initialize 2D array elements for placement of zeros
            for (let i = 0; i < row; i++) {
                tracker[i] = [];
                for (let j = 0; j < col; j++) {
                    tracker[i][j] = h++;
                }
            }

            let diags = tracker.map((a, i) => a[i])

            // gather diagonal elements
            let diagEls = [];
            let UdiagEls = [];
            let LdiagEls = [];

            for (let i = 0; i < grid_matrix_children.length; i++) {

                let el = grid_matrix_children[i];

                // extract numerical part from element ID
                let elIdx = parseInt(el.id.match(/\d+/)[0], 10);

                if (diags.includes(elIdx)) {
                    diagEls.push(el);
                    if (elIdx !== diags[0] || elIdx !== diags[-1]) {
                        UdiagEls.push(grid_matrix_children[i+1]);
                        LdiagEls.push(grid_matrix_children[i-1]);
                    }
                }
            }

            //console.log(`diags.slice(1,-1): ${diags.slice(0)}`)
            //console.log(`diagEls: ${diagEls} :: UdiagEls: ${UdiagEls.length} :: LdiagEls: ${LdiagEls}`);

            diagEls.forEach((el, idx) => {
                let delay = idx * 250;

                if (idx === 0) {
                    delay = 250;
                }

                el.classList.remove('highlight-effect-with-shadow');

                setTimeout(() => {
                    el.classList.add('highlight-effect-with-shadow');
                }, delay);
            });
            UdiagEls.slice(0,-1).forEach((el, idx) => {
                let delay = idx * 250;

                if (idx === 0) {
                    delay = 250;
                }

                el.classList.remove('highlight-effect-with-shadow');

                setTimeout(() => {
                        el.classList.add('highlight-effect-with-shadow');
                }, delay);
            });
            LdiagEls.slice(1).forEach((el, idx) => {
                let delay = idx * 250;

                if (idx === 0) {
                    delay = 250;
                }

                el.classList.remove('highlight-effect-with-shadow');

                setTimeout(() => {
                        el.classList.add('highlight-effect-with-shadow');
                }, delay);
            });
        });
    }

    proofRow.addEventListener('mouseenter', (event) => {

        if (isCalculusRowOpen == true) {

            let classList = event.target.classList;

            if (isProofWriterOff === true) {
                document.getElementById('shit-wrapper').style.display = 'block';
                startTypeWriter(classList, 'shit');

                document.getElementById('grid-proof').style.display = 'grid';

                setTimeout(() => {
                    document.querySelector('.shit-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                }, 250)

                if (isProofBWriterOff === true) {
                    setTimeout(() => {

                        document.getElementById('shit-b-wrapper').style.display = 'block';
                        startTypeWriter('shit-b', 'shit-b');

                        setTimeout(() => {
                            document.querySelector('.shit-b-text').style.fontSize =`${1.25 * newFontSize / htmlFontSize}rem`;
                        }, 250)
                    }, 4000)
                }
            }

            /* Gaia Plots */

            const socket = io.connect('/getRe');

            socket.on('connect', () => {
                //console.log('Client conneted to /getRe')
            })

            socket.emit('message', {
                flag: 'getRe',
            })

            socket.on('response', (data) => {

                fignames_Re.forEach((figname_Re) => { figname_Re.classList.add('visible'); })

                fignames_vel.forEach((figname_vel) => { figname_vel.classList.add('visible'); })

                const newData = JSON.parse(data);

                const cellWidth = getComputedStyle(document.documentElement).getPropertyValue('--cell-width-rem');

                // viewport width in pixels
                const vwInPixels = window.innerWidth || document.documentElement.clientWidth;

                // cnvert vw to pixels
                const fontSizeInPixels = parseFloat(cellWidth) * (vwInPixels / 100);

                Re = [400,1000,3200,5000];
                var ctxsU = []; var ctxsV = [];
                for (let i = 0; i < 4; i++) { // edited for debuggin Feb. 28 0922
                    ctxsU[i] = document.getElementById(`Re${Re[i]}u`).getContext('2d');
                    ctxsV[i] = document.getElementById(`Re${Re[i]}v`).getContext('2d');
                }

                Re400_top = document.getElementById('hero Re400 u');

                gaiaKeys = Object.keys(newData.Gaia);

                const dataGaia = [
                    /* Re400 u and v */
                    {
                        datasets: [
                            {
                                label: 'CFD Simulation Tool',
                                borderColor: "#77DD77",
                                backgroundColor: "#77DD77",
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[0]}`]['u'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#77DD77',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[0]}`]['v'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#779ECB',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[1]}`]['u'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#77DD77',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[1]}`]['v'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#779ECB',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[2]}`]['u'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#77DD77',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[2]}`]['v'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#779ECB',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[3]}`]['u'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#77DD77',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
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
                                borderWidth: fontSizeInPixels / 16,
                                pointRadius: 0,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.cfd[`${gaiaKeys[3]}`]['v'],
                                showLine: true,
                            },
                            {
                                label: 'Gaia et al.',
                                borderColor: '#779ECB',
                                backgroundColor: '#CFCFC4',
                                borderWidth: fontSizeInPixels / 8,
                                pointRadius: fontSizeInPixels / 4,
                                pointBackgroundColor: '#CFCFC4',
                                data: newData.Gaia[`${gaiaKeys[3]}`]['v'],
                            }
                        ]
                    }
                ];

                if (!Re400U) {

                    Re400U = new Chart(ctxsU[0], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        },
                                        borderColor: "#FDFD96",
                                        borderWidth: 2,
                                    },

                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 16,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.4,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'u/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        },
                                        borderColor: "#FDFD96",
                                        borderWidth: 2,
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 16,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re400V = new Chart(ctxsV[0], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.5,
                                    max: 0.4,
                                    title: {
                                        display: true,
                                        text: 'v/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re1000U = new Chart(ctxsU[1], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.6,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'u/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re1000V = new Chart(ctxsV[1], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.6,
                                    max: 0.4,
                                    title: {
                                        display: true,
                                        text: 'v/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re3200U = new Chart(ctxsU[2], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.6,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'u/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re3200V = new Chart(ctxsV[2], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.8,
                                    max: 0.6,
                                    title: {
                                        display: true,
                                        text: 'v/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                            font: {
                                                size: fontSizeInPixels
                                            }
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re5000U = new Chart(ctxsU[3], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.6,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'u/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        },
                                        borderColor: "#FDFD96",
                                        borderWidth: 2,
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });
                    Re5000V = new Chart(ctxsV[3], {
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
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    min: 0,
                                    max: 1.01,

                                    ticks: {
                                        color: "#FDFD96",
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        padding: 10,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 32,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                                y: {
                                    min: -0.8,
                                    max: 0.6,
                                    title: {
                                        display: true,
                                        text: 'v/U',
                                        color: "#FDFD96",
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    ticks: {
                                        color: "#FDFD96",
                                        precision: 1,
                                        callback: (value, idx, values) => {
                                            return value;
                                        },
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        drawTicks: true,
                                        lineWidth: fontSizeInPixels / 16,
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: fontSizeInPixels
                                        }
                                    }
                                }
                            }
                        },
                    });

                }

                gaiaCharts = [Re400U,Re400V,Re1000U,Re1000V,
                                Re3200U,Re3200V,Re5000U,Re5000V];

                for (let i = 0; i < 2*gaiaKeys.length; i++) {
                    gaiaCharts[i].data = dataGaia[i];
                    gaiaCharts[i].update();
                }
            })
        }
    })
})

function showLabel(id, subscript) {
    switch(subscript.slice(0,-1)) {
        case `w`:
            document.getElementById(`grid4__cell${4}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">u<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `e`:
            document.getElementById(`grid4__cell${4}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">u<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `n`:
            document.getElementById(`grid4__cell${4}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">v<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `s`:
            document.getElementById(`grid4__cell${4}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">v<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `nn`:
            document.getElementById(`grid4__cell${1}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `nww`:
            document.getElementById(`grid4__cell${3}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `nee`:
            document.getElementById(`grid4__cell${5}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `ee`:
            document.getElementById(`grid4__cell${5}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `nne`:
            document.getElementById(`grid4__cell${1}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
        case `sse`:
            document.getElementById(`grid4__cell${7}`).innerHTML += `
                <div class="circle small ${subscript.slice(0,-1)}">${id}<sub><sub>${subscript.slice(0,-1)}</sub></sub></div>
            `;
            break;
    }
}

function createGridCalcRow(input) {

    let N = input.N;
    let grid = input.grid;
    let width = input.borderWidth;
    let id = input.id;
    let areModalsOpen = input.areModalsOpen;

    let arrC = Array.from({length: N}, (_, i) => (N-1)+i*N); let element = arrC.slice(-1);
    let arrR = Array.from({length: N-1}, (_, i) => N**2-N + i);

    for (let i = 0; i < N**2; i++) {

        let div = document.createElement('div');

        div.className = `${grid.className}__cell ${grid.className}__cell${i}`; div.id =`${grid.className}__cell${i}`; div.innerHTML = ``;

        // check for last column
        if (i % N == N - 1) {
            div.style.width = `calc(var(--cell-width-rem) + ${width})`;
            div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
        }

        // check for the last row
        if (Math.floor(i / N) === N - 1) {
            div.style.height = `calc(var(--cell-width-rem) + ${width})`;
            div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
        }

        div.style.borderWidth = `${width} 0 0 ${width}`; // removes R and B (KEEP HERE)

        // yes get rid of this one
        if (!arrC.includes(i) && !arrR.includes(i)) {
            //div.style.borderWidth = `${width} 0 0 ${width}`; // removes R and B
            //div.style.borderWidth = `${width}px 0 0 ${width}px`; // removes R and B
        }

        // last row except last cell
        if (arrR.includes(i)) {
            div.style.borderWidth = `${width} 0 ${width} ${width}`; // removes R
            //div.style.borderWidth = `${width}px 0 ${width}px ${width}px`; // removes R
        }

        // last column except last cell
        if (arrC.includes(i) && i !== element[0]) {
            div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
            //div.style.borderWidth = `${width}px ${width}px 0 ${width}px`; // removes B
        }

        // last cell
        if (i == N**2 - 1) {
            div.style.borderWidth = div.style.borderWidth = `${width} ${width} ${width} ${width}`;
        }

        grid.appendChild(div);

        if (grid.classList.contains('grid4')) {
            if (id === 'P') {
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small NW">NW</div>`;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small N">N</div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small NE">NE</div>`;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small W">W</div>`;
                        break;
                    case 4:
                        let innerHTML = ``;

                        if (id === 'P' && areModalsOpen != true) {
                            innerHTML = `
                                <div class="circle small P">P</div>
                                <div class="circle small p">p</div>
                                <div class="circle small w">u<sub><sub>w</sub></sub></div>
                                <div class="circle small e">u<sub><sub>e</sub></sub></div>
                                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                                <div class="circle small s">v<sub><sub>s</sub></sub></div>
                            `;
                            document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                            //document.getElementById(`grid4__cell${i}`).style.top = `0`;
                            //document.getElementById(`grid4__cell${i}`).style.left = `0`;

                        } else if (id === 'P' && areModalsOpen == true) {
                            /* innerHTML = `
                            <div class="circle small w">u<sub><sub>w</sub></sub></div>
                            <div class="circle small e">u<sub><sub>e</sub></sub></div>
                            ` */
                        }
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small E">E</div>`;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small S">S</div>`;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SE">SE</div>`;
                        break;
                }
            } else if (id === 'u') {
                //console.log(`else if (id === ${id}) {, i = ${i}`)
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NW">NW</div>
                        `;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NN">NN</div>
                            <div class="circle small nne">u<sub><sub>nne</sub></sub></div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NE">NE</div>
                        `;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small W">W</div>
                        `;
                        break;
                    case 4:
                        let innerHTML = ``;

                        innerHTML = `
                            <div class="circle small P">P</div>
                            <div class="circle small p">p</div>
                            <div class="circle small w">u<sub><sub>w</sub></sub></div>
                            <div class="circle small e">u<sub><sub>e</sub></sub></div>
                        `;
                        document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small E">E</div>
                            <div class="circle small ee">u<sub><sub>ee</sub></sub></div>
                        `;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small S">S</div>
                            <div class="circle small sse">u<sub><sub>sse</sub></sub></div>
                        `;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small SE">SE</div>
                        `;
                        break;
                }
            } else if (id === 'v') {
                //console.log(`else if (id === ${id}) {, i = ${i}`)
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NW">NW</div>
                        `;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NN">NN</div>
                            <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NE">NE</div>
                        `;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small W">W</div>
                            <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                        `;
                        break;
                    case 4:
                        let innerHTML = ``;

                        innerHTML = `
                            <div class="circle small P">P</div>
                            <div class="circle small p">p</div>
                            <div class="circle small n">v<sub><sub>n</sub></sub></div>
                            <div class="circle small s">v<sub><sub>s</sub></sub></div>
                        `;
                        document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small E">E</div>
                            <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
                        `;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small S">S</div>`;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SE">SE</div>`;
                        break;
                }
            }
        }
    };
};

function createGrid4CalcRow(input) {


    let N = input.N;
    let grid = input.grid;
    let width = input.borderWidth;
    let id = input.id;
    let areModalsOpen = input.areModalsOpen;

    let arrC = Array.from({length: N}, (_, i) => (N-1)+i*N); let element = arrC.slice(-1);
    let arrR = Array.from({length: N-1}, (_, i) => N**2-N + i);

    //const grid0__cell56 = document.getElementById('grid0__cell56');

    //console.log('grid0__cell56', grid0__cell56)

    //grid0__cell56.style.width = `calc(var(--cell-width-rem) + var(--calc-grid-rem))`;
    //grid0__cell56.style.height = 'calc(var(--cell-width-rem) + var(--calc-grid-rem))';
    //grid0.children[56].style.height = `calc(var(--cell-width-rem) + ${width})`;

    for (let i = 0; i < N**2; i++) {
        let div = document.createElement('div');

        div.className = `${grid.className}__cell ${grid.className}__cell${i}`; div.id =`${grid.className}__cell${i}`; div.innerHTML = ``;

        // check for last column
        if (i % N == N - 1) {
            //div.style.width = `calc(var(--cell-width-rem) + ${width})`;
            //div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
        }

        // check for the last row
        if (Math.floor(i / N) === N - 1) {
            //div.style.height = `calc(var(--cell-width-rem) + ${width})`;
            //div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
        }

        if (!arrC.includes(i) && !arrR.includes(i)) {
            div.style.borderWidth = `${width} 0 0 ${width}`; // removes R and B
            //div.style.borderWidth = `${width}px 0 0 ${width}px`; // removes R and B
        }

        if (arrR.includes(i)) {
            div.style.borderWidth = `${width} 0 ${width} ${width}`; // removes R
            //div.style.borderWidth = `${width}px 0 ${width}px ${width}px`; // removes R
        }

        if (arrC.includes(i) && i !== element[0]) {
            //div.style.borderWidth = `${width} ${width} 0 ${width}`; // removes B
            //div.style.borderWidth = `${width}px ${width}px 0 ${width}px`; // removes B
        }

        if (i == N**2 - 1) {
            div.style.borderWidth = div.style.borderWidth = `${width} ${width} ${width} ${width}`;
        }

        grid.appendChild(div);

        if (grid.classList.contains('grid4')) {
            if (id === 'P') {
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small NW">NW</div>`;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small N">N</div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small NE">NE</div>`;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small W">W</div>`;
                        break;
                    case 4:
                        let innerHTML = ``;

                        if (id === 'P' && areModalsOpen != true) {
                            innerHTML = `
                                <div class="circle small P">P</div>
                                <div class="circle small p">p</div>
                                <div class="circle small w">u<sub><sub>w</sub></sub></div>
                                <div class="circle small e">u<sub><sub>e</sub></sub></div>
                                <div class="circle small n">v<sub><sub>n</sub></sub></div>
                                <div class="circle small s">v<sub><sub>s</sub></sub></div>
                            `;
                            document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                            //document.getElementById(`grid4__cell${i}`).style.top = `0`;
                            //document.getElementById(`grid4__cell${i}`).style.left = `0`;

                        } else if (id === 'P' && areModalsOpen == true) {
                            /* innerHTML = `
                            <div class="circle small w">u<sub><sub>w</sub></sub></div>
                            <div class="circle small e">u<sub><sub>e</sub></sub></div>
                            ` */
                        }
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small E">E</div>`;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small S">S</div>`;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SE">SE</div>`;
                        break;
                }
            } else if (id === 'u') {
                //console.log(`else if (id === ${id}) {, i = ${i}`)
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NW">NW</div>
                        `;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NN">NN</div>
                            <div class="circle small nne">u<sub><sub>nne</sub></sub></div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NE">NE</div>
                        `;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small W">W</div>
                        `;
                        break;
                    case 4:
                        let innerHTML = ``;

                        innerHTML = `
                            <div class="circle small P">P</div>
                            <div class="circle small p">p</div>
                            <div class="circle small w">u<sub><sub>w</sub></sub></div>
                            <div class="circle small e">u<sub><sub>e</sub></sub></div>
                        `;
                        document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small E">E</div>
                            <div class="circle small ee">u<sub><sub>ee</sub></sub></div>
                        `;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small S">S</div>
                            <div class="circle small sse">u<sub><sub>sse</sub></sub></div>
                        `;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small SE">SE</div>
                        `;
                        break;
                }
            } else if (id === 'v') {
                //console.log(`else if (id === ${id}) {, i = ${i}`)
                switch (i) {
                    case 0:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NW">NW</div>
                        `;
                        break;
                    case 1:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NN">NN</div>
                            <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                        `;
                        break;
                    case 2:
                        div.style.borderWidth = div.style.borderWidth = `0 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small NE">NE</div>
                        `;
                        break;
                    case 3:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small W">W</div>
                            <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                        `;
                        break;
                    case 4:
                        let innerHTML = ``;

                        innerHTML = `
                            <div class="circle small P">P</div>
                            <div class="circle small p">p</div>
                            <div class="circle small n">v<sub><sub>n</sub></sub></div>
                            <div class="circle small s">v<sub><sub>s</sub></sub></div>
                        `;
                        document.getElementById(`grid4__cell${i}`).innerHTML = innerHTML;
                        break;
                    case 5:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `
                            <div class="circle small E">E</div>
                            <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
                        `;
                        break;
                    case 6:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 0`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SW">SW</div>`;
                        break;
                    case 7:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small S">S</div>`;
                        break;
                    case 8:
                        div.style.borderWidth = div.style.borderWidth = `${width} 0 0 ${width}`;
                        document.getElementById(`grid4__cell${i}`).innerHTML = `<div class="circle small SE">SE</div>`;
                        break;
                }
            }
        }
    };
};

function createGridAlgoRow(input) {

    console.log(`input.grid: ${input.grid.className}`)

    let N = input.N;
    let grid = input.grid;
    let width = input.borderWidth;

    let arrC = Array.from({length: N}, (_, i) => (N-1)+i*N); let element = arrC.slice(-1);
    let arrR = Array.from({length: N-1}, (_, i) => N**2-N + i);

    for (let i = 0; i < N**2; i++) {
        let div = document.createElement('div');

        div.className = `${grid.className}__cell ${grid.className}__cell${i}`; div.id =`${grid.className}__cell${i}`; div.innerHTML = `${i}`;

        div.style.borderWidth = `${width}px 0 0 ${width}px`; // removes R and B

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

        // Loop to initialize 2D array elements for placement of zeros
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
        //let borderCells = [0,1,2,3,4,5,6,7,12,13,18,19,24,25,30,31,32,33,34,35]
        //console.log('tracker: ', tracker, 'diags: ', diags)
        for (let cell of cells) {
            let id = cell.id;

            //if (!borderCells.includes(id)) {


                //if (typeof id === 'string') {
                //    console.log('is string')
                //}

                let idg = id.match(/\d+/g).map(Number)[0];
                //console.log("idg: ", idg);
                /* For brackets */
                //if (idg === 0 || idg === 4) {
                //    cells[idg].style.setProperty('border-top', '4px solid red');
                //}
                //if (idg === 20 || idg === 24) {
                //    cells[idg].style.setProperty('border-bottom', '4px solid red');
                //}

                if (diags.slice(1,-1).includes(idg)) {

                    if (rowID === 0) {

                        //console.log('diags.slice(1,-1): ', diags.slice(1,-1), diags.slice(-1)[0], 'diags: ', diags)
                        //console.log('idg: ', idg, 'rowID: ', rowID, 'tracker1: ', tracker)
                    }

                    cells[idg].innerHTML = `x`;
                    cells[idg - 1].innerHTML = `x`;
                    cells[idg + 1].innerHTML = `x`;
                    //cells[idg + 2].innerHTML = `x`;
                    //cells[idg + 3].innerHTML = `x`;
                    //cells[idg + 3].innerHTML = `x`;
                    cells[idg].style.setProperty('font-style', 'italic');
                    cells[idg - 1].style.setProperty('font-style', 'italic');
                    cells[idg + 1].style.setProperty('font-style', 'italic');
                    tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg - 1), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
                } else if (idg === diags[0]) {
                    //console.log('diags[0]: ', diags[0], 'diags: ', diags)
                    //console.log('idg: ', idg, 'rowID: ', rowID, 'tracker2: ', tracker)
                    cells[idg].innerHTML = `x`;
                    cells[idg + 1].innerHTML = `x`;
                    cells[idg].style.setProperty('font-style', 'italic')
                    cells[idg + 1].style.setProperty('font-style', 'italic')
                    tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
                } else if (idg === diags.slice(-1)[0]) {
                    //console.log('diags.slice(-1)[0]', diags.slice(-1)[0], 'diags: ', diags)
                    //console.log('idg: ', idg, 'rowID: ', rowID, 'tracker3: ', tracker)
                    cells[idg].innerHTML = `x`;
                    cells[idg - 1].innerHTML = `x`;
                    cells[idg].style.setProperty('font-style', 'italic')
                    cells[idg - 1].style.setProperty('font-style', 'italic')
                    tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg - 1), 1);
                } else if (idg === 0) {
                    //cells[idg].innerHTML = '[';
                    //cells[idg].style.fontSize = `calc(6*var(--cell-width))`;
                    //cells[idg].style.zIndex = -1;
                } else if (idg === 6) {
                    //cells[idg].innerHTML = '';
                    //cells[idg].style.fontSize = `calc(1*var(--cell-width))px`;
                }

                for (let i = 0; i < tracker.length; i++) {
                    for (let j = 0; j < tracker[i].length; j++) {
                        cells[tracker[i][j]].innerHTML = `0`;
                    }
                }

                //if (idg % 6 === 0 && idg !== 7) { rowID++ }
                if (idg % 5 === 0 && idg !== 0) { rowID++ }
            //}
        }
    }
};

function createGridAlgoRow(input) {

    //console.log(`input.grid: ${input.grid.className}`)

    let N = input.N;
    let grid = input.grid;
    let width = input.borderWidth;

    let arrC = Array.from({length: N}, (_, i) => (N-1)+i*N); let element = arrC.slice(-1);
    let arrR = Array.from({length: N-1}, (_, i) => N**2-N + i);

    for (let i = 0; i < N**2; i++) {
        let div = document.createElement('div');

        div.className = `${grid.className}__cell ${grid.className}__cell${i}`; div.id =`${grid.className}__cell${i}`; div.innerHTML = `${i}`;

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

        // loop to initialize 2D array elements for placement of zeros
        for (let i = 0; i < row; i++) {
            tracker[i] = [];
            for (let j = 0; j < col; j++) {
                tracker[i][j] = h++;
            }
        }

        let diags = tracker.map((a, i) => a[i])

        let rowID = 0;
        let cells = input.grid.children;

        for (let cell of cells) {
            let id = cell.id;

            //if (!borderCells.includes(id)) {

                let idg = id.match(/\d+/g).map(Number)[0];

                if (diags.slice(1,-1).includes(idg)) {
                    cells[idg].innerHTML = `x`;
                    cells[idg - 1].innerHTML = `x`;
                    cells[idg + 1].innerHTML = `x`;
                    //cells[idg + 2].innerHTML = `x`;
                    //cells[idg + 3].innerHTML = `x`;
                    //cells[idg + 3].innerHTML = `x`;
                    cells[idg].style.setProperty('font-style', 'italic');
                    cells[idg - 1].style.setProperty('font-style', 'italic');
                    cells[idg + 1].style.setProperty('font-style', 'italic');
                    tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg - 1), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
                } else if (idg === diags[0]) {
                    //console.log('diags[0]: ', diags[0], 'diags: ', diags)
                    //console.log('idg: ', idg, 'rowID: ', rowID, 'tracker2: ', tracker)
                    cells[idg].innerHTML = `x`;
                    cells[idg + 1].innerHTML = `x`;
                    cells[idg].style.setProperty('font-style', 'italic')
                    cells[idg + 1].style.setProperty('font-style', 'italic')
                    tracker[rowID].splice(tracker[rowID].indexOf(idg), 1);
                    tracker[rowID].splice(tracker[rowID].indexOf(idg + 1), 1);
                } else if (idg === diags.slice(-1)[0]) {
                    //console.log('diags.slice(-1)[0]', diags.slice(-1)[0], 'diags: ', diags)
                    //console.log('idg: ', idg, 'rowID: ', rowID, 'tracker3: ', tracker)
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

                //if (idg % 6 === 0 && idg !== 7) { rowID++ }
                if (idg % 5 === 0 && idg !== 0) { rowID++ }
            //}
        }
    }
};
