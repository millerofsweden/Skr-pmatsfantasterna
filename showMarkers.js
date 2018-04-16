//Google.API = AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA
var map;
var latLng;
var userMarker;

//Hämtar platsinformation frå användarens aktuella position
function getLocation () {
    userMarker = new google.maps.Marker();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (showYourPosition);
            //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
        } else {
            alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}
window.addEventListener("load", getLocation);

//Centrerar avändarens nuvarande position
function showYourPosition (e) {
    latLng = e.coords;//sparar användarens nuvarande koordinater
    map = new google.maps.Map(
        document.getElementById("map"),
            {   center: {lat:latLng.latitude, lng:latLng.longitude},
            zoom: 12,
            })
        userMarker.setPosition({lat:latLng.latitude,lng:latLng.longitude});
        userMarker.setMap(map);
        var you = "Här är du";
        var infoWindow = new google.maps.InfoWindow ({you});
        infoWindow.open(map, userMarker);
        getRestaurants();
}

//Hämtar restauranger som ligger inom den viss radie från användarens position
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

//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants (response) {
    var i;
    //var ul = document.createElement("ul");
    var response = JSON.parse(response);
    for (i = 0; i < response.payload.length; i++) {
        var lat = parseFloat(response.payload[i].lat);//sparar latitude med dess decimaler
        var lng = parseFloat(response.payload[i].lng);//sparar longitud med dess decimaler
        var name = response.payload[i].name;//Sparar restaurangens namn
        var rating = response.payload[i].rating;//Sparar restaurangens betyg
        var price = response.payload[i].avg_lunch_pricing;//Sparar restaurangens snittpris
        var tags = response.payload[i].search_tags;//Sparar restaurangens sök taggar
        marker = new google.maps.Marker({lat,lng});
        marker.setPosition({lat,lng});
        marker.setMap(map);
        //var li = document.createElement("li");
        var br = document.createElement("br");
        //ul.appendChild(li);
        var resList = document.getElementById("resList");
        var li = document.createElement("li");
        var contentDiv = createInfoElements(name, tags, rating, price);
        li.appendChild(contentDiv);
        console.log(li);
        resList.appendChild(li);
        //Skickar med information om restauranger till en annan funktion som ligger på en annan Js-fil
        var infoWindow = new google.maps.InfoWindow ({content:contentDiv});
        marker.addListener("click", openInfoWindow(marker, contentDiv)); 
    }
}
