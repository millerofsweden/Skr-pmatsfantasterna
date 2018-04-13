//Google map och SMAPI anrop test
var map;
// var marker;
var userMarker;
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
    userMarker = new google.maps.Marker();
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
    console.log(latLng);
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
    var restList = document.getElementById("restList");
    var ul = document.createElement("ul");
    restList.appendChild(ul);
    var response = JSON.parse(response);
    var markers = [];
    var infoWindows = [];
    for (i = 0; i < response.payload.length; i++) {
        var lat = parseFloat(response.payload[i].lat);
        var lng = parseFloat(response.payload[i].lng);
        var name = response.payload[i].name;
        var rating = response.payload[i].rating;
        var price = response.payload[i].avg_lunch_pricing;
        var tags = response.payload[i].search_tags;
        marker = new google.maps.Marker({lat,lng});
        marker.setPosition({lat,lng});
        marker.setMap(map);
        var li = document.createElement("li");
        var br = document.createElement("br");
        ul.appendChild(li);
        var contentDiv = createInfoElements(name, tags, rating, price);
        li.appendChild(contentDiv);
        var infoWindow = new google.maps.InfoWindow ({content:contentDiv});
        marker.addListener("click", openInfoWindow(marker, contentDiv)); 
    }
}

function createInfoElements(name, rating, price, tags) {
    var contentDiv = document.createElement("div");
    var header = document.createElement("h5");
    var ratingP = document.createElement("p");
    var priceP = document.createElement("p");
    var tagsP = document.createElement("p");
    contentDiv.setAttribute("id", "content");
    header.appendChild(document.createTextNode(name));
    ratingP.appendChild(document.createTextNode(rating));
    priceP.appendChild(document.createTextNode(price));
    tagsP.appendChild(document.createTextNode(tags));
    contentDiv.appendChild(header);
    contentDiv.appendChild(ratingP);
    contentDiv.appendChild(priceP);
    contentDiv.appendChild(tagsP);
    return contentDiv;
}

function openInfoWindow(marker, content) {
    return function() {
        var infoWindow = new google.maps.InfoWindow ({content});
        infoWindow.open(map, marker);
    }
}

function showYourPosition (e) {
    latLng = e.coords;  
    map = new google.maps.Map(
        document.getElementById("map"),
            {   center: {lat: latLng.latitude, lng: latLng.longitude},
            zoom: 15,
            })
        userMarker.setPosition({lat:latLng.latitude,lng:latLng.longitude});
        userMarker.setMap(map);
}


