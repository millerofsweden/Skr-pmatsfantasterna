//API = AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA
var map;
var latLng;
var userMarker;

function getLocation () {
    userMarker = new google.maps.Marker();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (showYourPosition);
        } else {
            alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}
window.addEventListener("load", getLocation);

function showYourPosition (e) {
    latLng = e.coords;
    map = new google.maps.Map(
        document.getElementById("map"),
            {   center: {lat:latLng.latitude, lng:latLng.longitude},
            zoom: 12,
            })
        userMarker.setPosition({lat:latLng.latitude,lng:latLng.longitude});
        userMarker.setMap(map);
        getRestaurants();
}

function getRestaurants () {
    console.log(getRestaurants);
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
    var constent = document.getElementById("content");
    var ul = document.createElement("resList");
    var li = document.getElementsByClassName("resBox");
    var response = JSON.parse(response);
    for (i = 0; i < response.payload.length; i++) {
        var lat = parseFloat(response.payload[i].lat);
        var lng = parseFloat(response.payload[i].lng);
        var name = response.payload[i].name;
        var rating = response.payload[i].rating;
        var price = response.payload[i].avg_lunch_pricing;
        var tags = response.payload[i].search_tags;
        var marker = new google.maps.Marker({lat,lng});
        marker.setPosition({lat,lng});
        marker.setMap(map);
        var contentDiv = createInfoElements(name, tags, rating, price);
        var infoWindow = new google.maps.InfoWindow ({content:contentDiv});
        marker.addListener("click", openInfoWindow(marker, contentDiv)); 
    };
}