document.addEventListener("DOMContentLoaded", function() {
    console.log('Hello World')
    const gridContainer = document.querySelector('.algo-grid-container');
    const newGridContainer = document.querySelector('.new-grid-container');
    const step7Container = document.querySelector('.step7-container');

    const processWrapper1 = document.querySelector('.process--wrapper1');
    const processWrapper1Top = processWrapper1.getBoundingClientRect().top;
    const processWrapper1Left = processWrapper1.getBoundingClientRect().left;
    const processWrapper1Height = processWrapper1.clientHeight;

    const processWrapper2 = document.querySelector('.process--wrapper2');
    const processWrapper2Top = processWrapper2.getBoundingClientRect().top;
    const processWrapper2Left = processWrapper2.getBoundingClientRect().left;
    const processWrapper2Height = processWrapper2.clientHeight;
    const processWrapper2Width = processWrapper2.clientWidth;

    const fieldsWrapper = document.querySelector('.fields-wrapper');
    const fieldsTextContainer = document.querySelector('.fields-text-container');
    const fieldsWrapperTop = fieldsWrapper.getBoundingClientRect().top;
    const fieldsWrapperLeft = fieldsWrapper.getBoundingClientRect().left;
    const fieldsWrapperHeight = fieldsWrapper.clientHeight;

    const newGridGrid0Cells = Array.from(document.querySelector('.new-grid-grid0').children);
    const step7Grid0Cells = Array.from(document.querySelector('.step7-grid0').children);
    const processWrapper2Cells = Array.from(document.querySelector('.process--grid2').children);
    const updateWrapper = document.querySelector('.update-wrapper');
    const updateWrapperTop = updateWrapper.getBoundingClientRect().top;
    const updateWrapperHeight = updateWrapper.clientHeight;

    var grid__matrices = Array.from(document.getElementsByClassName('grid--matrix'));

    /* This is absolutely key to maintaining positions of divs relative to each other */
    window.addEventListener('resize', () => {
        const processWrapper2 = document.getElementById('process--wrapper2');
        const wrapper2Midpoint = processWrapper2.getBoundingClientRect().top + processWrapper2.offsetHeight / 2;
        document.documentElement.style.setProperty('--wrapper2-midpoint', `${wrapper2Midpoint}px`);

        const continuityWrapper = document.getElementById('continuity-wrapper');
        const continuityWrapperMidpoint = continuityWrapper.getBoundingClientRect().top + continuityWrapper.offsetHeight / 2;
        document.documentElement.style.setProperty('--continuitywrapper-midpoint', `${continuityWrapperMidpoint - wrapper2Midpoint}px`);

        newGridGrid0Cells.forEach((newGridGrid0Cell) => {
            newGridGrid0Cell.style.width = `${processWrapper2Cells[0].clientWidth}px`;
        })

        const fieldsWrapper = document.querySelector('.fields-wrapper');
        const fieldsWrapperMidpoint = fieldsWrapper.getBoundingClientRect().top + fieldsWrapper.offsetHeight / 2;
        //console.log('${fieldsWrapperMidpoint}: ', `${fieldsWrapperMidpoint}`)
        document.documentElement.style.setProperty('--fieldswrapper-midpoint', `${fieldsWrapperMidpoint}px`);

        const updateWrapper = document.querySelector('.update-wrapper');
        const updateWrapperMidpoint = updateWrapper.getBoundingClientRect().top + updateWrapper.offsetHeight / 2;
        //console.log('${updateWrapperMidpoint}: ', `${updateWrapperMidpoint}`)
        document.documentElement.style.setProperty('--updatewrapper-midpoint', `${updateWrapperMidpoint - fieldsWrapperMidpoint}px`);

        const gridContainer = document.querySelector('.algo-grid-container');
        const gridContainerMP = gridContainer.offsetLeft + gridContainer.offsetWidth / 2;

        const step7ContainerMP = step7Container.offsetLeft + step7Container.offsetWidth / 2;

        document.documentElement.style.setProperty('--grid-container-mp-outer', `${gridContainerMP - step7ContainerMP}px`);

        const newGridContainerMP = newGridContainer.offsetLeft + newGridContainer.offsetWidth / 2;

        document.documentElement.style.setProperty('--grid-container-mp-inner', `${gridContainerMP - newGridContainerMP}px`);
    });

    // Initial setup on page load
    window.dispatchEvent(new Event('resize'));

    // Get all the child elements of the grid-container
    //const gridElements = document.querySelectorAll('.algo-grid-container > div');

    // Get all the top-level child elements of process--grid2 with class "cell0" and "cell1"
    const processGrid1Cell0Elements = document.querySelectorAll('.process--grid1 > .cell0');
    const processGrid1Cell1Elements = document.querySelectorAll('.process--grid1 > .cell1');
    const processGrid2Cell0Elements = document.querySelectorAll('.process--grid2 > .cell0');
    const processGrid2Cell1Elements = document.querySelectorAll('.process--grid2 > .cell1');

    // Combine the two sets of elements into a single array
    //const processGrid2Elements = [...processGrid2Cell1Elements, ...processGrid2Cell0Elements];
    const processGrid1Elements = [...processGrid1Cell0Elements, ...processGrid1Cell1Elements];
    const processGrid2Elements = [...processGrid2Cell0Elements, ...processGrid2Cell1Elements];
    //console.log(processGrid1Elements)

    // Get all the elements to be faded in
    const gridElements = document.querySelectorAll(
        '.fields-wrapper, ' +
        '.process--grid2.cell0, ' +
        '.process--grid2.cell1, ' +
        '.massflow-wrapper, ' +
        '.pressure-wrapper, ' +
        '.continuity-wrapper, ' +
        '.correct-wrapper, ' +
        '.update-wrapper');

    // Function to add "visible" class to each element in succession
    function fadeElementsInSuccession(index) {
        if (index < gridElements.length) {
            let delay = 1000;
            if (gridElements[index].classList.contains('cell0')) {
                delay = 1000;
                //delay = 1500;
            } else if (gridElements[index].classList.contains('cell1')) {
                delay = 500;
            } else if (gridElements[index].classList.contains('continuity-wrapper')) {
                delay = 1000; // Default 1000
            } else if (gridElements[index].classList.contains('correct-wrapper')) {
                delay = 2000;
            }

            setTimeout(function () {
                // Add "visible" class to the current element
                //console.log('elementsToFadeIn[index].classList: ', elementsToFadeIn[index].classList)

                if (gridElements[index].classList.contains('cell0')) {
                    console.log('cell0')
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid1.cell0').classList.add('visible');
                } else if (gridElements[index].classList.contains('cell1')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid1.cell1').classList.add('visible');

                    let delay = 6000; // Default 6000

                    setTimeout(() => {
                        document.querySelector('.new-grid-grid0.cell1').classList.add('visible');
                    }, delay);
                } else if (gridElements[index].classList.contains('massflow-wrapper')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid3.cell0').classList.add('visible');
                    setTimeout(() => {
                        document.querySelector('.process--grid3.cell1').classList.add('visible');
                    }, 500)
                } else if (gridElements[index].classList.contains('pressure-wrapper')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid4.cell0').classList.add('visible');
                    setTimeout(() => {
                        document.querySelector('.process--grid4.cell1').classList.add('visible');
                    }, 0)
                } else if (gridElements[index].classList.contains('continuity-wrapper')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid5.cell0').classList.add('visible');
                    setTimeout(() => {
                        document.querySelector('.process--grid5.cell1').classList.add('visible');
                        document.querySelector('.new-grid-grid0.cell0').classList.add('visible');
                    }, 500);
                } else if (gridElements[index].classList.contains('correct-wrapper')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid6.cell0').classList.add('visible');
                    setTimeout(() => {
                        document.querySelector('.process--grid6.cell1').classList.add('visible');
                    }, 0)
                } else if (gridElements[index].classList.contains('update-wrapper')) {
                    gridElements[index].classList.add('visible');
                    document.querySelector('.process--grid7.cell0').classList.add('visible');

                    setTimeout(() => {
                        document.querySelector('.process--grid7.cell1').classList.add('visible');
                    }, 0)
                    setTimeout(() => {
                        document.querySelector('.step7-grid0.cell0').classList.add('visible');
                    }, 500);

                    // may have to split this up for timing, distinguish between L and R timing
                    // setTimeout might be appropriate

                    grid__matrices.forEach((grid__matrix) => {
                        createGrid({ N: 5, grid: grid__matrix, borderWidth: 3 });

                    });

                    //createGrid({ N: 5, grid: grid__matrices[0], borderWidth: 3 });
                    //createGrid({ N: 5, grid: grid__matrices[1], borderWidth: 3 });

                    //let grid_matrix_children = Array.from(grid__matrices[1].children);

                    showText(grid__matrices[1].children);
                    setTimeout(() => {
                        setInterval(() => {
                            showText(grid__matrices[1].children);
                        }, 2000);
                    }, 0);

                    //grid_matrix_children = Array.from(grid__matrices[0].children);

                    showText(grid__matrices[0].children);
                    setTimeout(() => {
                        setInterval(() => {
                            showText(grid__matrices[0].children);
                        }, 2000);
                    }, 1000);

                } else {
                    gridElements[index].classList.add('visible');
                }

                // Move to the next element after a delay
                setTimeout(function () {
                    fadeElementsInSuccession(index + 1);
                }, 500); // Adjust the delay (in milliseconds) as needed
            }, delay); // Adjust the delay (in milliseconds) as needed
        }
    }

    // Trigger the animation by calling the function
    fadeElementsInSuccession(0);

    // Get all the child elements of the new-grid-container
    const newGridContainerElements = document.querySelectorAll('.new-grid-container > div');

    function fadeNewGridRowElementsInSuccession(index) {
        if (index < newGridContainerElements.length) {
            setTimeout(function () {
                newGridContainerElements[index].classList.add('visible');
                fadeNewGridRowElementsInSuccession(index + 1);
            }, 8900);
        }
    }

    fadeNewGridRowElementsInSuccession(0);

    // Get all the child elements of the step7grid
    const step7gridElements = document.querySelectorAll('.step7-grid0 > div');

    function fadeStep7ElementsInSuccession(index) {
        if (index < step7gridElements.length) {
            setTimeout(function () {
                /* Turns on right side of grid */
                step7gridElements[index + 1].classList.add('visible');
                //fadeStep7ElementsInSuccession(index + 1);
            }, 14000); // default 14000s, set to 0 for convenience
        }
    }

    fadeStep7ElementsInSuccession(0);

    const pressureWrapper = document.querySelector('.pressure-wrapper');
    const pressureWrapperLeft = pressureWrapper.getBoundingClientRect().left;
    const pressureWrapperRight = pressureWrapper.getBoundingClientRect().right;

    //adjust wrapper height based on content
    const adjustWrapperHeight = (wrapper, textContainer) => {
        const containerWidth = textContainer.clientWidth;
        document.documentElement.style.setProperty(`--${textContainer.dataset.textWidth}`, `${containerWidth}px`);

        const containerHeight = textContainer.clientHeight;
        wrapper.style.height = `${containerHeight}px`;
    };

    /* // set up observer for specific wrapper + text container
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

    fieldsTextContainer.dataset.textWidth = 'fields-text-width';
    setupObserver(fieldsWrapper, fieldsTextContainer); */

    document.getElementById('fields-wrapper').style.display = 'flex';

    //var grid__matrix = document.getElementsByClassName('grid--matrix')[0];

    //grid__matrices.forEach((grid__matrix) => {
    //    createGrid({ N: 5, grid: grid__matrix, borderWidth: 3 });
    //    const grid_matrix_children = Array.from(grid__matrix.children);
    //    showText(grid_matrix_children);
    //})

    //const grid_matrix_children = Array.from(grid__matrix.children);

    /* Add highlight effect for x's */

    /* var diagEls = [];
    var UdiagEls = [];
    var LdiagEls = []; */

    function showText(grid_matrix_children) {
        let textElements = document.querySelectorAll('.AA, .AAB, .bracket-L, .bracket-R, .B');
        let colorDuration = 0.05;

        textElements.forEach((element, index) => {

            setTimeout(() => {
                element.classList.add('text-appear');
                if (element.classList.contains('B')) {
                    document.documentElement.style.setProperty('--animation-grid-matrix', `gridMatrixAnimation ${colorDuration * 20}s ease-out`);
                    // div B (grid--matrix)
                    //element.classList.add('highlight-effect');
                } else {
                    document.documentElement.style.setProperty('--animation-matrix', `matrixAnimation ${colorDuration * 20}s ease-out`);
                }

            }, index * 0);

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

            // Gather diagonal elements
            let diagEls = [];
            let UdiagEls = [];
            let LdiagEls = [];

            for (let i = 0; i < grid_matrix_children.length; i++) {

                let el = grid_matrix_children[i];
                // Extract numerical part from element ID
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
                //console.log(`idx: ${idx}`)
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

            /* grid_matrix_children.forEach((el, idx) => {
                setTimeout(() => {
                    //console.log(`el.innerHTML: ${el.innerHTML}`)
                    //if (el.innerHTML.includes('x')) {
                    //    el.classList.add('highlight-effect-with-shadow');
                    //}
                    if (diags.slice(0).includes(idx)) {
                        el.classList.add('highlight-effect-with-shadow');
                    }
                }, idx * 100);
            }); */
        });
    }

    //showText();
});

function createGrid(input) {

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

        /* const cell0 = document.querySelector('.grid--matrix__cell0');
        const cell6 = document.querySelector('.grid--matrix__cell6');

        const cell0Top = cell0.getBoundingClientRect().top;
        const cell0Left = cell0.getBoundingClientRect().left;
        const cell0Right = cell0.getBoundingClientRect().right;
        const cell6Top = cell6.getBoundingClientRect().top;
        const cell6Left = cell6.getBoundingClientRect().left;
        const cell6Right = cell6.getBoundingClientRect().right;

        //cell0.style.transform = `translate(10px,0)`;
        console.log("${cell0Right - cell0Left}: ", `${(cell6Right - cell0Left) / 2}`)

        let computedStyle = window.getComputedStyle(cell0);

        // Get the font size value
        let fontSize = computedStyle.getPropertyValue('font-size'); */
    }
};
