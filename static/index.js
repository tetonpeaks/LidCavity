document.addEventListener("DOMContentLoaded", function () {

    grid0 = document.getElementById('grid0'); // u-momentum
    grid1 = document.getElementById('grid1'); // v-momentum
    grid2 = document.getElementById('grid2'); // pressure

    document.documentElement.style.setProperty('--blinkingBackground', 'blinkingBackground 2s infinite ');

    createGrid({ N: 8, grid: grid0, borderWidth: 1 });
    createGrid({ N: 4, grid: grid1, borderWidth: 2 });
    createGrid({ N: 3, grid: grid2, borderWidth: 3 });

    el = document.getElementById('example');
    grid3 = document.getElementById('grid3');

    document.getElementById('grid0__cell49').addEventListener('click', function(e) {
        console.log('Click happened for: ' + e.target.id)
        el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        createGrid({ N: 3, grid: grid3, borderWidth: 1 });
    })

});

function createGrid(input) {

    console.log(input.grid)

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