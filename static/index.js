document.addEventListener("DOMContentLoaded", function () {

    let btn_home = document.querySelector('#checkbox').checked;
    console.log(":: btn_home =", btn_home)


    /* document.querySelector('#home').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    }) */

    /* document.querySelector('#simulate').addEventListener('click', () => {
        document.getElementById("checkbox").click();
    }) */


    const links = document.querySelectorAll( "a" );
    console.log(":: links =", links)

    for ( let i = 0; i < links.length; i++ ) {
        console.log(i)
        const link = links[ i ];

        link.addEventListener( "mouseover", function() {
            link.style.setProperty('--animation', "blinkingBackground 2s infinite")
            //document.documentElement.style.setProperty('--color', "#00f")
        });
        link.addEventListener( "mouseout", function() {
            link.style.setProperty('--animation', "blinkingBackground 2s infinite")
            //document.documentElement.style.setProperty('--color', "rgba(255,255,255,1)")
        });

    }
});