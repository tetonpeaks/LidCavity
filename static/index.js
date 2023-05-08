document.addEventListener("DOMContentLoaded", function () {

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

    const Np = 350; const Nint = 250;
    var u; var v;
    var xdata = []; var ydata = [];
    var img_src;
    var start;

    document.querySelector('#reset1').addEventListener('click', () => {
        //console.log(":: myChart1 =", myChart1)
        myChart1.data.labels = [];
        myChart1.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        myChart1.update();

        data.datasets[0].data[0] = 0;
        data.datasets[0].backgroundColor[0] = 'rgba(250, 160, 160, 0.2)';
        myProgressPie.update();
        myProgressPie.data.labels = [];
        myProgressPie.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
        myProgressPie.update();
    });

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

    document.getElementById("uv").disabled = true;
    document.getElementById("streamline").disabled = true;
    document.querySelector('#run').addEventListener('click', () => {

        const T = document.querySelector('#input-T').value;
        const U = document.querySelector('#input-U').value;
        const Re = document.querySelector('#input-Re').value;
        const N = document.querySelector('#input-N').value;
        //const Nint = document.querySelector('#input-Nint').value;

        const socket1 = new WebSocket(webSocketUri1);

        socket1.onopen = function() {
            console.log(":: Connected to Socket 1 ::");
            socket1.send(JSON.stringify(
                {
                    flag: 0,
                    T: T,
                    U: U,
                    Re: Re,
                    N: N,
                    Nint: Nint,
                }
            ));
        }

        socket1.onmessage = function(e) {
            const newData = JSON.parse(e.data);
            if (newData.hasOwnProperty('pressure')) {
                addData(newData);
            } else if (newData.hasOwnProperty('u')) {
                u = newData.u;
                v = newData.v;
            }
        };

        socket1.onclose = function() {
            console.log('Closed Socket 1');
            document.getElementById("uv").disabled = false;
            document.getElementById("uv").style.background = '#00FF00';
        };
    });

    function addData(newData) {
        myChart1.data.labels.push(newData.x); // need to change
        /* myChart1.data.datasets[0].data.push(newData.total);
        myChart1.data.datasets[1].data.push(newData.pressure);
        myChart1.data.datasets[2].data.push(newData.umom);
        myChart1.data.datasets[3].data.push(newData.vmom); */
        myChart1.data.datasets[0].data.push(newData.pressure);
        myChart1.data.datasets[1].data.push(newData.umom);
        myChart1.data.datasets[2].data.push(newData.vmom);
        myChart1.update();
    };

    var myProgressPie;

    document.querySelector('#uv').addEventListener('click', () => {

        const N = document.querySelector('#input-N').value;
        //const Nint = document.querySelector('#input-Nint').value;

        const socket2 = new WebSocket(webSocketUri2);

        socket2.onopen = function() {
            console.log(":: Connected to Socket 2 ::")
            socket2.send(JSON.stringify(
                {
                    flag: 1,
                    N: N,
                    Nint: Nint,
                    Np: Np,
                    u: u,
                    v: v,
                }
            ));
        }

        socket2.onmessage = function(e) {
            const newData = JSON.parse(e.data);
            if (newData.hasOwnProperty('ctr')) {
                integrateData(newData);
            } else if (newData.hasOwnProperty('x')) {
                xdata = newData.x;
                ydata = newData.y;
            }
        };

        socket2.onclose = function() {
            console.log('Closed Socket 2');
            document.getElementById("uv").disabled = true;
            document.getElementById("uv").style.background = '#000000';
            document.getElementById("streamline").disabled = false;
            document.getElementById("streamline").style.background = '#00FF00';
        };
    });

    const labels = ["Integrating velocity field...", ""];

    /* let ctx2 = document.getElementById("myChart0").getContext("2d");
    var data = {
            labels: labels,
            datasets: [
                {
                    data: [0],
                    backgroundColor: [
                        'rgba(250, 160, 160, 0.2)',
                    ],
                    borderColor: [
                        'grey',
                    ],
                }
            ]
        }

    var myProgressPie = new Chart(ctx2, {
            type: 'pie',
            data: data,
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            }
        }) */

    function integrateData(newData) {

        let ctr = newData.ctr;

        data.labels[0] = [`Integrating velocity field [ ${Math.round(((ctr+1)/Np)*100)}% ]`]
        data.datasets[0].data[0] = [(ctr/Np)*100]
        myProgressPie.update();

        if (data.datasets[0].data[0] >= 95) {
            data.datasets[0].backgroundColor[0] = 'rgba(193, 225, 193, 0.2)';
            myProgressPie.update();
        }
    }

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
                        max: 1,
                        min: 0,
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

    document.querySelector('#streamline').addEventListener('click', () => {

        start = Date.now();

        const N = document.querySelector('#input-N').value;
        //const Nint = document.querySelector('#input-Nint').value;

        const socket3 = new WebSocket(webSocketUri3);

        socket3.onopen = function() {
            console.log(":: Connected to Socket 3 ::")
            socket3.send(JSON.stringify(
                {
                    flag: 2,
                    N: N,
                    Nint: Nint,
                    Np: Np,
                    u: u,
                    v: v,
                }
            ));
        }

        socket3.onmessage = function(e) {

            const newData = JSON.parse(e.data);

            if (newData.hasOwnProperty('confirm')) {

                if (myScatter != undefined) {
                    clearInterval(interval3);
                    myScatter.destroy();
                }

                data.datasets[0].data[0] = 0;
                data.datasets[0].backgroundColor[0] = 'rgba(250, 160, 160, 0.2)';
                myProgressPie.update();

                for (let i = 0; i < 8000; i++) {
                    setTimeout(() => {
                        data.datasets[0].data[0] = [(i/8000)*100];
                        myProgressPie.update();
                    }, 1000)
                }

            }  else if (newData.hasOwnProperty('img_src')) {
                img_src = newData.img_src;

                const image = new Image();
                image.src = img_src;
                console.log(":: chartArea =", myScatter.chartArea)
                const imgPlugin = {
                    id: 'custom_canvas_background_image',
                        beforeDraw: () => {
                            if (image.complete) {
                                ctx3.drawImage(image, myScatter.chartArea.left*0.8, myScatter.chartArea.top, myScatter.chartArea.width*1.05, myScatter.chartArea.height*1.02);
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
                                    max: 1,
                                    min: 0,
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

                genStreamlines()

                socket3.onclose = function() {
                    console.log('Closed Socket 3');
                    document.getElementById("streamline").disabled = true;
                    document.getElementById("streamline").style.background = '#000000';
                };
            }
        };

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

            data.labels[0] = ['Complete.']
            data.datasets[0].backgroundColor[0] = 'rgba(193, 225, 193, 0.2)'
            myProgressPie.update();

            var ctr = 0;
            interval3 = setInterval(function() {

                if (ctr > Nint-1) {
                ctr = 0;
                }

                streamDataset.datasets.forEach(function(dataset, i) {

                let xxdata;
                let yydata;

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
    });

});