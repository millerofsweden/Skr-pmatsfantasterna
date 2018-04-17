function initIndex () {
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", changePage);
}
window.addEventListener("load", initIndex);

//Vid klick kommer användaren till results.html där användarens position hämtas och visas
function changePage () {
    location.replace("results.html");
}