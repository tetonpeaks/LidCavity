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
            <span class="arrow0 W">&#8672;</span>
            <span class="arrow0 E">&#8674;</span>
            <span class="arrow0 N">&#8675;</span>
            <span class="arrow0 S">&#8673;</span>`;

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

        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <span class="arrow12 W">&#8672;</span>
            <span class="arrow12 E">&#8674;</span>
            <span class="arrow12 N">&#8675;</span>
            <span class="arrow12 S">&#8673;</span>`;

        document.documentElement.style.setProperty('--modal-color', 'rgba(119,221,119,1)');

        console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,221,119,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

       //let grid3 = document.getElementById('grid3');
       //createGrid({ N: 3, grid: grid3, borderWidth: 1 });

        document.getElementById("close12").addEventListener('click', function(e) {
            //console.log('Click happened for: ' + e.target.id)
            el.innerHTML = '';
            el.style.visibility = "hidden";
            //console.log(el.style)
        })
    })

    document.getElementById('grid2__cell0').addEventListener('click', function(e) {
        //console.log('Click happened for: ' + e.target.id)

        let el = document.getElementById('example12');

        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        el.innerHTML = `<span class="close12" id="close12">&times;</span>
            <span class="arrow12 W">&#8672;</span>
            <span class="arrow12 E">&#8674;</span>
            <span class="arrow12 N">&#8675;</span>
            <span class="arrow12 S">&#8673;</span>`;
        document.documentElement.style.setProperty('--modal-color', 'rgba(119,158,203,1)');

        console.log("visibility", el.style.getPropertyValue('visibility'))
        if (el.style.visibility == "hidden") {
            el.style.visibility = "visible";
        } /* else if (el.style.visibility == "visible" && getComputedStyle(document.documentElement).getPropertyValue('--modal-color') !== 'rgba(119,158,203,1') {
            console.log(getComputedStyle(document.documentElement).getPropertyValue('--modal-color'))
        } */

       //let grid3 = document.getElementById('grid3');
       //createGrid({ N: 3, grid: grid3, borderWidth: 1 });

        document.getElementById("close12").addEventListener('click', function(e) {
            console.log('Click happened for: ' + e.target.id)

            if (e.target.id == 'grid1_cell2') {
                document.documentElement.style.setProperty('--modal-color', 'rgba(119,221,119.1)');
            } else {
                el.innerHTML = '';
                el.style.visibility = "hidden";
            }
            //console.log(el.style)
        })
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
    }

}

function myFunc() {
    console.log('Hi')
}