var zip;

function init () {
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", getLocation);
    var searchBut = document.getElementById("button");
    addListener(searchBut, "click", searchValue);
}

window.addEventListener("load", init);


function getLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (changePageLoc);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}

function changePageLoc (e) {
    var lat;
    var lan;
    sessionStorage.setItem("lat", JSON.stringify(e.coords.latitude));
    sessionStorage.setItem("lan", JSON.stringify(e.coords.longitude));
    location.href = "results.html";  
}

function searchValue(form) {
    var input = document.getElementsByName("address");
    var searchInfo = document.getElementById("searchInfo");
        location.href = "results.html";
        zipCode(input);
        }
     

