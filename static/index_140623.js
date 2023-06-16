document.addEventListener("DOMContentLoaded", function () {

    var grid0 = document.getElementById('grid0'); // u-momentum
    var grid1 = document.getElementById('grid1'); // v-momentum
    var grid2 = document.getElementById('grid2'); // pressure

    document.documentElement.style.setProperty('--blinkingBackground0', 'blinkingBackground0 2s infinite ');
    document.documentElement.style.setProperty('--blinkingBackground1', 'blinkingBackground1 2s infinite ');
    document.documentElement.style.setProperty('--blinkingBackground2', 'blinkingBackground2 2s infinite ');

    createGrid({ N: 8, grid: grid0, borderWidth: 1 });
    createGrid({ N: 4, grid: grid1, borderWidth: 2 });
    createGrid({ N: 3, grid: grid2, borderWidth: 3 });

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {
        //console.log('Click happened for: ' + e.target.id)
        let el = document.getElementById('example0');

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

        el.innerHTML = `<span class="close0" id="close0">&times;</span>
            <div class="grid3" id="grid3"></div>
            <span class="arrow0 W0">&#8592;</span>
            <span class="arrow0 E0">&#8594;</span>
            <span class="arrow0 N0">&#8595;</span>
            <span class="arrow0 S0">&#8593;</span>
            <div class="circle small W0">W</div>
            <div class="circle small P0">P</div>
            <div class="circle small E0">E</div>
            <div class="circle small N0">N</div>
            <div class="circle small S0">S</div>
            <div class="circle small p0">p</div>
            <div class="circle small w0">v<sub><sub>w</sub></sub></div>
            <div class="circle small e0">v<sub><sub>e</sub></sub></div>
            <div class="circle small s0">v<sub><sub>s</sub></sub></div>
            <div class="circle small n0">v<sub><sub>n</sub></sub></div>`;

        /* el.innerHTML = `<span class="close0" id="close0">&times;</span>
            <div class="grid3" id="grid3"></div>
            <span class="arrow0 W0">&#8672;</span>
            <span class="arrow0 E0">&#8674;</span>
            <span class="arrow0 N0">&#8675;</span>
            <span class="arrow0 S0">&#8673;</span>
            <div class="circle small W0">W</div>
            <div class="circle small P0">P</div>
            <div class="circle small E0">E</div>
            <div class="circle small N0">N</div>
            <div class="circle small S0">S</div>
            <div class="circle small s0">v<sub><sub>s</sub></sub></div>`; */

        let grid3 = document.getElementById('grid3');
        createGrid({ N: 3, grid: grid3, borderWidth: 1 });

        document.getElementById("close0").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)
            el.innerHTML = '';
            el.style.visibility = "hidden";
            //console.log(el.style)
        })
    })

    document.getElementById('grid1__cell2').addEventListener('click', function(e) {
        //console.log('Click happened for: ' + e.target.id)

        let el = document.getElementById('example12');

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

        document.documentElement.style.setProperty('--modal-color', 'rgba(119,221,119,1)');
        document.documentElement.style.setProperty('--modal-animation', 'bounceAlphaRL');

        //console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,221,119,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <div class="grid4" id="grid4"></div>
            <div class="grid4_minor" id="grid4_minor"></div>
            <span class="arrow12 W">&#8594;</span>
            <span class="arrow12 E">&#8594;</span>
            <span class="arrow12 N">&#8594;</span>
            <span class="arrow12 S">&#8594;</span>
            <span class="arrow12 P">&#8594;</span>
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
            <div class="circle small e">u<sub><sub>ee</sub></sub></div>
            <div class="circle small s">u<sub><sub>sse</sub></sub></div>
            <div class="circle small n">u<sub><sub>e</sub></sub></div>
            <div class="circle small nn">u<sub><sub>nne</sub></sub></div>`;

        let grid4 = document.getElementById('grid4');
        createGrid({ N: 3, grid: grid4, borderWidth: 1 });

        let grid4_minor = document.getElementById('grid4_minor');
        createGrid({ N: 1, grid: grid4_minor, borderWidth: 1 });

        grid4_minor.style.cssText = `top: 50%;
            left: 50%;
            transform: translate(0%, -50%);`;

        let W = document.getElementsByClassName('W')[0]; // must access [0]
        W.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px);
            left: calc(0px + (100% / 3 / 2) + 24px + 4px);`;

        let P = document.getElementsByClassName('P')[0];
        P.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px);
            right: calc(40px + (100% / 3 / 2) - 12px - 4px);`;

        let E = document.getElementsByClassName('E')[0];
        E.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px);
            right: calc(0px + (0% / 3 / 2) - 12px - 4px);`;

        let N = document.getElementsByClassName('N')[0];
        N.style.cssText = `top: calc(0px + (100% / 3 / 2) - 12px - 4px);
            right: calc(40px + (100% / 3 / 2) - 12px - 4px);`;

        let S = document.getElementsByClassName('S')[0];
        S.style.cssText = `bottom: calc(0px + (100% / 3 / 2) - 14px - 4px);
            right: calc(40px + (100% / 3 / 2) - 12px - 4px);`;

        let mainCell = document.getElementById('grid4_minor');
        mainCell.style.backgroundColor = `rgba(119,221,119,0.4)`;

        let w = document.getElementsByClassName('w')[0]; // must access [0]
        w.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px);
            left: calc(0px + (100% / 3 / 2) + 24px + 8px + 8px);`;

        let p = document.getElementsByClassName('p')[0];
        p.style.cssText = `top: calc(80px + (100% / 3 / 2) + 24px + 14px);
            left: calc(40px + (200% / 3 / 2) + 24px - 14px);`;

        let e_ = document.getElementsByClassName('e')[0];
        e_.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px);
            right: calc(0px + (0% / 3 / 2) - 24px - 10px + 0px);`;

        let n = document.getElementsByClassName('n')[0];
        n.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px);
            left: calc(40px + (200% / 3 / 2) + 24px + 8px + 8px);`;

        let nn = document.getElementsByClassName('nn')[0];
        nn.style.cssText = `top: calc(40px + (0% / 3 / 2) - 0px + 0px - 2px);
            left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`;

        let s = document.getElementsByClassName('s')[0];
        s.style.cssText = `bottom: calc(0px + (0% / 3 / 2) + 24px - 12px + 0px);
            left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`;

        document.getElementById("close12").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)
            el.innerHTML = '';
            el.style.visibility = "hidden";
            //console.log(el.style)
        })
    })

    document.getElementById('grid2__cell0').addEventListener('click', function(e) {
        console.log('Click happened for: ' + e.target.id)

        let el = document.getElementById('example12');

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

        document.documentElement.style.setProperty('--modal-color', 'rgba(119,158,203,1)');
        document.documentElement.style.setProperty('--modal-animation', 'bounceAlphaUD');
        //console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,158,203,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <div class="grid4" id="grid4"></div>
            <div class="grid4_minor" id="grid4_minor"></div>
            <span class="arrow12 W">&#8595;</span>
            <span class="arrow12 E">&#8595;</span>
            <span class="arrow12 N">&#8595;</span>
            <span class="arrow12 S">&#8595;</span>
            <span class="arrow12 P">&#8595;</span>
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
            <div class="circle small w">v<sub><sub>nww</sub></sub></div>
            <div class="circle small e">v<sub><sub>nee</sub></sub></div>
            <div class="circle small s">v<sub><sub>s</sub></sub></div>
            <div class="circle small n">v<sub><sub>n</sub></sub></div>
            <div class="circle small nn">v<sub><sub>nn</sub></sub></div>`;

        let grid4 = document.getElementById('grid4');
        createGrid({ N: 3, grid: grid4, borderWidth: 1 });

        let grid4_minor = document.getElementById('grid4_minor');
        createGrid({ N: 1, grid: grid4_minor, borderWidth: 1 });

        grid4_minor.style.cssText = `top: calc(50% - 80px);
            left: 50%;
            transform: translate(-50%, 0%);`;

        let W = document.getElementsByClassName('W')[0]; // must access [0]
        W.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 4px);
            left: calc(30px + 0px);`;

        let P = document.getElementsByClassName('P')[0];
        P.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 4px);
            left: calc(40px + (100% / 3 / 2) + 24px + 7px);`;

        let E = document.getElementsByClassName('E')[0];
        E.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 4px);
            right: calc(30px + 0px);`;

        let N = document.getElementsByClassName('N')[0];
        N.style.cssText = `top: calc(0px + (0% / 3 / 2) - 12px - 2px);
            left: calc(40px + (100% / 3 / 2) + 24px + 7px);`;

        let S = document.getElementsByClassName('S')[0];
        S.style.cssText = `bottom: calc(0px + (100% / 3 / 2) + 24px - 2px);
            left: calc(40px + (100% / 3 / 2) + 24px + 7px);`;

        let mainCell = document.getElementById('grid4_minor');
        mainCell.style.backgroundColor = `rgba(119,158,203,0.4)`;

        let w = document.getElementsByClassName('w')[0]; // must access [0]
        w.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px);
            left: calc(0px + (0% / 3 / 2) + 24px + 8px + 12px);`;

        let p = document.getElementsByClassName('p')[0];
        p.style.cssText = `top: calc(40px + (100% / 3 / 2) + 24px + 14px);
            left: calc(40px + (100% / 3 / 2) + 24px - 14px);`;

        let e_ = document.getElementsByClassName('e')[0];
        e_.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px);
            right: calc(0px + (0% / 3 / 2) + 24px - 10px - 4px);`;

        let n = document.getElementsByClassName('n')[0];
        n.style.cssText = `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px);
            left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`;

        let nn = document.getElementsByClassName('nn')[0];
        nn.style.cssText = `top: calc(0px + (0% / 3 / 2) + 0px + 0px + 0px);
            left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`;

        let s = document.getElementsByClassName('s')[0];
        s.style.cssText = `bottom: calc(0px + (100% / 3 / 2) + 24px - 10px + 0px);
            left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`;

        document.getElementById("close12").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)

            if (e.target.id == 'grid1_cell2') {
                document.documentElement.style.setProperty('--modal-color', 'rgba(119,221,119.1)');
            } else {
                el.innerHTML = '';
                el.style.visibility = "hidden";
            }
            //console.log(el.style)
        })
    })

    document.getElementById('grid2__cell5').addEventListener('click', function(e) {
        console.log('Click happened for: ' + e.target.id)
        let el = document.getElementById('example12');

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');


        //console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,221,119,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <div class="grid4" id="grid4"></div>
            <span class="arrow12u W">&#8594;</span>
            <span class="arrow12u E">&#8594;</span>
            <span class="arrow12u N">&#8594;</span>
            <span class="arrow12u S">&#8594;</span>
            <span class="arrow12u P">&#8594;</span>
            <span class="arrow12v W">&#8595;</span>
            <span class="arrow12v E">&#8595;</span>
            <span class="arrow12v N">&#8595;</span>
            <span class="arrow12v S">&#8595;</span>
            <span class="arrow12v P">&#8595;</span>
            <div class="circle small W">W</div>
            <div class="circle small P">P</div>
            <div class="circle small E">E</div>
            <div class="circle small N">N</div>
            <div class="circle small S">S</div>
            <div class="circle small NE">NE</div>
            <div class="circle small SW">SW</div>
            <div class="circle small NW">NW</div>
            <div class="circle small SE">SE</div>
            <div class="circle small w">u<sub><sub>w</sub></sub></div>
            <div class="circle small ee">u<sub><sub>ee</sub></sub></div>
            <div class="circle small sse">u<sub><sub>sse</sub></sub></div>
            <div class="circle small e">u<sub><sub>e</sub></sub></div>
            <div class="circle small nne">u<sub><sub>nne</sub></sub></div>
            <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
            <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
            <div class="circle small s">v<sub><sub>s</sub></sub></div>
            <div class="circle small n">v<sub><sub>n</sub></sub></div>
            <div class="circle small nn">v<sub><sub>nn</sub></sub></div>`;

        let grid4 = document.getElementById('grid4');
        createGrid({ N: 3, grid: grid4, borderWidth: 1 });

        // u-momentum arrows
        //console.log(document.getElementsByClassName('arrow12u'))

        var arrowPosU = [
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px); left: calc(0px + (100% / 3 / 2) + 24px + 4px);`,
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`,
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px);right: calc(0px + (0% / 3 / 2) - 12px - 4px);`,
            `top: calc(0px + (100% / 3 / 2) - 12px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`,
            `bottom: calc(0px + (100% / 3 / 2) - 14px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`,
        ];

        var arrowPosV = [
            `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(30px + 0px);`,
            `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`,
            `top: calc(0px + (100% / 3 / 2) + 24px + 4px); right: calc(30px + 0px);`,
            `top: calc(0px + (0% / 3 / 2) - 12px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`,
            `bottom: calc(0px + (100% / 3 / 2) + 24px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`,
        ];

        let arrowsU = document.getElementsByClassName('arrow12u');
        let arrowsV = document.getElementsByClassName('arrow12v');

        console.log(arrowsU)
        for (let i = 0; i < arrowPosU.length; i++) {
            arrowsU[i].style.cssText = arrowPosU[(arrowsU.length - (arrowsU.length - arrowPosU.length) - 1) - i];
            arrowsV[i].style.cssText = arrowPosV[(arrowsV.length - (arrowsV.length - arrowPosV.length) - 1) - i];

            arrowsU[i].style.color = `rgba(119,221,119,1)`;
            arrowsV[i].style.color = `rgba(119,158,203,1)`;
        }

        var labelPos = [
            `top: calc(0px + (0% / 3 / 2) + 0px + 0px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //nn
            `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //n
            `bottom: calc(0px + (100% / 3 / 2) + 24px - 10px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //s
            `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) + 24px - 10px - 4px);`, //nee
            `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (0% / 3 / 2) + 24px + 8px + 12px);`, //nww

            `top: calc(40px + (0% / 3 / 2) - 0px + 0px - 2px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //nne
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 8px);`, //e
            `bottom: calc(0px + (0% / 3 / 2) + 24px - 12px + 0px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //sse
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) - 24px - 10px + 0px);`, //ee
            `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (100% / 3 / 2) + 24px + 8px + 8px);`, //w
        ];

        let labels = document.getElementsByClassName('circle');
        console.log(labels)

        for (let i = 0; i < labelPos.length; i++) {
            console.log((labels.length - (labels.length - labelPos.length) - 1) - i, i + 9)
            console.log(labelPos[(labels.length - (labels.length - labelPos.length) - 1) - i])

            if (i < labelPos.length - arrowsU.length) {
                labels[i + 9].style.cssText = labelPos[(labels.length - (labels.length - labelPos.length) - 1) - i];
                labels[i + 9].style.color = `rgba(119,221,119,1)`;
            } else {
                labels[i + 9].style.cssText = labelPos[(labels.length - (labels.length - labelPos.length) - 1) - i];
                labels[i + 9].style.color = `rgba(119,158,203,1)`;
            }

            //labelsV[i].style.cssText = labelsV[(labelsV.length - (labelsV.length - labelV.length) - 1) - i];
            //labelsV[i + 9].style.color = `rgba(119,158,203,1)`;
        }



        //arrowsU.style.setProperty('color') = `rgba(119,221,119,1)`;

        document.getElementById("close12").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)
            el.innerHTML = '';
            el.style.visibility = "hidden";
            //console.log(el.style)
        })
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

            if (i === 7) {
                //div.onclick = myFunc();
                //console.log(div)
            }
        }

        if (arrC.includes(i) && i !== element[0]) {
            div.style.borderWidth = `${width}px ${width}px 0 ${width}px`; // removes B
        }

        grid.appendChild(div);
        };
    };
});

function myFunc() {
    console.log('Hi')
}