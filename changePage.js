function initIndex () {
    var yourPosition = document.getElementById("locSrchBtn");
    addListener(yourPosition, "click", resultPage);
    var aboutUs = document.getElementById("contactBtn");
    addListener (aboutUs, "click", aboutPage);
}
window.addEventListener("load", initIndex);

//Vid klick kommer användaren till results.html där användarens position hämtas och visas
function resultPage () {
    location.href = "results.html";
}
//vid klick kommer anvädnaren till about.html där det visas info om oss
function aboutPage () {
    location.href = "about.html";
}