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

        setTimeout(() => {
            modals.el.innerHTML = '';
            modals.el.style.visibility = "hidden";
            modals.info0.style.visibility = 'hidden';
            modals.info1.style.visibility = 'hidden';
            modals.info2.style.visibility = 'hidden';
        }, 1500)
    };

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {
        //el.addEventListener('click', function(e) {

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

        document.documentElement.style.setProperty('--modal-color', 'rgba(207,207,196,1)');
        document.documentElement.style.setProperty('--info0-color', 'rgba(207,207,196,0.25)');

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
        } else {
            let labels = [];
            let innerHTML = `<div class="gridP" id="gridP"></div>`;

            createGrid4( {id: 'P', label: labels, innerHTML: innerHTML, color: [`rgba(207,207,196,1)`,`rgba(119,221,119,1)`,`rgba(119,158,203,1)`], animation: [`animation-name: bounceAlphaRL`, `animation-name: bounceAlphaUD`]} );
        }

        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    document.getElementById("grid1__cell10").addEventListener('click', function(e) {

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

            }

        document.getElementById("close12").addEventListener('click', (e) => closeModals(e));
    });

    document.getElementById("grid2__cell3").addEventListener('click', function(e) {

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

        }

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
    //var check__outer = document.getElementsByClassName('outer');
    //var check__inner = document.getElementsByClassName('inner');

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
        }

        if (arrC.includes(i) && i !== element[0]) {
            div.style.borderWidth = `${width}px ${width}px 0 ${width}px`; // removes B
        }

        grid.appendChild(div);
    };
};