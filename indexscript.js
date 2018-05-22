//hämtar ut element från HTML-filen
function init() {
    sessionStorage.clear();
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", getLocation);
    var searchBut = document.getElementById("txtSrchBtn");
    searchBut.addEventListener("click", searchInput);

    var showTxtSrch = document.getElementById("showTxtSrch");
    showTxtSrch.addEventListener("click", showSrch);
}
window.addEventListener("load", init);

//visar textsökfältet
function showSrch() {
    var txtSrch = document.getElementById("txtSrch");
    txtSrch.classList.toggle("showSrch");
    txtSrch.classList.toggle("hideSrch");
}

//Hämtar användarens nuvarande position
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changePageLoc);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}

//sparar koordinaterna från geolocation i sessionstorage
function changePageLoc(e) {
    var lat;
    var lan;
    if (e.coords.latitude < "56.180545") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland. Latitude < 56.180545.");
        return;
    } else if (e.coords.latitude > "57.386792") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland. Latitude > 57.386792.");
        return;
    } else if (e.coords.longitude > "17.186522") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland. Longitude > 17.186522.");
        return;
    } else if (e.coords.longitude < "13.235257") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland. Longitude < 13.235257.");
        return;
    } else {
        sessionStorage.setItem("lat", JSON.stringify(e.coords.latitude));
        sessionStorage.setItem("lan", JSON.stringify(e.coords.longitude));
        location.href = "results.html";
    }
}

//sparar det som användaren skrivit i addressfältet i sessionstorage
function searchInput() {
    var zipCode = document.getElementById("searchbar").value
    if (zipCode != "") {
        sessionStorage.setItem("zipCode", zipCode);
        location.href = "results.html";
    } else {
        alert("Sök på en address");
    }
}