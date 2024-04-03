document.addEventListener("DOMContentLoaded", function () {

    //document.querySelector('.logo-sim').addEventListener('mouseover', removeAnimation);

    // Get the window width
    const windowWidth = window.innerWidth;

    // Calculate the scale factor based on the window width
    //const scaleFactor = calculateScaleFactor(windowWidth);

    // Apply the scale factor to the heroForm element
    //document.getElementById('heroForm').style.transform = `scale(${scaleFactor})`;

    // Adjust the height of the .upper container based on the scale factor
    const upperContainer = document.querySelector('.upper');
    upperContainer.style.height = `auto`; // Reset height to auto
    //const scaledHeroFormHeight = document.getElementById('heroForm').offsetHeight * scaleFactor;
    //upperContainer.style.height = `calc(${scaledHeroFormHeight}px + 2rem)`;

    // Function to calculate the scale factor based on window width
    function calculateScaleFactor(windowWidth) {
        // Define your logic to calculate the scale factor based on window width
        // This can be a linear function, a piecewise function, or any other logic you prefer
        // For example:
        const maxWidth = 1920; // Adjust as needed
        const minScale = 1.0; // Minimum scale factor
        const maxScale = 1.0; // Maximum scale factor
        const scaleFactor = minScale + ((maxScale - minScale) * (windowWidth / maxWidth));
        return scaleFactor;
    }

    const loginButton = document.getElementById('loginButton');

    var loggedIn = null

    const socketIsUserLoggedIn = io.connect('/is_user_logged_in')

    socketIsUserLoggedIn.on('connect', () => {
        console.log('Client connected to /is_user_logged_in')
    });

    socketIsUserLoggedIn.emit('message', {
        flag: `is_user_logged_in`,
    })

    socketIsUserLoggedIn.on('response', (data) => {
        let obj = JSON.parse(data);
        loggedIn = obj.msg
        console.log('loggedIn: ', loggedIn)
    })

    // Assume you have a variable loggedIn from the backend indicating the user's login status
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

    // Update the button text and behavior based on the user's login status
    loginButton.innerHTML = `Logout`; */

    // Assuming login success, you can enable the buttons
    function enableButtons() {
        //document.getElementById('welcome').classList.remove('disabled');
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

    //const welcomeDiv = document.getElementById('welcome');
    const homeButton = document.getElementById('home');
    const simulateButton = document.getElementById('simulate');

    //addHoverAndFocusStyles(welcomeDiv);
    addHoverAndFocusStyles(homeButton);
    addHoverAndFocusStyles(simulateButton);
    //addHoverAndFocusStyles(loginButton);

    /* KEEP BELOW LOGIN AND OTHER NAV CALLS 240312 */
    const logoSim = document.querySelector('.logo-sim');
    const ddCFD = document.querySelector('.dropdown-CFD');

    logoSim.addEventListener('mouseover', () => {
        //console.log('add active simulate')
        ddCFD.classList.add('active');
    });

    ddCFD.addEventListener('mouseleave', () => {
        //console.log('remove active simulate')
        ddCFD.classList.remove('active');
    });

    var navbarTop = document.getElementById('navbar').offsetTop;
    var navbarHeight = document.getElementById('navbar').offsetHeight;
    var upperTop = document.getElementById('upper').offsetTop;
    var upperHeight = document.getElementById('upper').offsetHeight;
    var gridContainerHeight = document.getElementById('gridContainer').offsetHeight;

    const navbar = document.querySelector(".navbar");

    // Get the computed styles of the element
    const computedStyles = window.getComputedStyle(navbar);

    // Retrieve the borderWidth property
    const borderWidth = parseFloat(computedStyles.getPropertyValue("border-bottom-width"));

    document.querySelector('.dropdown-list').style.top = `${navbar.getBoundingClientRect().top + navbar.offsetHeight - borderWidth}px`;

    var upper = document.querySelector('.upper');

    upper.style.top = `${navbarHeight}px`;

    var container1 = document.getElementById("container1");
    var container3 = document.getElementById("container3"); // dialog
    var container2 = document.getElementById("container2"); // figures

    container1.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`;
    container2.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`;
    container3.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`; /* ch */

    //container2.style.top = `${navbarHeight + upper.offsetHeight + container1.offsetHeight}px`;

    //container1.style.top = `${upper.getBoundingClientRect().top + upper.offsetHeight}px`;

    // COMMENTED 240323 1429
    //document.documentElement.style.setProperty('--upper-bottom', `${upper.getBoundingClientRect().top + upper.offsetHeight}px`);

    // for container2 positioning
    document.documentElement.style.setProperty('--container1-bottom', `${container1.getBoundingClientRect().top + container1.offsetHeight}px`);

    var gridConv = document.querySelector('.gridConv');
    document.documentElement.style.setProperty('--gridConv-bottom', `${(gridConv.getBoundingClientRect().top + gridConv.offsetHeight) - (upper.getBoundingClientRect().top + upper.offsetHeight)}px`);

    setTimeout(() => {
        window.scrollTo(0, document.body.scrollTop);
        document.querySelector('#checkbox').click();
    }, 250);

    //setTimeout(() => {  document.getElementById('curtain__panel').remove() }, 3000); Commented 240302 1459
    const canvas = document.querySelector('.myChartConv');
    const gridForm = document.querySelector('.gridForm');
    const extrafxns = document.querySelector('.extrafxns');

    var newFontSize;
    let htmlFontSize;

    var newMyEyeBias;

    window.addEventListener('resize', () => {

        //setIntegralIntroPosition();

        const windowWidth = window.innerWidth;

        const initialMaxWidth = 1920;
        const initialFontSizeRem = 1;
        const initialMyEyeBiasRem = 2; // rem
        const damper = 1;

        htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const initialFontSizePx = initialFontSizeRem * htmlFontSize;
        const initialMyEyeBiasPx = initialMyEyeBiasRem * htmlFontSize;

        const minWidth = 667 - 300; // Minimum width at which the grid gap stops decreasing

        const initialCanvasWidth = 1440;
        const initialCanvasHeight = 600;
        const initialMyEyeScale = 1;

        let newCanvasWidth;
        let newCanvasHeight;
        let newMyEyeScale;

        const newFontSizeSlope = (initialFontSizePx - initialFontSizePx * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const myEyeBiasSlope = (initialMyEyeBiasPx - initialMyEyeBiasPx * (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);

        const canvasWidthSlope = (initialCanvasWidth - initialCanvasWidth* (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const canvasHeightSlope = (initialCanvasHeight - initialCanvasHeight* (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);
        const myEyeScaleSlope = (initialMyEyeScale -initialMyEyeScale* (minWidth / initialMaxWidth)) / (initialMaxWidth - minWidth);

        newFontSize = initialFontSizePx;
        newMyEyeBias = initialMyEyeBiasPx;

        canvas.style = `
            display: block;
            box-sizing: border-box;
            height: ${initialCanvasHeight}px;
            width: ${initialCanvasWidth}px;
        `;

        //console.log('newMyEyeBias (px, initial): ', newMyEyeBias)

        container1.style.top = `calc(${navbarHeight + upper.offsetHeight + newMyEyeBias}px)`;

        //console.log("windowWidth: " windowWidth)

        if (windowWidth < initialMaxWidth) {

            newFontSize = initialFontSizePx - 0.75*newFontSizeSlope * (initialMaxWidth - windowWidth);

            newCanvasWidth = initialCanvasWidth - damper*canvasWidthSlope * (initialMaxWidth - windowWidth);
            //newCanvasHeight = initialCanvasHeight - 1.1875*damper*canvasHeightSlope * (initialMaxWidth - windowWidth);
            newCanvasHeight = initialCanvasHeight - 1.0625*damper*canvasHeightSlope * (initialMaxWidth - windowWidth);

            newMyEyeScale =initialMyEyeScale - 0.375*myEyeScaleSlope * (initialMaxWidth - windowWidth);

            canvas.style = `
                display: block;
                box-sizing: border-box;
                width: ${newCanvasWidth}px;
                height: ${newCanvasHeight}px;
            `;

            newMyEyeBias = initialMyEyeBiasPx - 3.105*myEyeBiasSlope * (initialMaxWidth - windowWidth);

            //console.log('newMyEyeBias (px, resize): ', newMyEyeBias)

            container1.style.top = `calc(${navbarHeight + upper.offsetHeight + newMyEyeBias}px)`;
        }

        gridForm.style.fontSize = `${newFontSize / htmlFontSize}rem`;
        extrafxns.style.fontSize = `${newFontSize / htmlFontSize}rem !important`;

        const grid0 = document.querySelector('.grid0');

        if (grid0) {
            //console.log("in if(grid0)")
            grid0.style.fontSize = `${1.25*(newFontSize / htmlFontSize)}rem`;
        }

        const fourthTextContainer = document.querySelector('.fourth-text-container');
        const fourthBTextContainer = document.querySelector('.fourth-b-text-container');

        if (fourthTextContainer) {
            document.querySelector('.fourth-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
            document.querySelector('.fourth-b-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
            document.querySelector('.fourth-c-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
            document.querySelector('.fourth-d-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
        }

        /* For dialogs */
        //cells.forEach(cell => {
        //    cell.style.fontSize = `${newFontSize / htmlFontSize}rem`;
        //});


    });

    // initial setup on page load
    window.dispatchEvent(new Event('resize'));

    var simnames = [];
    var newData; var simname = null; var newname = null;
    var U; var Re; var Np; const Nint = 250; var N = null;
    var u; var v; var speed; var L;
    var ctr;
    var start;

    var statusInterval;

    var ofs = 0;
    var heroForm = document.getElementById("heroForm");
    //heroForm.style = 'background-color: rgba(255,0,0,'+Math.abs(Math.sin(ofs))+');'
    //heroForm.style = 'background-color: rgba(10, 10, 10, 0.85);';

    document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');
    document.documentElement.style.setProperty('--animation1', '');
    document.documentElement.style.setProperty('--animation2', '');
    document.documentElement.style.setProperty('--animation3', '');

    document.documentElement.style.setProperty('--bgcolor0', '#CEB888');
    document.documentElement.style.setProperty('--bgcolor1', '#CEB888');
    document.documentElement.style.setProperty('--bgcolor2', '#CEB888');
    document.documentElement.style.setProperty('--bgcolor3', '#CEB888');

    //document.documentElement.style.setProperty('--bgcolor0', '#FDFD96');
    //document.documentElement.style.setProperty('--bgcolor1', '#FDFD96');
    //document.documentElement.style.setProperty('--bgcolor2', '#FDFD96');
    //document.documentElement.style.setProperty('--bgcolor3', '#FDFD96');

    /* document.querySelector('#home').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    })

    document.querySelector('#simulate').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    }) */

    const cellWidth = getComputedStyle(document.documentElement).getPropertyValue('--cell-width');

    // Get the viewport width in pixels
    const vwInPixels = window.innerWidth || document.documentElement.clientWidth;

    // Convert vw to pixels
    //const fontSizeInPixels = parseFloat(cellWidth) * (vwInPixels / 100);

    const fontSizeInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize)*2;


    const ctx1 = document.getElementById("myChartConv").getContext("2d");
    var myChartConv = new Chart(ctx1, {
        responsive: true,
        type: "line",
        data: {
            datasets: [
                //{ label: "main", borderColor: "#000000", backgroundColor: "#000000", borderRadius: 1, borderWidth: 2, pointRadius: 3, pointBackgroundColor: "white"},
                { label: "Pressure", borderColor: "#FF6961", backgroundColor: "#FF6961"  , borderRadius: 1, borderWidth: fontSizeInPixels / 32, pointRadius: fontSizeInPixels / 16, pointBackgroundColor: "white" },
                { label: "Velocity u", borderColor: "#77DD77", backgroundColor: "#77DD77", borderRadius: 1, borderWidth: fontSizeInPixels / 32, pointRadius: fontSizeInPixels / 16, pointBackgroundColor: "white" },
                { label: "Velocity v", borderColor: "#A7C7E7", backgroundColor: "#A7C7E7", borderRadius: 1, borderWidth: fontSizeInPixels / 32, pointRadius: fontSizeInPixels / 16, pointBackgroundColor: "white" },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        var value = tooltipItem.yLabel;
                        return datasetLabel + ': ' + value.toExponential(5); // Format tooltip labels in scientific notation
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'iteration',
                        color: "#CEB888",
                        font: {
                            size: fontSizeInPixels / 3
                        },
                    },
                    ticks: {
                        color: "#CEB888",
                        font: {
                            size: fontSizeInPixels / 3.5
                        },
                    },
                    grid: {
                        display: true,
                        borderColor: "#CEB888",
                        drawBorder: true,
                        drawOnChartArea: false,
                        color: "#CEB888",
                        drawTicks: true,
                    },
                },
                y: {
                    min: 0,
                    max: 1e3,
                    title: {
                        display: true,
                        text: 'residual',
                        color: "#CEB888",
                        font: {
                            size: fontSizeInPixels / 3
                        },
                    },
                    ticks: {
                        color: "#CEB888",
                        callback: function(value, index, values) {
                            return value.toExponential(2); // Change the number in parentheses to specify the number of decimal places
                        },
                        //callback: (value, idx, values) => {
                        //    return value;
                        //},
                        font: {
                            size: fontSizeInPixels / 3.5
                        },
                    },
                    grid: {
                        display: true,
                        borderColor: "#CEB888",
                        drawBorder: true,
                        drawOnChartArea: false,
                        color: "#CEB888",
                        drawTicks: true,
                    },
                    type: 'logarithmic',
                },
                xT: {
                    position: "top",
                    display: true,
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: true,
                        borderColor: "#CEB888",
                        drawBorder: true,
                        drawOnChartArea: false,

                    },
                },
                yR: {
                    position: "right",
                    display: true,
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: true,
                        borderColor: "#CEB888",
                        drawBorder: true,
                        drawOnChartArea: false,

                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: fontSizeInPixels / 3,

                        },
                        color: 'rgba(206,184,136,1)',
                    },
                    position: 'right',
                },
            }
        },
    });

    const retreive = document.getElementById("retreive");
    const ddMenu = document.getElementById("dd-menu");

    retreive.addEventListener('mouseover', () => {

        const socket = io.connect('/load');

        socket.on('connect', () => {
            //console.log('Client connected to /load')
        })


        socket.on('response', (data) => {

            //console.log("data: ", data)
            sid = data.sid; simnames = data.simnames;

            if (simnames != null) {

                // populate the ul with the array of items
                function populateList() {
                    ddMenu.style.opacity = 1;

                    ul.innerHTML = "";

                    simnames.forEach(simname => {
                        var lastIndex = simname.lastIndexOf('_');

                        const li = document.createElement("li");
                        li.textContent = simname.substring(0, lastIndex);
                        //li.textContent = simname.slice(0,-2);
                        ul.appendChild(li); // append the li to the ul
                    });
                };

                populateList();

                socket.emit('close_connection', { sid: sid });
            };
        });
    });

    ddMenu.addEventListener('mouseleave', () => {{
        console.log('in ddMenu mouseleave')
        ddMenu.style.opacity = 0;
        //ddMenu.style.display = 'none';
    }})

    // Add mouseleave event listener to btn5 to hide dropdown
    retreive.addEventListener("mouseleave", function(e) {
        console.log('in retreive mouseleave')
        // check if the mouse cursor leaves btn5 from top, left, or right
        const rect = retreive.getBoundingClientRect();
        if (
            e.clientX < rect.left || // left
            e.clientY < rect.top ||  // top
            e.clientY > rect.bottom // bottom
        ) {
            ddMenu.style.opacity = 0;
        }
    });

    const save = document.getElementById("save");

    save.addEventListener('click', () => {

        U = document.querySelector('#input-U').value;
        Re = document.querySelector('#input-Re').value;
        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        if (simname == null) {
            simname = 'My First Simulation'
            simname = prompt('Please specify a name for the simulation: ', simname)
        } else {
            simname = prompt('Please specify a name for the simulation: ', simname)

        }

        var edata;

        var exists = false;

        if (simname !== null) {
            console.log('simname: ', simname)
            const socket = io.connect('/chk');

            socket.on('connect', () => {
                console.log('Client connected to /genP');
                document.documentElement.style.setProperty('--animation4', '');
                document.documentElement.style.setProperty('--bgcolor4', '#CEB888');
            })

            socket.emit('message', {
                flag: 'chk',
                U: U,
                Re: Re,
                N: N,
                Np: Np,
                simname: simname,
                newData: newData,
            })

            socket.on('response', (data) => {
                edata = JSON.parse(data);

                console.log("edata: ", edata)

                /* check if simulation already exists in DB */
                exists = edata.chk;
                if (exists === true) {
                    newname = prompt(`The simulation already exists. Would you like to update ${simname}?`, simname)
                    if (newname !== simname) {
                        simname = newname
                        document.querySelector('#save').value = newname
                    }
                }

                const socket = io.connect('/save')

                socket.on('connect', () => {
                    console.log('Client connected to /save')
                    document.documentElement.style.setProperty('--bgcolor0', '#CEB888');
                });

                socket.emit('message', {
                    flag: '/* saveupdate */',
                    U: U,
                    Re: Re,
                    N: N,
                    Np: Np,
                    simname: simname,
                    newname: simname,
                    newData: newData,
                    exists: exists,
                })

                socket.on('response', (data) => {
                    let obj = JSON.parse(data);

                    let msg = obj.msg;

                    window.alert(msg)

                    document.documentElement.style.setProperty('--animation4', '');
                    document.documentElement.style.setProperty('--bgcolor4', '#CEB888');
                })
            });
        }

    });

    document.querySelector('#reset1').addEventListener('click', () => { resetConvergence() });

    //document.getElementById("uv").disabled = true;
    //document.getElementById("streamline").disabled = true;

    /* fvm route START */

    const fvm = document.getElementById("fvm");

    var btn0 = document.querySelector(".btn0");
    btn0.classList.add('content-run');
    //btn0.setAttribute('data-content', 'Run');

    document.getElementById("uv").disabled = true;
    document.getElementById("streamline").disabled = true;
    document.getElementById("save").disabled = true; /* Commented Feb. 21 2024 1008 */

    var sid = null;

    fvm.addEventListener('click', (e) => {

        document.getElementById("uv").disabled = true;
        document.getElementById("streamline").disabled = true;
        document.getElementById("save").disabled = true; /* Commented Feb. 21 2024 1008 */

        var afterPseudo = window.getComputedStyle(btn0, ':after');
        var content = afterPseudo.content;

        console.log("content: ", content)

        if (content.includes('Stop')) {
            btn0.classList.remove('content-stop');
            btn0.classList.add('content-run');
        } else {
            btn0.classList.remove('content-run');
            btn0.classList.add('content-stop');
        }

        /* if (content.includes('Stop')) {
            btn0.setAttribute('data-content', 'Run');
        } else {
            btn0.setAttribute('data-content', 'Stop');
            console.log("button should say stop", content)
        } */

        //const socket = new WebSocket(webSocketUri1);
        const socket = io.connect('/start_fvm');

        document.documentElement.style.setProperty('--animation-gridConv', 'pulsate_gridConv 1s infinite alternate')

        socket.on('connect', () => {
            console.log('Client connected to /start_fvm')
            document.documentElement.style.setProperty('--bgcolor0', '#04b0ee');
        })

        socket.on('response', (data) => {
            sid = JSON.parse(data).sid;
        })

        U = document.querySelector('#input-U').value;
        Re = document.querySelector('#input-Re').value;
        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        // Send data to the server with a custom event name.
        socket.emit('message', {
            flag: 'fvm',
            U: U,
            Re: Re,
            N: N,
            Np: Np,
            simname: simname,
            newname: newname,
            sid: sid,
        });

        // Listen for a response from the server with the same event name.
        socket.on('response', function (data) {

            newData = JSON.parse(data);
            //console.log('Received data from the server:', newData);

            if (newData.x === 0) {
                //window.scrollTo(0, 65)
                //document.getElementById('myChartConv').scrollIntoView();
                //window.scrollTo(0, document.body.scrollHeight);
                //document.body.style.zoom = 1.0;
                //window.scrollTo(0, document.body.scrollIntoView);
            }

            if (newData.hasOwnProperty('pressure')) {
                sid = newData.sid;

                myChartConv.data.labels.push(newData.x); // need to change
                //heroForm.style = 'background-color: rgba(255,0,0,'+Math.abs(Math.sin((newData.x + 0.1) / 100))+');'
                myChartConv.data.datasets[0].data.push(newData.pressure);
                //myChartConv.data.datasets[0].data.push(newData.pressure);
                myChartConv.data.datasets[1].data.push(newData.umom);
                myChartConv.data.datasets[2].data.push(newData.vmom);
                myChartConv.update();

            } else if (newData.hasOwnProperty('u')) {
                u = newData.u;
                v = newData.v;

                //socket.emit('close_connection', {sid: sid});

                clearInterval(statusInterval);

                //btn0.setAttribute('data-content', 'Run');
                btn0.classList.remove('content-stop');
                btn0.classList.add('content-run');

                //heroForm.style = 'background-color: rgba(10, 10, 10, 0.85);' //Commented 240323 1433
                document.documentElement.style.setProperty('--animation0', '');
                document.documentElement.style.setProperty('--bgcolor0', '#CEB888');
                document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');

                document.getElementById("uv").disabled = false;

                document.documentElement.style.setProperty('--animation-gridConv', '');

            } else if (newData.hasOwnProperty('msg')) {
                window.alert(newData.msg)
                btn0.classList.remove('content-stop');
                btn0.classList.add('content-run');
                document.documentElement.style.setProperty('--bgcolor0', '#CEB888');
                document.documentElement.style.setProperty('--animation-gridConv', '');
            }
        });

        socket.on('reconnect', () => {
            // Handle reconnection logic (e.g., resuming the simulation)
        });

        socket.on('reconnect_error', (error) => {
            console.log('Reconnection error:', error);
        });


        /* socket.onmessage = function(e) {
            newData = JSON.parse(e.data);
            //console.log("newData: ", newData)

            if (newData.x === 0) {
                //window.scrollTo(0, 65)
                //document.getElementById('myChartConv').scrollIntoView();
                //window.scrollTo(0, document.body.scrollHeight);
                //document.body.style.zoom = 1.0;
                //window.scrollTo(0, document.body.scrollIntoView);
            }

            if (newData.hasOwnProperty('pressure')) {
                myChartConv.data.labels.push(newData.x); // need to change
                //heroForm.style = 'background-color: rgba(255,0,0,'+Math.abs(Math.sin((newData.x + 0.1) / 100))+');'
                myChartConv.data.datasets[0].data.push(newData.pressure);
                myChartConv.data.datasets[1].data.push(newData.umom);
                myChartConv.data.datasets[2].data.push(newData.vmom);
                myChartConv.update();

            } else if (newData.hasOwnProperty('u')) {
                u = newData.u;
                v = newData.v;
                console.log("newData: ", newData)
                //localStorage.setItem("testV", newData.testV)
            } else if (newData.hasOwnProperty('msg')) {
                window.alert(newData.msg)
            }
        }; */

       /*  socket.onclose = function() {
            console.log('Closed FVM Socket');

            btn0.setAttribute('data-content', 'Run');

            //window.scrollTo(0, document.body.scrollTop);
            //window.scrollTo(0, document.body.scrollHeight);
            //window.scrollTo(0, document.body.scrollIntoView);
            clearInterval(statusInterval);
            heroForm.style = 'background-color: rgba(10, 10, 10, 0.85);'

            document.documentElement.style.setProperty('--animation0', '');
            document.documentElement.style.setProperty('--bgcolor0', '#CEB888');
            document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');

            document.getElementById("uv").disabled = false;
        }; */
    });

    /* fvm route END */

    /* genP route START */

    const genP = document.getElementById("uv");

    genP.addEventListener('click', () => {

        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        //const socket2 = new WebSocket(webSocketUri2);

        const socket = io.connect('/genP');

        socket.on('connect', () => {
            console.log('Client connected to /genP');
            document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
            document.documentElement.style.setProperty('--bgcolor1', '#04b0ee');
        })

        socket.on('response', (data) => {
            sid = data.sid;
        })

        socket.emit('message', {
            flag: 'integration',
            N: N,
            Np: Np,
            Nint: Nint,
            simname: 'default',
        })

        socket.on('response', (data) => {
            newData = JSON.parse(data);
            sid = newData.sid;

            clearInterval(statusInterval);
            //heroForm.style = 'background-color: black;'

            document.getElementById("uv").disabled = true;
            document.getElementById("streamline").disabled = false;
            document.getElementById("save").disabled = false;

            document.documentElement.style.setProperty('--animation1', '');
            document.documentElement.style.setProperty('--bgcolor1', '#CEB888');
            document.documentElement.style.setProperty('--animation2', 'rotate 2s infinite linear');
        })
    });
    /* genP route END */

    /* genS route START */

    var chartNum = 0;

    var myEye;
    var ctxMyEye;
    var myEyeDataset;

    var container2 = document.getElementsByClassName('container2')[0]
    var streamDatasets = [];
    var centerlineDatasets = { "yu": [], "xv": [] }
    var ctxs = [];
    var ctxsP = [];
    var ctxsPlots = { "yu": [], "xv": [] };
    var myScatters = [];
    var myPressures = [];
    var myPlots = { "yu": [], "xv": [] }
    var img_srcs = [];
    var imgP_srcs = [];
    var images = [];
    var imagesP = [];
    var imgPlugins = [];
    var imgPluginsP = [];
    var intervals = []; var ctrs = [];

    var xdata = []; var ydata = [];

    const genS = document.getElementById("streamline");

    /* Socket linked to animate streamlines button */
    genS.addEventListener('click', () => {

        start = Date.now();

        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        //const socket3 = new WebSocket(webSocketUri3);

        const socket = io.connect('/genS');

        socket.on('connect', () => {
            console.log('Client connected to /genS')
            document.documentElement.style.setProperty('--bgcolor2', '#04b0ee');
        })

        socket.emit('message', {
            flag: 'streamline',
            N: N,
            Nint: Nint,
            simname: 'default',
        });

        socket.on('response', (data) => {
            const newData = JSON.parse(data);

            //console.log("newData /genS: ", newData)

            chartNum = ctxs.length;

            xdata[chartNum] = newData.x;
            ydata[chartNum] = newData.y;

            let flag = 'fvm';
            generatePlots(newData, flag);

            clearInterval(statusInterval);
            //document.getElementById('grid0').style = 'border-color: black;'

            document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');

            document.documentElement.style.setProperty('--animation2', '');
            document.documentElement.style.setProperty('--bgcolor2', '#CEB888');

            document.getElementById("streamline").disabled = true;
        });
    });

    /* genS route END */

    function createDiv(chartNum, container, ids, classNames, gridRow) {

        let grid = document.createElement("div");
        grid.style.cssText = `
            display: grid;
            grid-template-columns: max-content;
            grid-template-rows: max-content max-content max-content max-content;
            grid-gap: 10px;
        `;

        //width = 400; height = 350;
        width = 100; height = 100;

        // Create hero div element
        let hero = document.createElement("div");

        // Split the classNames string into an array of class names
        const heroClasses = classNames.hero.split(' ');

        // Add each class name separately
        heroClasses.forEach(className => {
            hero.classList.add(className);
        });

        //hero.classList.add('sortable-item')

        hero.id = ids.hero; // Add a CSS id for styling

        let width_hero = 350;
        hero.style.cssText = `
                top: 0;
                margin-right: 10px;
                padding: 10px;
                cursor: grab;
                display: inline-block;
                width: ${width_hero}px;
                height: calc(${width_hero}px);
                transition: transform 1.5s ease-in;
                animation: fadeIn 1s ease-in-out;
            `;

        // Create canvas element
        const canvas = document.createElement("canvas");
        canvas.classList.add(classNames.canvas);
        canvas.id = ids.canvas;
        canvas.style.cssText = `
            width:${width}%;
            height:${height-5}%;
        `;

        // insertBefore everything nested
        hero.appendChild(canvas);
        grid.appendChild(hero)
        container.insertBefore(grid, container.firstElementChild);

    }

    function createDivNew(chartNum, container, ids, flag) {

        let grid = document.createElement("div");
        grid.id = `grid${chartNum}`;
        grid.classList.add(`grid${chartNum}`)
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, max-content);
            grid-template-rows: repeate(3, auto);
            grid-gap: 0.5rem;
            transform: translate(-100%, 0);
            transition: transform 1.5s ease-in;
        `;

        const heroIds = ids.heros; const heroClassNames = heroIds;
        const canvasIds = ids.canvases; const canvasClassNames = canvasIds;

        //width = 400; height = 350;
        width = 100; height = 100;

        //onsole.log("heroIds: ", heroIds.length)

        heroIds.forEach((heroId, idx) => {
            //console.log("heroId: ", heroId)

            const hero = document.createElement("div");

            hero.id = heroId;
            hero.classList.add(heroId);

            hero.style.cssText = `
                grid-row: 3;
                top: 0;
                margin-right: 0px;
                padding: 0px;
                cursor: grab;
                display: inline-block;
                width: calc(8*var(--cell-width));
                height: calc(8*var(--cell-width));
                transition: transform 1.5s ease-in;
                animation: fadeIn 1s ease-in-out;
            `;

            // create close button
            const closeButton = document.createElement("button");
            closeButton.textContent = "✖"; // You can customize this to any icon or text
            closeButton.style.cssText = `
                position: absolute;
                top: 5px;
                right: 2rem;
                background: none;
                border: none;
                cursor: pointer;
                color: #CEB888;
            `;

            closeButton.addEventListener("click", () => {
                grid.remove();
            });

            // create and display title for each hero
            const divTitle = document.createElement("div");

            divTitle.classList.add(`${canvasIds[idx]}-title`);

            if (flag === 'dd') {
                divTitle.innerHTML = `${simname}`;
            } else {
                divTitle.innerHTML = '';
            }

            divTitle.style.cssText = `
                grid-row: 1;
                grid-column: 1 / -1;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #CEB888;
                margin-bottom: 0.0rem;
                padding: 0.0rem;
            `;

            // create and display parameters for each hero
            const div = document.createElement("div");

            div.classList.add(`${canvasIds[idx]}-title`);
            div.innerHTML = `U = ${U}, Re = ${Re}, N = ${N}, Np = ${Np}`;

            div.style.cssText = `
                grid-row: 2;
                grid-column: 1 / -1;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #CEB888;
                margin-bottom: 0.0rem;
                padding: 0.0rem;
            `;

            // create canvas element for each hero
            const canvas = document.createElement("canvas");

            canvas.id = canvasIds[idx];
            canvas.classList.add(canvasIds[idx]);

            width = 'calc(4*var(--cell-width));';
            height = 'calc(4*var(--cell-width));';

            canvas.style.cssText = `
                grid-row: 2;
                width: ${width};
                height: ${height};
            `;
            /* canvas.style.cssText = `
                width:${width}%;
                height:${height-5}%;
            `; */

            hero.appendChild(divTitle);
            hero.appendChild(div);
            hero.appendChild(canvas);
            grid.appendChild(divTitle);
            grid.appendChild(div);
            grid.appendChild(closeButton);
            grid.appendChild(hero);
        })

        container.insertBefore(grid, container.firstElementChild);

        // Use a timeout to ensure the animation takes effect after the insertion
        setTimeout(() => {
            //console.log("setTimeout chartNum: ", chartNum)
            // Move the new grid to its final position (right)
            if (chartNum > 0) {
                const gridPrev = document.getElementById(`grid${chartNum - 1}`);
                if (gridPrev) {
                    gridPrev.style.transform = `translate(0,0)`;
                }
                //gridPrev.style.transform = `translate(0,0)`;
            }
            grid.style.transform = 'translate(0,0)';
        }, 0);
    };

    function getImageAnimation(simname, flag) {

        const socket = io.connect('/retreive');

        socket.on('connect', () => {
            document.documentElement.style.setProperty('--bgcolor5', '#04b0ee');
            document.documentElement.style.setProperty('--animation5', 'rotate 2s infinite linear');
        })

        console.log('simname: ', simname)

        socket.emit('message', {
            flag: 'retreive',
            simname: simname,
        })

        socket.on('response', (data) => {

            const newData = JSON.parse(data); sid = newData.sid;
            const params = newData.params;

            U = params.U;
            Re = params.Re;
            N = params.N;
            Np = params.Np;

            //document.querySelector('#input-U').value = U;
            //document.querySelector('#input-Re').value = Re;
            //document.querySelector('#input-N').value = N;
            //document.querySelector('#input-Np').value = Np;

            objC = newData.objC; resids = objC.resid;
            uresid = resids.u; vresid = resids.v; cresid = resids.c

            /* Update convergence chart (need to add new convergence charts)  */

            resetConvergence()
            for (let i = 0; i < uresid.length; i++) {
                myChartConv.data.labels.push(i);
                myChartConv.data.datasets[0].data.push(cresid[i]);
                myChartConv.data.datasets[1].data.push(uresid[i]);
                myChartConv.data.datasets[2].data.push(vresid[i]);
            }
            myChartConv.update();

            chartNum = ctxs.length;
            xdata[chartNum] = newData.objD.x;
            ydata[chartNum] = newData.objD.y;

            //let flag = '';
            generatePlots(newData, flag);

            socket.emit('close_connection', { sid: sid });

            //heroForm.style = 'background-color: rgba(10, 10, 10, 0.85);' // Commented 240324 1434
            document.documentElement.style.setProperty('--bgcolor5', '#CEB888');
            document.documentElement.style.setProperty('--animation5', '');
            document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');
        });
    };

    function generatePlots(newData, flag) {


        ctxMyEye = document.getElementById("myEye").getContext("2d");

        ids = {
            "heros": [
                `hero${chartNum}`,
                `heroP${chartNum}`,
                `heroPlot_yu${chartNum}`,
                `heroPlot_xv${chartNum}`,

            ],
            "canvases": [
                `myChart${chartNum}`,
                `myChartP${chartNum}`,
                `myPlot_yu${chartNum}`,
                `myPlot_xv${chartNum}`,
            ]
        }

        createDivNew(chartNum, container2, ids, flag);

        ctxs[chartNum] = document.getElementById(ids.canvases[0]).getContext("2d");
        ctxsP[chartNum] = document.getElementById(ids.canvases[1]).getContext("2d");
        ctxsPlots.yu[chartNum] = document.getElementById(ids.canvases[2]).getContext("2d");
        ctxsPlots.xv[chartNum] = document.getElementById(ids.canvases[3]).getContext("2d");

        /* Initilize datasets */

        myEyeDataset = {
            labels: [],
            datasets: [
                {
                borderColor: "white",
                borderRadius: 1.5,
                showLine: true,
                borderWidth: fontSizeInPixels / 32,
                pointRadius: fontSizeInPixels / 16,
                pointBackgroundColor: "black",
                data: [
                    {
                    x: NaN,
                    y: NaN,
                    },
                    {
                    x: NaN,
                    y: NaN,
                    }
                ]
                },
            ]
        };

        if (chartNum == 0) {
            myEye = new Chart(ctxMyEye, {
                type: "scatter",
                data: myEyeDataset,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    beginAtZero: true,
                    //font: {
                    //    size: fontSizeInPixels / 4,
                    //    weight: 'normal'
                    //},
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'x/L',
                                color: "#CEB888",
                                font: {
                                    size: `${16*newFontSize / htmlFontSize}`,
                                },
                            },
                            min: 0.4,
                            max: 0.8,

                            ticks: {
                                color: "#CEB888",
                                min: 0.4,
                                max: 0.8,
                                stepSize: 0.1,
                                padding: 0,
                                font: {
                                    size: `${14*newFontSize / htmlFontSize}`,
                                },
                            },
                            grid: {
                                display: true,
                                borderColor: "#CEB888",
                                drawBorder: true,
                                drawOnChartArea: false,
                                color: "#CEB888",
                                drawTicks: true,
                            },
                        },
                        y: {
                            min: 0.4,
                            max: 0.8,
                            title: {
                                display: true,
                                text: 'y/L',
                                color: "#CEB888",
                                font: {
                                    size: `${16*newFontSize / htmlFontSize}`,
                                },
                            },
                            ticks: {
                                color: "#CEB888",
                                precision: 1,
                                callback: (value, idx, values) => {
                                    return value;
                                },
                                font: {
                                    size: `${14*newFontSize / htmlFontSize}`,
                                },
                                padding: 1,
                            },
                            grid: {
                                display: true,
                                borderColor: "#CEB888",
                                drawBorder: true,
                                drawOnChartArea: false,
                                color: "#CEB888",
                                drawTicks: true,
                            },
                        },
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Primary Vortex Location',
                            color: '#CEB888',
                            font: {
                                size: `${16*newFontSize / htmlFontSize}`,
                                //size: fontSizeInPixels / 2.75,
                                weight: 'normal'
                            },
                            padding: 4,
                            position: 'top',
                            align: 'end',
                        },
                        legend: {
                            display: false,
                        },
                        annotation: {
                            annotations: []
                        },
                    },
                    interaction: {
                        mode: 'point',
                        font: fontSizeInPixels / 4,
                    },
                },
            });

            const gridFormHeight = gridForm.offsetHeight;
            console.log('gridFormHeight: ',gridFormHeight)
            document.querySelector('.gridEye').style.width = `calc(${gridFormHeight}px + 0px)`;
            document.querySelector('.gridEye').style.height = `calc(${gridFormHeight}px + 0px)`;

            window.dispatchEvent(new Event('resize'));
        }

        myEye.data.labels.push(newData.value)
        myEye.data.datasets[0].data.push({ "x": newData.eye.x, "y": newData.eye.y });

        streamDatasets[chartNum] = {
            datasets: [
              {
                /* title: "Velocity Field", */
                borderColor: "white",
                borderRadius: 1.5,
                showLine: true,
                borderWidth: fontSizeInPixels / 16,
                pointRadius: fontSizeInPixels / 8,
                pointBackgroundColor: "black",
                data: [
                  {
                    x: NaN,
                    y: NaN,
                  },
                  {
                    x: NaN,
                    y: NaN,
                  }
                ]
              },
            ]
        };

        centerlineDatasets.yu[chartNum] = [
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#77DD77",
                        backgroundColor: "#77DD77",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd["yu"],
                        showLine: true,
                    },
                ]
            }
        ];

        centerlineDatasets.xv[chartNum] = [
            {
                datasets: [
                    {
                        label: 'CFD Simulation Tool',
                        borderColor: "#779ECB",
                        backgroundColor: "#779ECB",
                        borderWidth: 1,
                        pointRadius: 0,
                        pointBackgroundColor: '#CFCFC4',
                        data: newData.cfd["xv"],
                        showLine: true,
                    },
                ]
            }
        ];

        //console.log("newData.img_src", newData.img_src)

        img_srcs[chartNum] = newData.img_src;
        imgP_srcs[chartNum] = newData.imgP_src;

        genScatter(
            img_srcs[chartNum],
            imgP_srcs[chartNum],
            chartNum,
        );

        genNewStreamlines(chartNum, flag)

        const grid0 = document.querySelector('.grid0');

        console.log('grid0: ', grid0.style.fontSize)

        grid0.style.fontSize = `${1.25*(newFontSize / htmlFontSize)}rem`;
        document.querySelector('.fourth-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
        document.querySelector('.fourth-b-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
        document.querySelector('.fourth-c-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
        document.querySelector('.fourth-d-text-container').style.fontSize = `${1.25 * newFontSize / htmlFontSize}rem`;
    };

    function genScatter(img_src, imgP_src, chartNum) {

        images[chartNum] = new Image(); imagesP[chartNum] = new Image();
        images[chartNum].src = img_src; imagesP[chartNum].src = imgP_src;

        imgPlugins[chartNum] = {
            id: 'custom_canvas_background_image',
                beforeDraw: () => {
                    if (images[chartNum].complete) {
                        ctxs[chartNum].drawImage(
                            images[chartNum],
                            myScatters[chartNum].chartArea.left*0.95,
                            myScatters[chartNum].chartArea.top*0.8,
                            myScatters[chartNum].chartArea.width*1.03,
                            myScatters[chartNum].chartArea.height*1.05);
                        //ctxs[chartNum].drawImage(
                        //    images[chartNum],
                        //    myScatters[chartNum].chartArea.left*0.88,
                        //    myScatters[chartNum].chartArea.top,
                        //    myScatters[chartNum].chartArea.width*1.03,
                        //    myScatters[chartNum].chartArea.height*1.02);
                        //ctx3.drawImage(image, myScatter.chartArea.left*0.8, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);
                        //ctx3.drawImage(image, myScatter.chartArea.left*0.75, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);
                    } else {
                        images[chartNum].onload = () => myScatters[chartNum].draw();
                    }
                }
        };

        imgPluginsP[chartNum] = {
            id: 'custom_canvas_background_image',
                beforeDraw: () => {
                    if (images[chartNum].complete) {
                        ctxsP[chartNum].drawImage(
                            imagesP[chartNum],
                            myPressures[chartNum].chartArea.left,
                            myPressures[chartNum].chartArea.top,
                            myPressures[chartNum].chartArea.width*1,
                            myPressures[chartNum].chartArea.height*1);
                        //ctxsP[chartNum].drawImage(
                        //    imagesP[chartNum],
                        //    myPressures[chartNum].chartArea.left*0.88,
                        //    myPressures[chartNum].chartArea.top,
                        //    myPressures[chartNum].chartArea.width*1.03,
                        //    myPressures[chartNum].chartArea.height*1.02);
                    } else {
                        imagesP[chartNum].onload = () => myPressures[chartNum].draw();
                    }
                }
        };

        myScatters[chartNum] = new Chart(ctxs[chartNum], {
            type: "scatter",
            data: streamDatasets[chartNum],
            options: {
                scales: {
                    xB: {
                        position: "bottom",
                        display: true,
                        title: {
                            display: true,
                            text: "x/L",
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            //beginAtZero: false,
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            color: "#CEB888",
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    xT: {
                            position: "top",
                            display: true,
                            min: 0,
                            max: 1,
                            ticks: {
                                display: false,
                            },
                                grid: {
                                display: true,
                                borderColor: "#CEB888",
                                drawBorder: true,
                                drawOnChartArea: false,

                            },
                    },
                    yL: {
                            //beginAtZero: false,
                            position: "left",
                            display: true,
                            title: {
                                display: true,
                                text: "y/L",
                                color: "#CEB888",
                                font: {
                                    size: fontSizeInPixels / 3
                                },
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 0.1,
                            color: "#CEB888",
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    yR: {
                            position: "right",
                            display: true,
                            min: 0,
                            max: 1,
                            ticks: {
                                display: false,
                            },
                                grid: {
                                display: true,
                                borderColor: "#CEB888",
                                drawBorder: true,
                                drawOnChartArea: false,
                            },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Velocity Field w/ Stream Particles',
                        color: '#CEB888',
                        font: {
                            //size: `${12*(newFontSize / htmlFontSize)}`,
                            size: fontSizeInPixels / 2.75,
                            weight: 'normal'
                        },
                        padding: 4,
                        position: 'bottom',
                        align: 'end',
                    },
                    legend: {
                        display: false
                    },
                },
                imgPlugin: {}
            },
            plugins: [imgPlugins[chartNum]]
        });

        myPressures[chartNum] = new Chart(ctxsP[chartNum], {
            type: "scatter",
            data: streamDatasets[chartNum],
            options: {
                scales: {
                    xB: {
                        position: "bottom",
                        display: true,
                        title: {
                            display: true,
                            text: "x/L",
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            //beginAtZero: false,
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            color: "#CEB888",
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    xT: {
                            position: "top",
                            display: true,
                            min: 0,
                            max: 1,
                            ticks: {
                                display: false,
                            },
                                grid: {
                                    display: true,
                                    borderColor: "#CEB888",
                                    drawBorder: true,
                                    drawOnChartArea: false,
                                    lineWidth: 2,
                                    borderWidth: 2,
                            },
                    },
                    yL: {
                            //beginAtZero: false,
                            position: "left",
                            display: true,
                            title: {
                                display: true,
                                text: "y/L",
                                color: "#CEB888",
                                font: {
                                    size: fontSizeInPixels / 3
                                },
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 0.1,
                            color: "#CEB888",
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    yR: {
                            position: "right",
                            display: true,
                            min: 0,
                            max: 1,
                            ticks: {
                                display: false,
                            },
                                grid: {
                                    display: true,
                                    borderColor: "#CEB888",
                                    drawBorder: true,
                                    drawOnChartArea: false,
                            },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Pressure Field w/ Stream Particles',
                        color: '#CEB888',
                        font: {
                            size: fontSizeInPixels / 2.75,
                            weight: 'normal'
                        },
                        padding: 4,
                        position: 'bottom',
                        align: 'end',
                    },
                    legend: {
                        display: false
                    },
                },
                imgPlugin: {}
            },
            plugins: [imgPluginsP[chartNum]]
        });

        myPlots.yu[chartNum] = new Chart(ctxsPlots.yu[chartNum], {
            type: "scatter",
            data: centerlineDatasets.yu[chartNum][0],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        position: "bottom",
                        display: true,
                        title: {
                            display: true,
                            text: 'y/L',
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        //min: 0,
                        //max: 1.01,

                        ticks: {
                            color: "#CEB888",
                            //min: 0,
                            //max: 1,
                            stepSize: 0.1,
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    /* xT: {
                        position: "top",
                        display: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            display: false,
                        },
                            grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,

                        },
                    }, */
                    y: {
                        //min: -0.4,
                        //max: 1,
                        title: {
                            position: "left",
                            display: true,
                            text: 'u/U',
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        ticks: {
                            color: "#CEB888",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            },
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    /* yR: {
                        position: "right",
                        display: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            display: false,
                        },
                            grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                        },
                    }, */
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Horizontal Velocity thru Primary Vortex.',
                        color: '#CEB888',
                        font: {
                            size: fontSizeInPixels / 2.75,
                            weight: 'normal'
                        },
                        padding: 4,
                        position: 'bottom',
                        align: 'end',
                    },
                    legend: {
                        display: false,
                    }
                }
            },
        });

        myPlots.xv[chartNum] = new Chart(ctxsPlots.xv[chartNum], {
            type: "scatter",
            data: centerlineDatasets.xv[chartNum][0],
            options: {
                beginAtZero: true,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        position: "bottom",
                        display: true,
                        title: {
                            display: true,
                            text: 'x/L',
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        //min: 0,
                        //max: 1.01,

                        ticks: {
                            color: "#CEB888",
                            //min: 0,
                            //max: 1,
                            stepSize: 0.1,
                            padding: 15,
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            tickLength: -8,
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    /* xT: {
                        position: "top",
                        display: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            display: false,
                        },
                            grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,

                        },
                    }, */
                    y: {
                        //min: -0.4,
                        //max: 1,
                        title: {
                            position: "left",
                            display: true,
                            text: 'v/V',
                            color: "#CEB888",
                            font: {
                                size: fontSizeInPixels / 3
                            },
                        },
                        ticks: {
                            color: "#CEB888",
                            precision: 1,
                            callback: (value, idx, values) => {
                                return value;
                            },
                            font: {
                                size: fontSizeInPixels / 3.5
                            },
                        },
                        grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#CEB888",
                            drawTicks: true,
                            lineWidth: 1,
                            borderWidth: 1,
                        },
                    },
                    /* yR: {
                        position: "right",
                        display: true,
                        min: 0,
                        max: 1,
                        ticks: {
                            display: false,
                        },
                            grid: {
                            display: true,
                            borderColor: "#CEB888",
                            drawBorder: true,
                            drawOnChartArea: false,
                        },
                    }, */
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Vertical Velocity thru Primary Vortex.',
                        color: '#CEB888',
                        font: {
                            size: fontSizeInPixels / 2.75,
                            weight: 'normal'
                        },
                        padding: 4,
                        position: 'bottom',
                        align: 'end',
                    },
                    legend: {
                        display: false,
                    }
                }
            },
        });
    };

    function startInterval(chartNum) {
        //if (intervals[chartNum]) {
        //    clearInterval(intervals[chartNum]); // Clear any existing interval
        //}

        const canvas0 = document.querySelector('.hero0');

        //const canvas0Width = canvas0.clientWidth;
        //const canvas0Height = canvas0.clientHeight;

        //const canvas2 = document.querySelector('.heroPlot_yu0');

        //canvas2.style.width = `${canvas0Width}px`;
        //canvas2.style.height = `${canvas0Height}px`;

        ctrs[chartNum] = 0;

        intervals[chartNum] = setInterval(function () {
            // Your interval logic here
            if (ctrs[chartNum] > Nint-1) {
                ctrs[chartNum] = 0;
            }

            var xxdata = [];
            var yydata = [];

            streamDatasets[chartNum].datasets.forEach(function(dataset, i) {

                xxdata = xdata[chartNum][i];
                yydata = ydata[chartNum][i];

                dataset.data = [
                    {
                        x: xxdata[ctrs[chartNum]],
                        y: yydata[ctrs[chartNum]]
                    }
                ]

                dataset.borderRadius = 1
                dataset.borderColor = "white"
                dataset.borderWidth = fontSizeInPixels / 32;
                dataset.pointRadius = fontSizeInPixels / 16;
                dataset.showLine = true
                dataset.pointBackgroundColor = "black"

            });


            //if (chartNum > 0) {
            //    myScatters[chartNum - 1].update();
            //    myPressures[chartNum - 1].update();
            //}
            myScatters[chartNum].update();
            myPressures[chartNum].update();

            ctrs[chartNum]++;

            //let delta = Date.now() - start
            ////console.log(":: Elapsed (s) =", Math.floor(delta/1000))


            // For demonstration purposes, I'm using console.log to represent the animation logic
            //console.log(`Chart ${chartNum} interval running`);
        }, 100);
    }

    // Function to restart the previous interval if chartNum > 0
    function restartPreviousInterval(chartNum) {
        if (chartNum > 0 && intervals[chartNum - 1]) {
            clearInterval(intervals[chartNum - 1]); // Clear the previous interval

            startInterval(chartNum - 1); // Restart the previous interval
        }
    }

    //adjust wrapper height based on content
    const adjustWrapperHeight = (wrapper, textContainer) => {
        const containerWidth = textContainer.clientWidth;
        document.documentElement.style.setProperty(`--${textContainer.dataset.textWidth}`, `${containerWidth}px`);

        const containerHeight = textContainer.clientHeight;
        wrapper.style.height = `${containerHeight}px`;
    };

    // set up observer for specific wrapper + text container
    const setupObserver = (wrapper, textContainer) => {
        // Initial adjustment
        adjustWrapperHeight(wrapper, textContainer);

        // Create a MutationObserver to watch for changes in the text container
        const observer = new MutationObserver(() => adjustWrapperHeight(wrapper, textContainer));

        // Config object for the observer (observe changes in childList and subtree)
        const observerConfig = {
            childList: true,
            subtree: true,
        };

        // Start observing changes in the text container
        observer.observe(textContainer, observerConfig);
    };

    const fourthTextContainer = document.querySelector('.fourth-text-container');
    const fourthWrapper = document.querySelector('.fourth-wrapper');
    const fourthBTextContainer = document.querySelector('.fourth-b-text-container');
    const fourthBWrapper = document.querySelector('.fourth-b-wrapper');
    const fourthCTextContainer = document.querySelector('.fourth-c-text-container');
    const fourthCWrapper = document.querySelector('.fourth-c-wrapper');
    const fourthDTextContainer = document.querySelector('.fourth-d-text-container');
    const fourthDWrapper = document.querySelector('.fourth-d-wrapper');

    fourthTextContainer.dataset.textWidth = 'fourth-text-width';
    setupObserver(fourthWrapper, fourthTextContainer);
    fourthBTextContainer.dataset.textWidth = 'fourth-b-text-width';
    setupObserver(fourthBWrapper, fourthBTextContainer);
    fourthCTextContainer.dataset.textWidth = 'fourth-c-text-width';
    setupObserver(fourthCWrapper, fourthCTextContainer);
    fourthDTextContainer.dataset.textWidth = 'fourth-d-text-width';
    setupObserver(fourthDWrapper, fourthDTextContainer);

    function startTypeWriter(prefix) {

        //console.log('classList (startTypeWriter): ', classList, 'prefix: ', `.startEffect${prefix}`)

        setTimeout(() => {

            //console.log("circles.keys: ", Object.keys(circles))

            var textContent;
            const text = document.createElement('div');

            const textContainer = document.querySelector(`.${prefix}-text-container`);

            if (prefix === "fourth") {
                text.classList.add('fourth-text');
                textContainer.appendChild(text);
                textContent = `Thank you for running your first simulation! Feel free to save, update, and load previous simulations.`;
            } else if (prefix === "fourth-b") {
                text.classList.add('fourth-b-text');
                textContainer.appendChild(text);
                textContent = `By increasing the Reynolds’ number (Re) incrementally, the following will occur. The velocity flow field will develop into a primary vortex near the geometric center with secondary vortices forming in the lower left and right corners. The secondary vortices will develop due to their proximity to two boundaries which will exhibit the no-slip condition, which is an important boundary condition in fluid mechanics that has been captured and rendered to the page with the stream particles moving at velocities determined by CFD solver.`;
            } else if (prefix === "fourth-c") {
                text.classList.add('fourth-c-text');
                textContainer.appendChild(text);
                textContent = `As Re increases, the primary vortex will shift towards the geometric center of the cavity, which is similar behavior to the benchmark datasets of Ghia, Ghia, and Shin. More so, secondary vortices will increase in size and new vortices will form in the upper right corner as Re increases above 3200. For Re = 5000, another small vortex will form in the south east corner.`;
            } else if (prefix === "fourth-d") {
                text.classList.add('fourth-d-text');
                textContainer.appendChild(text);
                textContent = `As for the normalized pressure field, the pressure is lowest within the primary vortex and the storm per se is calmest here. Finer meshes can add more clarity to the vortices visually.`;
            }

            // split text into array of words
            const words = textContent.split(' ');

            let index = 0;
            const textDiv = text;

            function typeWriter() {
                if (index < words.length) {

                    const word = words[index];

                    const link = document.createElement('a');
                    link.setAttribute('target', '_blank'); // Open link in a new tab

                    function splitandhighlight(word) {
                        // Split 'Lorem' into spans for each character
                        const chars = word.split('').map((char) => {
                            const span = document.createElement('span');
                            span.textContent = char;
                            return span;
                        });

                        chars.forEach((charSpan, index) => {
                            // Exclude applying the highlight effect to the last character (comma)
                            if (word === 'Dynamics,' && word.endsWith(',') && index === word.length - 1) {
                                // Add the character without the highlight effect
                                link.appendChild(document.createTextNode(charSpan.textContent));
                            } else {
                                // Apply the highlight effect to other characters
                                link.appendChild(charSpan);
                                setTimeout(() => {
                                    charSpan.classList.add('highlight-effect');
                                }, index * 100); // speed of highlight effect
                            }
                            /* link.appendChild(charSpan);
                            //console.log("charSpan: ", charSpan)
                            setTimeout(() => {
                                // Triggering the highlight effect for each character
                                charSpan.classList.add('highlight-effect');
                            }, index*100); */
                        });

                        // Add space between words
                        textDiv.appendChild(document.createTextNode(' '));
                    }

                    if (word === 'no-slip') {
                        link.setAttribute('href', 'https://en.wikipedia.org/wiki/No-slip_condition');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else if (word === 'storm') {
                        link.setAttribute('href', 'https://gpm.nasa.gov/education/articles/how-do-hurricanes-form#:~:text=This%20difference%20is%20because%20of,flows%20down%20into%20the%20eye.');
                        textDiv.appendChild(link);
                        splitandhighlight(word);
                    } else {
                        //if (word.includes('<i>') && word.includes('</i>')) {
                        //    textDiv.innerHTML += word + ' ';
                        //} else {
                            textDiv.appendChild(document.createTextNode(word + ' '));
                        //}
                    }

                    index++;

                    //introWrapper.style.setProperty('--intro-text-height', '98%')
                    //introWrapper.style.setProperty('--intro-text-width', '99.5%')

                    setTimeout(typeWriter, 50); // speed of each word
                    //setTimeout(typeWriter, 125); // speed of each word
                }
            }

            setTimeout(() => {
                textContainer.style.display = 'flex';
                typeWriter();
            }, 500);

        }, 250);

        //let el = document.querySelector(`.startEffect-${prefix}`);
        //let el = document.querySelector(`.startEffect-intro`);
        //el.style.display = 'none';

        if (prefix === 'fourth') {
            isFourthWriterOff = false;
        } else if (prefix === 'fourth-b') {
            isFourthBWriterOff = false;
        } else if (prefix === 'fourth-c') {
            isFourthCWriterOff = false;
        } else if (prefix === 'fourth-d') {
            isFourthDWriterOff = false;
        }
    }

    const gridEye = document.getElementById('gridEye');

    // Add event listener to gridEye to detect when it is rendered
    gridEye.addEventListener('transitionend', function() {
        // Get the new height of heroForm
        const heroFormHeight = heroForm.offsetHeight;

        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const upper = document.querySelector('.upper');

        // Set the height of .upper to accommodate the new height of heroForm
        upperContainer.style.height = `calc(${heroFormHeight}px + 1.5rem)`;
        //container1.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 1rem)`;
        container1.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`;
        container3.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`;
        container2.style.top = `calc(${navbarHeight + upper.offsetHeight}px + 2rem)`;
    });

    var isFourthWriterOff = true;
    var isFourthBWriterOff = true;
    var isFourthCWriterOff = true;
    var isFourthDWriterOff = true;

    function genNewStreamlines(chartNum, flag) {

        /* Initialize chartNum dataset */
        for (let i = 0; i < Np; i++) {
            streamDatasets[chartNum].datasets[i] = {};
            streamDatasets[chartNum].datasets[i].borderColor = "black";
            streamDatasets[chartNum].datasets[i].borderRadius = 1;
            streamDatasets[chartNum].datasets[i].pointRadius = 1.5;
            streamDatasets[chartNum].datasets[i].pointBackgroundColor = "white";
            streamDatasets[chartNum].datasets[i].data = [{x: 0.56, y: 0.53}];
        }

        /* Update chartNum chart */
        myEye.update();
        myScatters[chartNum].update();
        myPressures[chartNum].update();
        myPlots.yu[chartNum].update();
        myPlots.xv[chartNum].update();

        let gridEye = document.getElementById('gridEye');
        document.documentElement.style.setProperty('--GridEyeHeight', `${gridContainerHeight}px`);
        gridEye.classList.add('showGridEye');

        // Update the chart
        myEye.update();

        document.documentElement.style.setProperty(`--animationSP0`, `fadeInStreamParticles 1.5s ease-in`);

        //if (chartNum == 0) {
            setTimeout(() => {
                //console.log("setTimeout chartNum: ", chartNum)
                // Move the new grid to its final position (right)
                const grid = document.getElementById(`grid${chartNum}`)
                const hero = document.getElementById(`hero${chartNum}`)
                const canvas = document.getElementById(`myChart${chartNum}`)
                //hero.scrollIntoView({ behavior: "smooth", block: "start" });
                const container1 = document.getElementById('container1');
                container1.scrollIntoView({ behavior: "smooth", block: "start" });
                //container2.scrollIntoView({ behavior: "smooth" }); /* ch */

                //grid.scrollIntoView({ behavior: "smooth" });
                //hero.scrollIntoView({ behavior: "smooth" });
                //canvas.scrollIntoView({ behavior: "smooth" });
                //container2.scrollTop += -350;
                //window.scrollTo(0, document.body.scrollTop);
                //container2.scrollTop = 0;
            }, 0);
        //}
        if (chartNum > 0) {
            //clearInterval(intervals[chartNum - 1]);
            // Restart the previous interval
            restartPreviousInterval(chartNum);
        }

        // Start the interval for chartNum
        startInterval(chartNum);

        if (flag === 'fvm') {
            /* ADD CODE FOR DIALOG */
            if (isFourthWriterOff === true) {
                document.getElementById('fourth-wrapper').style.display = 'block';

                fourthWrapper.style.boxShadow = `0px 0px var(--gridicons-shad) rgba(0, 51, 102, 1)`;

                startTypeWriter('fourth');

                if (isFourthBWriterOff === true) {
                    setTimeout(() => {

                        document.getElementById('fourth-b-wrapper').style.display = 'block';

                        startTypeWriter('fourth-b');

                        if (isFourthCWriterOff === true) {
                            setTimeout(() => {

                                document.getElementById('fourth-c-wrapper').style.display = 'block';

                                startTypeWriter('fourth-c');

                                if (isFourthDWriterOff === true) {
                                    setTimeout(() => {
                                        document.getElementById('fourth-d-wrapper').style.display = 'block';
                                        startTypeWriter('fourth-d');
                                    }, 6500)
                                }
                            }, 8500)
                        }
                    }, 2000)
                }
            }
        }
    };

    const ul = document.getElementById("dd-menu");
    // Add a click event listener to the ul
    ul.addEventListener("click", function(e) {
        // Check if the clicked element is an li element
        if (e.target && e.target.nodeName === "LI") {
            // Get the selected li element
            const selectedLi = e.target;
            simname = selectedLi.textContent;
            // Do something with the selected li element
            let flag = 'dd'
            getImageAnimation(selectedLi.textContent, flag)
        }
    });

    function resetConvergence() {
        myChartConv.data.labels = [];
        myChartConv.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        myChartConv.update();
        //document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');
        document.documentElement.style.setProperty('--animation1', '');
    }

    function linspace(start, end, n) {
        if (n <= 1) {
            return [start];
        }

        const step = (end - start) / (n - 1);
        const result = [];

        for (let i = 0; i < n; i++) {
            result.push(start + i * step);
        }

        return result;
    }

});