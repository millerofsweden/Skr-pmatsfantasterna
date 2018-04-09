//Google map och SMAPI anrop test
var map;

function init () {
    var restaurants;
    var location;
    restaurants = document.getElementById("getRestaurants");
    location = document.getElementById("getLocation");
    location.addEventListener("click", getLocation);
    map();
};
window.addEventListener("load", init);

function map () {
    map = new google.maps.Map(
        document.getElementById("map"),
        {   center: {lat:56.879137, lng:14.804035},
            zoom: 14,
            styles: [
                {featureType:"poi", stylers: [{visibility:"off"}]},  // Turn off points of interest.
                {featureType:"transit.station",stylers: [{visibility:"off"}]}  // Turn off bus stations, etc.
            ]
        }
    );
};

function getLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (showPosition);
    } else {
        yourPosition.innerHTML = "Geolocation är inte kompatibelt med din webbläsare";
    }
};

function showPosition (position) {
    var yourPosition;
    var showOnMap;
    yourPosition = document.getElementById("position");
    showOnMap = document.getElementById("showOnMap");
    yourPosition.innerHTML = "Dina nuvarande koordinater: " + "<br>Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
    showOnMap.addEventListener("click", getYourLocation);
};

function getYourLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (showYouOnMap);
    } else {
        yourPosition.innerHTML = "Geolocation är inte kompatibelt med din webbläsare";
    }
};

function showYouOnMap (position) {
    console.log(showYouOnMap);
    var lat;
    var lon;
    lat = position.coords.latitude
    lon = position.coords.longitude;
    console.log(lat);
    console.log(lon);
};