//Google.API = AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA
var map;
var latLng;
var userMarker;
//Hämtar platsinformation frå användarens aktuella position

function initMarker () {
    var popUp = document.getElementById("popup");
        addListener(popUp, "click", popUpFunc);
    var slider = document.getElementById("distanceSlider");
    var backBut = document.getElementById("backBtn");
    var resList= document.getElementById("resList");
        if (slider != null) {
            addListener (slider, "input", sliderValue);}
        if (backBut != null) {
            addListener (backBut, "click", backFunc);
        }
        getLocation();
}
window.addEventListener("load", initMarker);

function getLocation () {
    userMarker = new google.maps.Marker();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition (showYourPosition);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}

//Centrerar avändarens nuvarande position
function showYourPosition (e) {
    latLng = e.coords;//sparar användarens nuvarande koordinater
    map = new google.maps.Map(
        document.getElementById("map"),
        {center: {lat:latLng.latitude, lng:latLng.longitude},
        zoom: 12,})
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
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + latLng.latitude + "&lng=" + latLng.longitude + "&radius=3&sort_in=DESC&order_by=distance_in_km",true,);
        request.send(null); // Skicka begäran till servern
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
    if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
}

//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants (response) {
    var response = JSON.parse(response);
    for (var i = 0; i < response.payload.length; i++) {
        var lat = parseFloat(response.payload[i].lat);//sparar latitude med dess decimaler
        var lng = parseFloat(response.payload[i].lng);//sparar longitud med dess decimaler
        var name = response.payload[i].name;//Sparar restaurangens namn
        var rating = response.payload[i].rating;//Sparar restaurangens betyg
        var price = response.payload[i].avg_lunch_pricing;//Sparar restaurangens snittpris
        var tags = response.payload[i].search_tags;//Sparar restaurangens sök taggar
        var li = document.createElement("li");
        var img = document.createElement("img");
        var marker = new google.maps.Marker({lat,lng});
            marker.setPosition({lat,lng});
            marker.setMap(map);
            img.setAttribute("src", "test.jpg");
            img.setAttribute("alt", "logga");
            img.setAttribute("height", "120px");           
        var contentDiv = createInfoElements(name, tags, rating, price);
            li.appendChild(img);
            li.appendChild(contentDiv);
            li.classList.add("resBox");
            resList.appendChild(li);
        //Skickar med information om restauranger till en annan funktion som ligger på en annan Js-fil
        var infoWindow = new google.maps.InfoWindow ({content:contentDiv});
            marker.addListener("click", openInfoWindow(marker, contentDiv)); 
    }
}
