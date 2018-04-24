var latLng;
var map;
var userMarker;
var lat;
var lng;
var priceArray = [];
var ratingArray = [];
var distanceArray = [];

function init () {
    var sortMenu = document.getElementById("sortMenu");
    if (sessionStorage !== "undefined") {
    for (i = 0; i < sessionStorage.length; i++) {
        lat = JSON.parse(sessionStorage.getItem("lat"));
        lng = JSON.parse(sessionStorage.getItem("lan"));
        showYourPosition();
        sessionStorage.clear();
    }   
    } else {
        searchValue();
    }
}
window.addEventListener("load", init);

//Centrerar avändarens nuvarande position
function showYourPosition () {
    map = new google.maps.Map(
        document.getElementById("map"),{
            center: {lat:lat, lng:lng},
            zoom: 12,})  
        userMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            title: "Här är du"}); 
        userMarker.setPosition({lat:lat,lng:lng});
        userMarker.setMap(map);
        getRestaurants();
}
//Hämtar restauranger som ligger inom den viss radie från användarens position
function getRestaurants () {
    var request; // Object för Ajax-anropet
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=DESC&order_by=distance_in_km",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
}

//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants (response) {
    var response = JSON.parse(response);
    resList.innerHTML = "";
    
    for (var i = 0; i < response.payload.length; i++) {
        var distance = response.payload[i].distance_in_km;
        var lat = parseFloat(response.payload[i].lat);//sparar latitude med dess decimaler
        var lng = parseFloat(response.payload[i].lng);//sparar longitud med dess decimaler
        var name = response.payload[i].name;//Sparar restaurangens namn
        var rating = response.payload[i].rating;//Sparar restaurangens betyg
        var price = response.payload[i].avg_lunch_pricing;//Sparar restaurangens snittpris
        var tags = response.payload[i].search_tags;//Sparar restaurangens sök taggar
        var li = document.createElement("li");//skapar ett li-element
        var img = document.createElement("img");//skapar img-element       
        var marker = new google.maps.Marker({
            lat,lng,
            animation: google.maps.Animation.DROP,
            title: response.payload[i].name});
        marker.setPosition({lat,lng});//tillsätter koordinater på markörerna
        marker.setMap(map);//sätter ut markörer för restaurangerna
        img.setAttribute("src", "pics/test.jpg");//tillsätter en bild till img-taggen
        img.setAttribute("alt", "logga");//tillsätter alt-kommentar för img-taggen         
        var contentDiv = createInfoElements(name, tags, rating, price);//lägger in info för resList och infoWindow
        li.appendChild(img);//lägger in img i li
        li.appendChild(contentDiv);//lägger in contentDiv i li
        li.classList.add("resBox");//tillsätter li en class
        resList.appendChild(li);//lägger in li i resList
        priceArray.push(price);
        ratingArray.push(rating);
        distanceArray.push(distance);
    }
        sortMenu.addEventListener("change", sorting);
}
    
function sorting () {
    var request; // Object för Ajax-anropet
    if (sortMenu.lastElementChild.value == "distance") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=ASC&order_by=distance_in_km",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
    }   if (sortMenu.lastElementChild.value == "lowPrice") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=ASC&order_by=avg_lunch_pricing",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
    } if (sortMenu.lastElementChild.value == "highPrice") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=DESC&order_by=avg_lunch_pricing",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
    } if (sortMenu.lastElementChild.value == "stars") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=DESC&order_by=rating",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
    }   
}




//Skapar info till den ruta som visas när användaren klickar på en restaurang-marker
function createInfoElements(name, rating, price, tags) {//dessa parametrar skickades med genom ett klick på en marker
    var contentDiv = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    var header = document.createElement("h5");///H5 för att restaurangnamnet skall vara som en rubrik
    var ratingP = document.createElement("p");
    var priceP = document.createElement("p");
    var tagsP = document.createElement("p");
        contentDiv.setAttribute("id", "content");//Id hämtas från SMAPI
        header.appendChild(document.createTextNode(name));//Restaurangens namn läggs in i h5-taggen
        ratingP.appendChild(document.createTextNode(rating));//Restaurangens betyg läggs in i p-taggen
        priceP.appendChild(document.createTextNode(price));//Restaurangens snittpris läggs in i p-taggen
        tagsP.appendChild(document.createTextNode(tags));//Restaurangens söktaggar läggs in i p-taggen
        contentDiv.appendChild(header);//Info läggs in i div-elementet
        contentDiv.appendChild(ratingP);//Info läggs in i div-elementet
        contentDiv.appendChild(priceP);//Info läggs in i div-elementet
        contentDiv.appendChild(tagsP);//Info läggs in i div-elementet
    return contentDiv;
    };

