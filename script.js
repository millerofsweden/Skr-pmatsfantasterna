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
    request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + latLng.latitude + "&lng=" + latLng.longitude + "&radius=15",true,);
    request.send(null); // Skicka begäran till servern
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
}

function showRestaurants (response) {
    var i;
    var lat;
    var lng;
    var response;
    var name;
    var rating;
    var restList = document.getElementById("restList");
    var ul = document.createElement("ul");
    restList.appendChild(ul);
    response = JSON.parse(response)
    for (i = 0; i < response.payload.length; i++) {
        lat = parseFloat(response.payload[i].lat);
        lng = parseFloat(response.payload[i].lng);
        name = response.payload[i].name;
        rating = response.payload[i].rating;
        console.log(name + rating)
        marker = new google.maps.Marker({lat,lng});
        marker.setPosition({lat,lng});
        marker.setMap(map);
        var li = document.createElement("li");
        var textNode = document.createTextNode(name + " " + rating);
        li.appendChild(textNode);
        ul.appendChild(li); 
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


