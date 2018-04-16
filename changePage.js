function init () {
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", changePage);
}
window.addEventListener("load", init);

//Vid klick kommer användaren till results.html där användarens position hämtas och visas
function changePage () {
    location.replace("results.html");
}