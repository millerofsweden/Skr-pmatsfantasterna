
//hämtar ut element från HTML-filen
function init () {
    sessionStorage.clear();
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", getLocation);
    var searchBut = document.getElementById("txtSrchBtn");
    searchBut.addEventListener("click", searchInput);
    var popUp = document.getElementById("popup");
    popUp.addEventListener("click", popUpFunc);
}
window.addEventListener("load", init);

//Hämtar användarens nuvarande position
function getLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (changePageLoc);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}
//sparar koordinaterna från geolocation i sessionstorage
function changePageLoc (e) {
    var lat;
    var lan;
    sessionStorage.setItem("lat", JSON.stringify(e.coords.latitude));
    sessionStorage.setItem("lan", JSON.stringify(e.coords.longitude));
    location.href = "results.html";
}

//sparar det som användaren skrivit i addressfältet i sessionstorage
function searchInput() {
    var zipCode = document.getElementById("searchbar").value
    sessionStorage.setItem("zipCode", zipCode);
    location.href = "results.html";
}
    

