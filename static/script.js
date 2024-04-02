document.addEventListener("DOMContentLoaded", function () {

    let dragged;

    // Add event listeners for the draggable elements
    const draggableElements = document.querySelectorAll('.draggable');
    draggableElements.forEach((element) => {
    element.addEventListener('dragstart', (e) => {
        dragged = e.target;
        e.dataTransfer.setData('text/plain', element.id);
    });

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const dropped = document.getElementById(id);

        if (dragged !== dropped) {
        // Swap the positions of the dragged and dropped elements
        const parent = dragged.parentElement;
        const draggedIndex = Array.from(parent.children).indexOf(dragged);
        const droppedIndex = Array.from(parent.children).indexOf(dropped);

        if (draggedIndex < droppedIndex) {
            parent.insertBefore(dragged, dropped.nextSibling);
        } else {
            parent.insertBefore(dragged, dropped);
        }
        }
    });
    });
});