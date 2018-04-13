//Google map och SMAPI anrop test
var map;
var marker;
var latLng;

function init () {
    var restaurants;
    var location;
    restaurants = document.getElementById("getRestaurants");
    restaurants.addEventListener("click", getRestaurants);
    info = document.getElementById("info");
    yourPosition = document.getElementById("position");
    getLocation();
};
window.addEventListener("load", init);

function getLocation () {
    marker = new google.maps.Marker();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (showYourPosition);
    } else {
        yourPosition.innerHTML = "Geolocation är inte kompatibelt med din webbläsare";
    }
    initMap();
};

function initMap () {
    map = new google.maps.Map(
        document.getElementById("map"),
        {   center: {lat:56.879137, lng:14.804035},
        zoom: 6,
        styles: [
            {featureType:"poi", stylers: [{visibility:"off"}]},  // Turn off points of interest.
            {featureType:"transit.station",stylers: [{visibility:"off"}]}  // Turn off bus stations, etc.
        ]
    }
);
}

function getRestaurants () {
        var request; // Object för Ajax-anropet
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getall&debug=true",true,);
        request.send(null); // Skicka begäran till servern
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
            if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
}

function showRestaurants (response) {
    var i;
    var rest;
    var response;
        response = JSON.parse(response)
        for (i = 0; i < response.payload.length; i++) {
            marker = new google.maps.Marker(response);
            marker.setMap(map);
            console.log(response.payload[i]);
            if (response.payload[i].rating < 3) {
                info.innerHTML = "Mindre än 3 i betyg"
            } else {
                info.innerHTML = "Mer än 3 i betyg";
            }
        }
}

function showYourPosition (e) {
    latLng = e.coords;
    map = new google.maps.Map(
        document.getElementById("map"),
            {   center: {lat: latLng.latitude, lng: latLng.longitude},
            zoom: 15,
            })
        marker.setPosition({lat:latLng.latitude,lng:latLng.longitude});
        marker.setMap(map);
}


