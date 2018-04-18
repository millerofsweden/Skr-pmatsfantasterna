//Google.API = AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA
var map;
var latLng;
var userMarker;

function initMarker () {
    var popUp = document.getElementById("popup");//popup för frågetecknet
    addListener(popUp, "click", popUpFunc);
    var slider = document.getElementById("distanceSlider");//avståndsslider
    var backBut = document.getElementById("backBtn");//tillbakaknapp
    var resList= document.getElementById("resList");//resultatlista
    if (slider != null) {//vid förflyttning av slidern anropas funktion sliderValue
        addListener (slider, "input", sliderValue);}
        if (backBut != null) {//vid tryck på tillbakaknappen anropas funktion backFunc
            addListener (backBut, "click", backFunc);
        }
        getLocation();//anropas direkt efter init för att få fram den aktuella positionen
    }
    window.addEventListener("load", initMarker);
    
//Hämtar platsinformation från användarens aktuella position
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
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + latLng.latitude + "&lng=" + latLng.longitude + "&radius=3&sort_in=DESC&order_by=distance_in_km",true,);
        request.send(null);
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
        var li = document.createElement("li");//skapar ett li-element
        var img = document.createElement("img");//skapar img-element
        var marker = new google.maps.Marker({lat,lng});
            marker.setPosition({lat,lng});//tillsätter koordinater på markörerna
            marker.setMap(map);//sätter ut markörer för restaurangerna
            img.setAttribute("src", "test.jpg");//tillsätter en bild till img-taggen
            img.setAttribute("alt", "logga");//tillsätter alt-kommentar för img-taggen         
        var contentDiv = createInfoElements(name, tags, rating, price);//lägger in info för resList och infoWindow
            li.appendChild(img);//lägger in img i li
            li.appendChild(contentDiv);//lägger in contentDiv i li
            li.classList.add("resBox");//tillsätter li en class
            resList.appendChild(li);//lägger in li i resList
        //Skickar med information om restauranger till en annan funktion som ligger på en annan Js-fil
        var infoWindow = new google.maps.InfoWindow ({content:contentDiv});//lägger in contentDiv i Div-elementet med id content
            marker.addListener("click", openInfoWindow(marker, contentDiv));//lägger in contentDiv i markörens inforuta 
    }
}
