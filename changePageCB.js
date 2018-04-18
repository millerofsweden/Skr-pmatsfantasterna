//Google.API = AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA
var lat;
var lan;

function initIndex () {
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", changePage);
}
window.addEventListener("load", initIndex);

//Vid klick kommer användaren till results.html där användarens position hämtas och visas
function changePage () {
    getLocation();
    location.replace("index.html" + "?lat=" + lat + "+lan=" + lan);//ändra till results
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCoords);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}

function getCoords(pos){
  lat = pos.coords.latitude;
  lan = pos.coords.longitude;
}
