function init () {
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", changePage);
}
window.addEventListener("load", init);

function changePage () {
    location.replace("results.html");
}