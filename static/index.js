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

    var arrowPos = {
        W: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); left: calc(0px + (100% / 3 / 2) + 24px + 4px);`, //W
        E: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //E
        N: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //N
        S: `bottom: calc(0px + (100% / 3 / 2) + 24px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //S
        P: `top: calc(40px + (100% / 3 / 2) + 24px + 2px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //P
        ee: `top: calc(40px + (100% / 3 / 2) + 24px + 2px);right: calc(0px + (0% / 3 / 2) - 12px - 4px);`, //E, ee
        nne: `top: calc(0px + (100% / 3 / 2) - 12px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //N, nne
        sse: `bottom: calc(0px + (100% / 3 / 2) - 14px - 4px); right: calc(40px + (100% / 3 / 2) - 12px - 4px);`, //S, sse
        nn: `top: calc(0px + (0% / 3 / 2) - 12px - 2px); left: calc(40px + (100% / 3 / 2) + 24px + 7px);`, //N, nn
        nww: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); left: calc(30px + 0px);`, //W, nww
        nee: `top: calc(0px + (100% / 3 / 2) + 24px + 4px); right: calc(30px + 0px);`, //E, nee
    };

    var labelPos = {

        wP: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (100% / 3 / 2) + 24px + 8px + 8px);`, //w
        eP: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 8px);`, //e
        nP: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //n
        sP: `bottom: calc(0px + (100% / 3 / 2) + 24px - 10px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //s
        nn: `top: calc(0px + (0% / 3 / 2) + 0px + 0px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //nn
        n: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //n
        s: `bottom: calc(0px + (100% / 3 / 2) + 24px - 10px + 0px); left: calc(40px + (100% / 3 / 2) + 24px + 8px + 8px);`, //s
        nee: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) + 24px - 10px - 4px);`, //nee
        nww: `top: calc(0px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (0% / 3 / 2) + 24px + 8px + 12px);`, //
        nne: `top: calc(40px + (0% / 3 / 2) - 0px + 0px - 2px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //nne
        e: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 8px);`, //e
        sse: `bottom: calc(0px + (0% / 3 / 2) + 24px - 12px + 0px); left: calc(40px + (200% / 3 / 2) + 24px + 8px + 12px);`, //sse
        ee: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); right: calc(0px + (0% / 3 / 2) - 24px - 10px + 0px);`, //ee
        w: `top: calc(40px + (100% / 3 / 2) + 24px + 2px + 12px); left: calc(0px + (100% / 3 / 2) + 24px + 8px + 8px);`, //w

    }

    var el = document.getElementById('example12');

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";

        el.classList.add('open');
        grid0.classList.add('open');
        grid1.classList.add('open');
        grid2.classList.add('open');

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');

        //console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,221,119,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <div class="grid4" id="grid4"></div>
            <div class="gridP" id="gridP"></div>
            <span class="arrow12 W">&#8594;</span>
            <span class="arrow12 E">&#8594;</span>
            <span class="arrow12 N">&#8595;</span>
            <span class="arrow12 S">&#8595;</span>
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
            <div class="circle small s">v<sub><sub>s</sub></sub></div>`;

        let grid4 = document.getElementById('grid4');
        createGrid({ N: 3, grid: grid4, borderWidth: 1 });

        let arrows = document.getElementsByClassName('arrow12');
        let labels = document.getElementsByClassName('circle');
        let labelsP = ['w','e','n','s']

        for (let i = 0; i < labelsP.length; i++) {
            let divArrow = Array.from(arrows).filter(cl => cl.classList.contains(labelsP[i].toUpperCase()));

            if (labelsP[i] == 'w' || labelsP[i] == 'e') {
                divArrow[0].style.cssText = arrowPos[labelsP[i].toUpperCase()] + `animation-name: bounceAlphaRL`;
                divArrow[0].style.color = `rgba(119,221,119,1)`; //green
            } else if (labelsP[i] == 'n' || labelsP[i] == 's') {
                divArrow[0].style.cssText = arrowPos[labelsP[i].toUpperCase()] + `animation-name: bounceAlphaUD`;
                divArrow[0].style.color = `rgba(119,158,203,1)`; //blue
            } else {
                divArrow[0].style.color = `rgba(207,207,196,1)`;
            }
        };

        for (let i = 0; i < labelsP.length; i++) {
            let divLabel = Array.from(labels).filter(cl => cl.classList.contains(labelsP[i]));
            divLabel[0].style.cssText = labelPos[labelsP[i]];

            if (labelsP[i] == 'w' || labelsP[i] == 'e') {
                divLabel[0].style.color = `rgba(119,221,119,1)`; //green
            } else if (labelsP[i] == 'n' || labelsP[i] == 's') {
                divLabel[0].style.color = `rgba(119,158,203,1)`; //blue
            } else {
                divLabel[0].style.color = `rgba(207,207,196,1)`;
            }

        };

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');

        document.getElementById("grid1__cell10").addEventListener('click', function(e) {

            let ee = document.getElementsByClassName('ee');
            if (ee.length === 0) {
                el.innerHTML = el.innerHTML + `
                <div class="gridU" id="gridU"></div>
                <span class="arrow12 ee">&#8594;</span>
                <span class="arrow12 nne">&#8594;</span>
                <span class="arrow12 sse">&#8594;</span>
                <div class="circle small ee">u<sub><sub>ee</sub></sub></div>
                <div class="circle small nne">u<sub><sub>nne</sub></sub></div>
                <div class="circle small sse">u<sub><sub>sse</sub></sub></div>`;

                let gridU = document.getElementById('gridU');
                createGrid({ N: 1, grid: gridU, borderWidth: 1 });
                gridU.style.cssText = `top: 50%;
                    left: 50%;
                    transform: translate(0%, -50%);
                    background-color: rgba(119,221,119,0.4)`;
            }


            let arrows = document.getElementsByClassName('arrow12');
            let labels = document.getElementsByClassName('circle');
            let labelsU = ['ee', 'nne', 'sse'];

            for (let i = 0; i < labelsU.length; i++) {
                let divArrow = Array.from(arrows).filter(cl => cl.classList.contains(labelsU[i]));
                let divLabel = Array.from(labels).filter(cl => cl.classList.contains(labelsU[i]));
                divArrow[0].style.cssText = arrowPos[labelsU[i]] + `animation-name: bounceAlphaRL`;
                divLabel[0].style.cssText = labelPos[labelsU[i]];
                divArrow[0].style.color = `rgba(119,221,119,1)`; //green
                divLabel[0].style.color = `rgba(119,221,119,1)`; //green
            };

            document.getElementById("close12").addEventListener('click', function(e) {
                //console.log('Click happened for: ' + e.target.id)
                el.innerHTML = '';
                el.style.visibility = "hidden";

                el.classList.remove('open');
                grid0.classList.remove('open');
                grid1.classList.remove('open');
                grid2.classList.remove('open');
            });
        });


        document.getElementById("grid2__cell3").addEventListener('click', function(e) {

            let nn = document.getElementsByClassName('nn');
            if (nn.length === 0) {
                el.innerHTML = el.innerHTML + `
                    <div class="gridV" id="gridV"></div>
                    <span class="arrow12 nn">&#8595;</span>
                    <span class="arrow12 nww">&#8595;</span>
                    <span class="arrow12 nee">&#8595;</span>
                    <div class="circle small nn">v<sub><sub>nn</sub></sub></div>
                    <div class="circle small nww">v<sub><sub>nww</sub></sub></div>
                    <div class="circle small nee">v<sub><sub>nee</sub></sub></div>
                `
                let gridV = document.getElementById('gridV');
                createGrid({ N: 1, grid: gridV, borderWidth: 1 });
                gridV.style.cssText = `top: calc(50% - 80px);
                    left: 50%;
                    transform: translate(-50%, 0%);
                    background-color: rgba(119,158,203,0.4)`;
            }


            let arrows = document.getElementsByClassName('arrow12');
            let labels = document.getElementsByClassName('circle');
            let labelsV = ['nn', 'nww', 'nee'];

            for (let i = 0; i < labelsV.length; i++) {
                let divArrow = Array.from(arrows).filter(cl => cl.classList.contains(labelsV[i]));
                let divLabel = Array.from(labels).filter(cl => cl.classList.contains(labelsV[i]));
                divArrow[0].style.cssText = arrowPos[labelsV[i]] + `animation-name: bounceAlphaUD`;
                divLabel[0].style.cssText = labelPos[labelsV[i]];
                divArrow[0].style.color = `rgba(119,158,203,1)`; //green
                divLabel[0].style.color = `rgba(119,158,203,1)`; //green
            };

            document.getElementById("close12").addEventListener('click', function(e) {
                //console.log('Click happened for: ' + e.target.id)
                el.innerHTML = '';
                el.style.visibility = "hidden";

                el.classList.remove('open');
                grid0.classList.remove('open');
                grid1.classList.remove('open');
                grid2.classList.remove('open');
            });
        });

        document.getElementById("close12").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)
            el.innerHTML = '';
            el.style.visibility = "hidden";

            el.classList.remove('open');
            grid0_wrapper.classList.remove('open');
            grid1.classList.remove('open');
            grid2.classList.remove('open');
        });
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