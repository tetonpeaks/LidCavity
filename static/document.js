document.addEventListener("DOMContentLoaded", function () {

    var navbarTop = document.getElementById('navbar').offsetTop;
    var navbarHeight = document.getElementById('navbar').offsetHeight;
    var upperTop = document.getElementById('upper').offsetTop;
    var upperHeight = document.getElementById('upper').offsetHeight;
    var hero1Top = document.getElementById('hero1').offsetTop;
    var hero1Height = document.getElementById('hero1').offsetHeight;

    /* console.log(":: navbar =", navbarTop + navbarHeight)
    console.log(":: upper =", upperTop + upperHeight)
    console.log(":: hero1 =", hero1Top + hero1Height) */

    //document.getElementById('container1').offsetTop = navbarTop + navbarHeight + upperTop + upperHeight;

    setTimeout(() => {
        window.scrollTo(0, document.body.scrollTop);
        //document.querySelector('#checkbox').click();
    }, 250);

    setTimeout(() => {  document.getElementById('curtain__panel').remove() }, 3000);

    /* If the main page is served via https, the WebSocket must be served via
            "wss" (WebSocket Secure) */
    const scheme = window.location.protocol == "https:" ? 'wss://' : 'ws://';
    const webSocketUri1 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/fvm'; // flask-socket address in main.py

    const webSocketUri2 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/genP'; // flask-socket address in main.py

    const webSocketUri3 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/genS'; // flask-socket address in main.py
    const webSocketUri4 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/chk'; // flask-socket address in main.py
    const webSocketUri5 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/save'; // flask-socket address in main.py
    const webSocketUri6 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/load'; // flask-socket address in main.py
    const webSocketUri7 = scheme
                        + window.location.hostname // 127.0.0.1
                        + (location.port ? ':'+location.port: '') // 8080 if condition met
                        + '/retreive'; // flask-socket address in main.py

    var newData; var simname = null; var newname = null;
    var U; var Re; var Np; const Nint = 250;
    var u; var v; var speed; var L;
    var xdata = []; var ydata = [];
    var img_src;
    var ctr;
    var start;

    var statusInterval;

    var ofs = 0;
    var hero0 = document.getElementById("hero0");
    //hero0.style = 'background-color: rgba(255,0,0,'+Math.abs(Math.sin(ofs))+');'
    //hero0.style = 'background-color: rgba(10, 10, 10, 0.85);';

    document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');
    document.documentElement.style.setProperty('--animation1', '');
    document.documentElement.style.setProperty('--animation2', '');
    document.documentElement.style.setProperty('--animation3', '');

    document.documentElement.style.setProperty('--bgcolor0', '#FDFD96');
    document.documentElement.style.setProperty('--bgcolor1', '#FDFD96');
    document.documentElement.style.setProperty('--bgcolor2', '#FDFD96');
    document.documentElement.style.setProperty('--bgcolor3', '#FDFD96');

    /* document.querySelector('#home').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    })

    document.querySelector('#simulate').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    }) */

    const ctx1 = document.getElementById("myChart1").getContext("2d");
    var myChart1 = new Chart(ctx1, {
        responsive: true,
        type: "line",
        data: {
            datasets: [
                //{ label: "main", borderColor: "#000000", backgroundColor: "#000000", borderRadius: 1, borderWidth: 2, pointRadius: 3, pointBackgroundColor: "white"},
                { label: "pressure", borderColor: "#FF6961", backgroundColor: "#FF6961"  , borderRadius: 1, borderWidth: 2, pointRadius: 3, pointBackgroundColor: "white" },
                { label: "momentum-u", borderColor: "#77DD77", backgroundColor: "#77DD77", borderRadius: 1, borderWidth: 2, pointRadius: 3, pointBackgroundColor: "white" },
                { label: "momentum-v", borderColor: "#A7C7E7", backgroundColor: "#A7C7E7", borderRadius: 1, borderWidth: 2, pointRadius: 3, pointBackgroundColor: "white" },
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'iteration',
                        color: "#FDFD96",
                    },
                    ticks: {
                        color: "#FDFD96",
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
                    min: 0,
                    max: 1e4,
                    title: {
                        display: true,
                        text: 'residual',
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
                        borderColor: "#FDFD96",
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
                        borderColor: "#FDFD96",
                        drawBorder: true,
                        drawOnChartArea: false,

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

    //document.querySelector("#load").addEventListener('click', () => {})

    document.querySelector('#retreive').addEventListener('click', () => {

        const socket6 = new WebSocket(webSocketUri6);

        socket6.onopen = function() {
            console.log(":: Connected to Socket 6 ::");

            socket6.send(JSON.stringify(
                {
                    flag: '/* GET SIMNAMES */'
                }
            ))
        }

        socket6.onmessage = function(e) {
            let simnames = (JSON.parse(e.data));

            //console.log("simnames: ", simnames, "simnames.length: ",
            //    simnames.length, "slice", simnames.slice(-(simnames.length-1)))

            simnames = simnames.slice(-(simnames.length-1))

            // Get the ul element by its ID
            //const ul = document.getElementById("dd-menu");

            // Function to populate the ul with the array of items
            function populateList() {
                // Clear the existing content of the ul
                ul.innerHTML = "";

                // Iterate through the array and create an li element for each item
                simnames.forEach(simname => {
                    const li = document.createElement("li"); // Create a new li element
                    li.textContent = simname; // Set the text content of the li
                    ul.appendChild(li); // Append the li to the ul
                });
            }

            populateList()
        }

        socket6.onclose = function() {
            console.log('Closed Socket 6');

            window.scrollTo(0, document.body.scrollTop);
            //window.scrollTo(0, document.body.scrollHeight);
            //window.scrollTo(0, document.body.scrollIntoView);
            //clearInterval(statusInterval);
            hero0.style = 'background-color: rgba(10, 10, 10, 0.85);'

            //document.documentElement.style.setProperty('--animation0', '');
            //document.documentElement.style.setProperty('--bgcolor0', '#FDFD96');
            //document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
            //document.getElementById("uv").disabled = false;

        };
    })

    document.querySelector('#save').addEventListener('click', () => {

        U = document.querySelector('#input-U').value;
        Re = document.querySelector('#input-Re').value;
        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        document.documentElement.style.setProperty('--animation4', '');
        document.documentElement.style.setProperty('--bgcolor4', '#FDFD96');

        console.log("simname =", simname)
        if (simname == null) {
            simname = 'My First Simulation'
            simname = prompt('Please specify a name for the simulation: ', simname)
        } else {
            simname = prompt('Please specify a name for the simulation: ', simname)
            //simname = document.querySelector('#save').value;
            console.log("simname in else =", simname)
            //document.querySelector('#save').value = simname
        }

        var edata;

        var exists = false;

        if (simname !== null) {
            console.log('simname: ', simname)
            let socket4 = new WebSocket(webSocketUri4);

            socket4.onopen = function() {
                console.log(":: Connected to Socket 4 ::");

                document.documentElement.style.setProperty('--bgcolor0', '#04b0ee');

                /* Check if simulation run exists */
                socket4.send(JSON.stringify(
                    {
                        flag: '/* CHECK */',
                        U: U,
                        Re: Re,
                        N: N,
                        Np: Np,
                        simname: simname,
                        newData: newData,
                    }
                ));
            }

            socket4.onmessage = function(e) {
                edata = JSON.parse(e.data);

                /* Check if simulation already exists in DB */
                exists = edata.chk;
                if (exists === true) {
                    newname = prompt(edata.msg, simname)
                    if (newname !== simname) {
                        simname = newname
                        document.querySelector('#save').value = newname
                    }
                }
                //console.log("exists: ", exists, "simname: ", simname, "newname: ", newname)

                /* Save or update the simulation in the DB */
                let socket5 = new WebSocket(webSocketUri5);
                socket5.onopen = function() {
                    console.log(":: Connected to Socket 5 ::");

                    document.documentElement.style.setProperty('--bgcolor0', '#04b0ee');

                    socket5.send(JSON.stringify(
                        {
                            flag: '/* SAVE-UPDATE */',
                            U: U,
                            Re: Re,
                            N: N,
                            Np: Np,
                            simname: simname,
                            newname: simname,
                            newData: newData,
                            exists: exists,
                        }
                    ));

                    socket5.onmessage = function(e) {
                        let obj = JSON.parse(e.data);
                        console.log(obj)
                        window.alert(obj.msg)
                    }

                    socket5.onclose = function() {
                        console.log('Closed Socket 5');

                        window.scrollTo(0, document.body.scrollTop);
                        //window.scrollTo(0, document.body.scrollHeight);
                        //window.scrollTo(0, document.body.scrollIntoView);
                        //clearInterval(statusInterval);
                        hero0.style = 'background-color: rgba(10, 10, 10, 0.85);'

                        //document.documentElement.style.setProperty('--animation0', '');
                        //document.documentElement.style.setProperty('--bgcolor0', '#FDFD96');
                        //document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
                        //document.getElementById("uv").disabled = false;

                    };
                }
            };

            socket4.onclose = function() {
                console.log('Closed Socket 4');

                window.scrollTo(0, document.body.scrollTop);
                //window.scrollTo(0, document.body.scrollHeight);
                //window.scrollTo(0, document.body.scrollIntoView);
                //clearInterval(statusInterval);
                hero0.style = 'background-color: rgba(10, 10, 10, 0.85);'

                document.documentElement.style.setProperty('--animation4', '');
                document.documentElement.style.setProperty('--bgcolor4', '#FDFD96');
                //document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
                //document.getElementById("uv").disabled = false;

            };
        }

    })

    document.querySelector('#reset1').addEventListener('click', () => { resetConvergence() });

    //document.getElementById("uv").disabled = true;
    //document.getElementById("streamline").disabled = true;

    /* fvm route START */

    document.querySelector('#run').addEventListener('click', () => {

        /* Reset convergence chart */
        resetConvergence()

        U = document.querySelector('#input-U').value;
        Re = document.querySelector('#input-Re').value;
        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        const socket1 = new WebSocket(webSocketUri1);

        socket1.onopen = function() {
            console.log(":: Connected to Socket 1 ::");

            document.documentElement.style.setProperty('--bgcolor0', '#04b0ee');

            socket1.send(JSON.stringify(
                {
                    flag: '/* FVM */',
                    U: U,
                    Re: Re,
                    N: N,
                    Np: Np,
                    simname: simname,
                    newname: newname,
                }
            ));
        }

        socket1.onmessage = function(e) {
            newData = JSON.parse(e.data);

            if (newData.x === 0) {
                //window.scrollTo(0, 65)
                //document.getElementById('myChart1').scrollIntoView();
                //window.scrollTo(0, document.body.scrollHeight);
                //document.body.style.zoom = 1.0;
                //window.scrollTo(0, document.body.scrollIntoView);
            }

            if (newData.hasOwnProperty('pressure')) {
                myChart1.data.labels.push(newData.x); // need to change
                //hero0.style = 'background-color: rgba(255,0,0,'+Math.abs(Math.sin((newData.x + 0.1) / 100))+');'
                /* myChart1.data.datasets[0].data.push(newData.total);
                myChart1.data.datasets[1].data.push(newData.pressure);
                myChart1.data.datasets[2].data.push(newData.umom);
                myChart1.data.datasets[3].data.push(newData.vmom); */
                myChart1.data.datasets[0].data.push(newData.pressure);
                myChart1.data.datasets[1].data.push(newData.umom);
                myChart1.data.datasets[2].data.push(newData.vmom);
                myChart1.update();
            } else if (newData.hasOwnProperty('u')) {
                u = newData.u;
                v = newData.v;
                console.log("newData: ", newData)
                //localStorage.setItem("testV", newData.testV)
            } else if (newData.hasOwnProperty('msg')) {
                window.alert(newData.msg)
            }
        };

        socket1.onclose = function() {
            console.log('Closed Socket 1');

            window.scrollTo(0, document.body.scrollTop);
            //window.scrollTo(0, document.body.scrollHeight);
            //window.scrollTo(0, document.body.scrollIntoView);
            clearInterval(statusInterval);
            hero0.style = 'background-color: rgba(10, 10, 10, 0.85);'

            document.documentElement.style.setProperty('--animation0', '');
            document.documentElement.style.setProperty('--bgcolor0', '#FDFD96');
            document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
            document.getElementById("uv").disabled = false;

        };
    });

    /* fvm route END */

    /* genP route START */

    document.querySelector('#uv').addEventListener('click', () => {

        N = document.querySelector('#input-N').value;
        Np = document.querySelector('#input-Np').value;

        const socket2 = new WebSocket(webSocketUri2);

        socket2.onopen = function() {

            console.log(":: Connected to Socket 2 ::")

            clearInterval(interval3)
            document.documentElement.style.setProperty('--bgcolor1', '#04b0ee');
            document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');

            socket2.send(JSON.stringify(
                {
                    flag: '/* INTEGRATION */',
                    N: N,
                    Np: Np,
                    Nint: Nint,
                    simname: 'default',
                }
            ));
        }

        //socket2.onmessage = function(e) {
            //window.alert(e.msg)
            //newData = JSON.parse(e.data);

            //if (newData.hasOwnProperty('x')) {
                //xdata = newData.x;
                //ydata = newData.y;
            //}
        //};

        socket2.onclose = function() {
            console.log('Closed Socket 2');

            clearInterval(statusInterval);
            //hero0.style = 'background-color: black;'

            //document.getElementById("uv").disabled = true;
            document.getElementById("streamline").disabled = false;
            document.documentElement.style.setProperty('--animation1', '');
            document.documentElement.style.setProperty('--bgcolor1', '#FDFD96');
            document.documentElement.style.setProperty('--animation2', 'rotate 2s infinite linear');
        };
    });
    /* genP route END */
    var ctx3 = document.getElementById("myChart2").getContext("2d");

    var streamDataset = {
        datasets: [
          {
            borderColor: "white",
            borderRadius: 1.5,
            showLine: true,
            borderWidth: 1,
            pointRadius: 2,
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

    var myScatter = new Chart(ctx3, {
            type: "scatter",
            data: streamDataset,
            options: {
                scales: {
                    xB: {
                        position: "bottom",
                        display: true,
                        title: {
                            display: true,
                            text: "x/L",
                            color: "#FDFD96",
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            //beginAtZero: false,
                            min: 0,
                            max: 1,
                            stepSize: 0.1,
                            color: "#FDFD96",
                            padding: 15,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            tickLength: -10,
                            drawTicks: true,
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
                                borderColor: "#FDFD96",
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
                                color: "#FDFD96",
                        },
                        min: 0,
                        max: 1,
                        ticks: {
                            stepSize: 0.1,
                            color: "#FDFD96",
                            padding: 15,
                        },
                        grid: {
                            display: true,
                            borderColor: "#FDFD96",
                            drawBorder: true,
                            drawOnChartArea: false,
                            color: "#FDFD96",
                            tickLength: -10,
                            drawTicks: true,
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
                                borderColor: "#FDFD96",
                                drawBorder: true,
                                drawOnChartArea: false,
                            },
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                },
                imgPlugin: {}
            },
            plugins: []
    });

    var interval3;

    /* genS route START */

    /* Socket linked to animate streamlines button */
    document.querySelector('#streamline').addEventListener('click', () => {

        start = Date.now();

        N = document.querySelector('#input-N').value;

        const socket3 = new WebSocket(webSocketUri3);

        socket3.onopen = function() {
            console.log(":: Connected to Socket 3 ::")

            document.documentElement.style.setProperty('--bgcolor2', '#04b0ee');

            socket3.send(JSON.stringify(
                {
                    flag: '/* STREAMLINE */',
                    N: N,
                    Nint: Nint,
                    simname: 'default',
                }
            ));
        }

        socket3.onmessage = function(e) {

            const newData = JSON.parse(e.data);

            if (newData.hasOwnProperty('img_src')) {

                xdata = newData.x;
                ydata = newData.y;

                if (myScatter != undefined) {
                    clearInterval(interval3)
                    streamDataset.datasets = [];
                    myScatter.destroy();
                }

                img_src = newData.img_src;

                const image = new Image();
                image.src = img_src;
                //console.log(":: chartArea =", myScatter.chartArea)
                const imgPlugin = {
                    id: 'custom_canvas_background_image',
                        beforeDraw: () => {
                            if (image.complete) {
                                ctx3.drawImage(image, myScatter.chartArea.left*0.88, myScatter.chartArea.top, myScatter.chartArea.width*1.03, myScatter.chartArea.height*1.02);
                                //ctx3.drawImage(image, myScatter.chartArea.left*0.8, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);
                                //ctx3.drawImage(image, myScatter.chartArea.left*0.75, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);

                            } else {
                                image.onload = () => myScatter.draw();
                            }
                        }
                    };

                myScatter = new Chart(ctx3, {
                        type: "scatter",
                        data: streamDataset,
                        options: {
                            scales: {
                                xB: {
                                        position: "bottom",
                                        display: true,
                                        title: {
                                        display: true,
                                        text: "x/L",
                                        color: "#FDFD96",
                                    },
                                    min: 0,
                                    max: 1,
                                    ticks: {
                                        //beginAtZero: false,
                                        min: 0,
                                        max: 1,
                                        stepSize: 0.1,
                                        color: "#FDFD96",
                                        padding: 15,
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        tickLength: -10,
                                        drawTicks: true,
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
                                            borderColor: "#FDFD96",
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
                                            color: "#FDFD96",
                                    },
                                    min: 0,
                                    max: 1,
                                    ticks: {
                                        stepSize: 0.1,
                                        color: "#FDFD96",
                                        padding: 15,
                                    },
                                    grid: {
                                        display: true,
                                        borderColor: "#FDFD96",
                                        drawBorder: true,
                                        drawOnChartArea: false,
                                        color: "#FDFD96",
                                        tickLength: -10,
                                        drawTicks: true,
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
                                            borderColor: "#FDFD96",
                                            drawBorder: true,
                                            drawOnChartArea: false,
                                        },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                            },
                            imgPlugin: {}
                        },
                        plugins: [imgPlugin]
                });

                genStreamlines();

                socket3.onclose = function() {
                    console.log('Closed Socket 3');

                    clearInterval(statusInterval);
                    document.getElementById('grid2').style = 'border-color: black;'

                    document.documentElement.style.setProperty('--animation2', '');
                    document.documentElement.style.setProperty('--bgcolor2', '#FDFD96');
                    document.getElementById("streamline").disabled = true;

                    //document.getElementById('myChart2').scrollIntoView();
                    //document.body.scrollTo(0, hero1Top + hero1Height);
                    window.scrollTo(0, 410);

                };
            }
        };
    });

    /* genS route END */

    const ul = document.getElementById("dd-menu");
    // Add a click event listener to the ul
    ul.addEventListener("click", function(e) {
        // Check if the clicked element is an li element
        if (e.target && e.target.nodeName === "LI") {
            // Get the selected li element
            const selectedLi = e.target;

            // Do something with the selected li element
            console.log("Selected item: " + selectedLi.textContent);
            getImageAnimation(selectedLi.textContent)
        }
    });

    function getImageAnimation(simname) {

        const socket7 = new WebSocket(webSocketUri7);

        socket7.onopen = function() {
            console.log(":: Connected to Socket 7 ::");

            document.documentElement.style.setProperty('--bgcolor5', '#04b0ee');
            document.documentElement.style.setProperty('--animation5', 'rotate 2s infinite linear');

            socket7.send(JSON.stringify({ flag: '/* RETREIVE */', simname: simname }))};

        socket7.onmessage = function(e) {
                let newData = JSON.parse(e.data);
                //window.alert(newData.msg)
                console.log("newData sock 7: ", newData)

                let params = newData.params; console.log("params", params)

                U = params.U;
                Re = params.Re;
                N = params.N;
                Np = params.Np;

                document.querySelector('#input-U').value = U;
                document.querySelector('#input-Re').value = Re;
                document.querySelector('#input-N').value = N;
                document.querySelector('#input-Np').value = Np;

                objC = newData.objC; resids = objC.resid;
                uresid = resids.u; vresid = resids.v; cresid = resids.c
                console.log("uresid.length:", uresid.length)

                resetConvergence()
                for (let i = 0; i < uresid.length; i++) {
                    myChart1.data.labels.push(i);
                    myChart1.data.datasets[0].data.push(cresid[i]);
                    myChart1.data.datasets[1].data.push(uresid[i]);
                    myChart1.data.datasets[2].data.push(vresid[i]);
                }
                myChart1.update();

                xdata = newData.objD.x;
                ydata = newData.objD.y;

                if (myScatter != undefined) {
                    clearInterval(interval3)
                    streamDataset.datasets = [];
                    myScatter.destroy();
                }

                img_src = newData.img_src;

                const image = new Image();
                image.src = img_src;
                //console.log(":: chartArea =", myScatter.chartArea)
                const imgPlugin = {
                    id: 'custom_canvas_background_image',
                    beforeDraw: () => {
                        if (image.complete) {
                            ctx3.drawImage(image, myScatter.chartArea.left*0.88, myScatter.chartArea.top, myScatter.chartArea.width*1.03, myScatter.chartArea.height*1.02);
                            //ctx3.drawImage(image, myScatter.chartArea.left*0.8, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);
                            //ctx3.drawImage(image, myScatter.chartArea.left*0.75, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);

                        } else {
                            image.onload = () => myScatter.draw();
                        }
                    }
                };

                myScatter = new Chart(ctx3, {
                    type: "scatter",
                    data: streamDataset,
                    options: {
                        scales: {
                            xB: {
                                position: "bottom",
                                display: true,
                                title: {
                                    display: true,
                                    text: "x/L",
                                    color: "#FDFD96",
                                },
                                min: 0,
                                max: 1,
                                ticks: {
                                    //beginAtZero: false,
                                    min: 0,
                                    max: 1,
                                    stepSize: 0.1,
                                    color: "#FDFD96",
                                    padding: 15,
                                },
                                grid: {
                                    display: true,
                                    borderColor: "#FDFD96",
                                    drawBorder: true,
                                    drawOnChartArea: false,
                                    color: "#FDFD96",
                                    tickLength: -10,
                                    drawTicks: true,
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
                                    borderColor: "#FDFD96",
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
                                    color: "#FDFD96",
                                },
                                min: 0,
                                max: 1,
                                ticks: {
                                    stepSize: 0.1,
                                    color: "#FDFD96",
                                    padding: 15,
                                },
                                grid: {
                                    display: true,
                                    borderColor: "#FDFD96",
                                    drawBorder: true,
                                    drawOnChartArea: false,
                                    color: "#FDFD96",
                                    tickLength: -10,
                                    drawTicks: true,
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
                                    borderColor: "#FDFD96",
                                    drawBorder: true,
                                drawOnChartArea: false,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                    },
                    imgPlugin: {}
                },
                plugins: [imgPlugin]
            });

            genStreamlines();

        };

        socket7.onclose = function() {
            console.log('Closed Socket 7');

            window.scrollTo(0, document.body.scrollTop);
            //window.scrollTo(0, document.body.scrollHeight);
            //window.scrollTo(0, document.body.scrollIntoView);
            //clearInterval(statusInterval);
            hero0.style = 'background-color: rgba(10, 10, 10, 0.85);'

            document.documentElement.style.setProperty('--animation5', '');
            document.documentElement.style.setProperty('--bgcolor5', '#FDFD96');
            //document.documentElement.style.setProperty('--animation1', 'rotate 2s infinite linear');
            //document.getElementById("uv").disabled = false;

        };
    }

    function genStreamlines() {

        for (let i = 0; i < Np; i++) {
            streamDataset.datasets[i] = {};
            streamDataset.datasets[i].borderColor = "black";
            streamDataset.datasets[i].borderRadius = 1;
            streamDataset.datasets[i].pointRadius = 1.5;
            streamDataset.datasets[i].pointBackgroundColor = "white";
            streamDataset.datasets[i].data = [{x: 0.56, y: 0.53}];
            //streamDataset.datasets[i].data = [{x: 1, y: 1}]; //only made diff on init
        }
        myScatter.update();

        //var ctr = 0;
        ctr = 0;
        //console.log(":: xdata.length =", xdata.length)
        //console.log(":: xdata =", xdata[ctr])
        interval3 = setInterval(function() {

            //console.log(":: ctr =", ctr)

            if (ctr > Nint-1) {
                ctr = 0;
            }

            var xxdata = new Array();
            var yydata = new Array();

            streamDataset.datasets.forEach(function(dataset, i) {

                xxdata = xdata[i];
                yydata = ydata[i];

                dataset.data = [
                    {
                        x: xxdata[ctr],
                        y: yydata[ctr]
                    }
                ]

                dataset.borderRadius = 1
                dataset.borderColor = "white"
                dataset.borderWidth = 1.5
                dataset.pointRadius = 3
                dataset.showLine = true
                dataset.pointBackgroundColor = "black"

            });

            myScatter.update();
            ctr++;

            //let delta = Date.now() - start
            ////console.log(":: Elapsed (s) =", Math.floor(delta/1000))

        }, 100);
    };

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

    function resetConvergence() {
        myChartConv.data.labels = [];
        myChartConv.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        myChartConv.update();
        document.documentElement.style.setProperty('--animation0', 'rotate 2s infinite linear');
        document.documentElement.style.setProperty('--animation1', '');
    }

});