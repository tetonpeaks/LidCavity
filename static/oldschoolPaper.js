document.addEventListener('DOMContentLoaded', function() {

    const paper = document.querySelector('.paper');
    let paperHeight = paper.offsetHeight;

    const verticalLineZero = document.querySelector('.vertical-line.zero');
    const holes = document.querySelectorAll('.hole');
    var content = document.getElementById('content');

    // Calculate the horizontal center between the two edges
    const holeTop = (paper.offsetHeight / 2) - (holes[0].offsetHeight / 2);

    // Set the position of hole-1
    holes[0].style.top = `${holeTop}px`;

    // Calculate the distance between the left edge of .paper and the left box-shadow edge of vertical-line.zero
    const paperLeft = paper.getBoundingClientRect().left;
    const verticalLineZeroShadowLeft = verticalLineZero.getBoundingClientRect().left;
    const center = `${(verticalLineZeroShadowLeft - paperLeft) / 2}`;

    var holeDia = (center / 2) * 0.5;

    const holeLeft = center - holeDia / 2 - 1;

    holes[1].style.width = `${holeDia}px`; holes[1].style.height = `${holeDia}px`;
    holes[1].style.left = `${holeLeft}px`; holes[1].style.top = `${holeTop * (1 / 3)}px`
    holes[0].style.width = `${holeDia}px`; holes[0].style.height = `${holeDia}px`;
    holes[0].style.left = `${holeLeft}px`;
    holes[2].style.width = `${holeDia}px`; holes[2].style.height = `${holeDia}px`;
    holes[2].style.left = `${holeLeft}px`; holes[2].style.top = `${holeTop * (1 + (1 - (1 / 3)))}px`

    var xy = 1.5;

    content.style.fontSize = `${xy * 0.6}vh`; // or 2
    content.style.top = `${xy}%`; content.style.right = `${xy}%`;

    const pdf = document.createElement('div');
    pdf.classList.add('pdf'); pdf.id = 'pdf';
    pdf.style.fontSize = `${xy * 16}vh`;

    pdf.textContent = 'PDF';

    paper.appendChild(pdf);

    var top = '';
    let bottomThreshold = paperHeight * 0.9; // 90% of the paper's height
    let iterations = Math.floor((bottomThreshold - top) / 3); // Calculate iterations based on step value 3

    top = 13;
    for (let i = 0; i < iterations; i++) {
        let el = document.createElement('div');
        el.className = `horizontal-line line${i}`;
        el.id = `horizontal-line line${i}`;

        //may not work
        el.style.top = top + "%";
        top += 3;

        paper.appendChild(el);
    }

  });
