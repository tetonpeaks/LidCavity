document.addEventListener("DOMContentLoaded", function () {

    grid0 = document.getElementById('grid0'); // u-momentum
    grid1 = document.getElementById('grid1'); // v-momentum
    grid2 = document.getElementById('grid2'); // pressure

    createGrid({ N: 8, grid: grid0, borderWidth: 1 })
    createGrid({ N: 4, grid: grid1, borderWidth: 2 })
    createGrid({ N: 3, grid: grid2, borderWidth: 3 })

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
    }

}