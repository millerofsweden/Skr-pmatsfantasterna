var map;
var userMarker;
var lat;
var lng;;
var resultObject = {};//Innehåller informationen som hämtas från SMAPI
var objectLength;
var styles = [{
        elementType: "geometry",
        stylers: [
            {color: "#ffffff"}
        ]},
        {featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
            {color: "#000000"},
            {lightness: 10},
            {saturation: -40},
        ]},
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [
        { color: "#CC0000" }
    ]
    },{
        featureType: "road",
        elementType: "labels",
        stylers: [
        { visibility: "on"}
      ]
    },{
        featureType: "poi",
        elementType: "all",
        stylers: [
        { visibility: "off"}
    ]
    }
  ];
//Startar initElement och initSearch
function init () {

    initElement();
    initSearch();
}
window.addEventListener("load", init);

//funktionen hämtar ut element från HTML-filen
function initElement () {
    var distanceSlider = document.getElementById("distanceSlider").addEventListener("input", filter);//ändra till showrestaurants
    var typeList = document.getElementById("typeList").addEventListener("change", filter);//ändra till showrestaurants
    var resList = document.getElementById("resList").innerHTML = "";
    var sortMenu = document.getElementById("sortMenu");
    var popUp = document.getElementById("popup");
    popUp.addEventListener("click", popUpFunc);
    var backBut = document.getElementById("backBtn");//tillbakaknapp
    if (backBut != null) {//vid tryck på tillbakaknappen anropas funktion backFunc
        backBut.addEventListener ("click", backFunc);
    }
}

//Funktionen kollar om det finns något sparat i sessionstorage. Finns det inte det startar index.html igen
function initSearch () {
    var lat = sessionStorage.getItem("lat");
    var lng = sessionStorage.getItem("lan")
    var zipCode = sessionStorage.getItem("zipCode");
    if (zipCode != undefined) {
        sessionStorage.setItem("zipCode", zipCode);
        searchZipcode(zipCode);
    } else if (lat != undefined && lng != undefined) {
        sessionStorage.setItem("lat", lat);
        sessionStorage.setItem("lng", lng);
        showYourPosition(lat, lng);
    } else {
        location.href = "index.html";
    }
}

//Får koordinater från sessionstorage och Centrerar avändarens nuvarande position. Skickar med koordinaterna till getRestaurants
function showYourPosition (lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    map = new google.maps.Map(
        document.getElementById("map"),{
            center: {lat:lat, lng:lng},
            zoom: 12,})
            map.setOptions({styles: styles});
        userMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            title: "Här är du",
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
        userMarker.setPosition({lat:lat,lng:lng});
        userMarker.setMap(map);
        getRestaurants(lat, lng);
}

//Hämtar restauranger som ligger inom en viss radie från användarens position
function getRestaurants (lat, lng) {
    var request; // Object för Ajax-anropet
        if (XMLHttpRequest) { request = new XMLHttpRequest(); }
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&takeout=Y&sort_in=DESC&order_by=distance_in_km",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) restaurantObject(request.responseText);
    };
}

//skapar ett objekt med informationen från SMAPI
function restaurantObject(response){
    var resList = document.getElementById("resList").innerHTML = "";
    var response = JSON.parse(response);
    var i;//loopvariabel
      objectLength = 0;
      //resultObject.rating = [];
        for(i=0;i<response.payload.length;i++){
            resultObject[i] = {
            distance_in_km:response.payload[i].distance_in_km,
            lat: parseFloat(response.payload[i].lat),
            lng: parseFloat(response.payload[i].lng),
            name: response.payload[i].name,
            rating: response.payload[i].rating,
            avg_lunch_pricing: response.payload[i].avg_lunch_pricing,
            search_tags: response.payload[i].search_tags,
            sub_types: "PIZZA",//FEL!!! inför variabel
            number: i//FEL!!! kanske inte används
        };
            objectLength ++;
    }
          showRestaurants();
}
//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants() {
    var i;
    var l;
    var typeList = document.getElementById("typeList").value;
    var tagList = "";

    for (var i = 0; i < objectLength; i++) {
        var resList = document.getElementById("resList");
        var distance = resultObject[i].distance_in_km;
        var lat = parseFloat(resultObject[i].lat);//sparar latitude med dess decimaler
        var lng = parseFloat(resultObject[i].lng);//sparar longitud med dess decimaler
        var name = resultObject[i].name;//Sparar restaurangens namn
        var rating = resultObject[i].rating;//Sparar restaurangens betyg
        var price = resultObject[i].avg_lunch_pricing;//Sparar restaurangens snittpris
        var tags = resultObject[i].search_tags;//Sparar restaurangens sök taggar
        var li = document.createElement("li");//skapar ett li-element
        var img = document.createElement("img");//skapar img-element

        if (resultObject[i].distance_in_km < distanceSlider.value) {
            if (resultObject[i].search_tags.indexOf(typeList) >= 0 || typeList == "Valj mattyp...") {//"Valj mattyp"... borde nog ändras till något bättre
                var marker = new google.maps.Marker({lat,lng,
                    animation: google.maps.Animation.DROP,
                    title: resultObject[i].name,
                    clickable: true,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'});
                    marker.setPosition({lat,lng});//tillsätter koordinater på markörerna
                    marker.setMap(map);//sätter ut markörer för restaurangerna
                    img.setAttribute("src", "pics/test.jpg");//tillsätter en bild till img-taggen
                    img.setAttribute("alt", "logga");//tillsätter alt-kommentar för img-taggen
                var contentDiv = createInfoElements(name, rating, price);//lägger in info för resList och infoWindow
                var content = createInfoElements(name, rating, price);//lägger in info för resList och infoWindow
                //contentDiv.classList.add("info");
                    li.appendChild(img);//lägger in img i li
                    li.appendChild(contentDiv);//lägger in contentDiv i li
                    li.classList.add("resBox");//tillsätter li en class
                    resList.appendChild(li);//lägger in li i resList
                    showInfoWindow (marker, content);
                }//stänger if
            }//stänger if
        }//stänger for
        for(i=1;i<document.getElementById("typeList").length;i++){
          tagList += resultObject[i].search_tags + ", ";
          document.getElementsByTagName("option")[i].disabled = true;
        }
        for(i=1;i<document.getElementById("typeList").length;i++){
          if(tagList.indexOf(document.getElementsByTagName("option")[i].innerHTML.toLowerCase()) >=0){
            document.getElementsByTagName("option")[i].disabled = false;
          }
        }
    }
//funktion för att visa inforutan
function showInfoWindow (marker, content) {
        var markerInfo = new google.maps.InfoWindow ({
            content: content
        });
        google.maps.event.addListener(marker, "click", function () {
            markerInfo.open(map, marker);
        });
}

function filter () {
    resList.innerHTML = "";
            var output = document.getElementById("valueDemo");//span-elementet som visar antal km för användaren
            output.innerHTML = distanceSlider.value; //Ändrar värdet vid förändring

    lat = sessionStorage.getItem("lat");
    lng = sessionStorage.getItem("lng");
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    map = new google.maps.Map(
      document.getElementById("map"),{
            center: {lat: lat, lng: lng},
            zoom: 12,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'})
      userMarker = new google.maps.Marker({
            title: "Här är du",
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
      userMarker.setPosition({lat:lat,lng:lng});
      userMarker.setMap(map);
      map.setOptions({styles: styles});
    showRestaurants();
}
//sorterar restaurangerna i den ordning som användaren valt.
function sorting () {
    var lat = sessionStorage.getItem("lat");
    var lng = sessionStorage.getItem("lng");
    var request; // Object för Ajax-anropet
    if (sortMenu.lastElementChild.value == "distance") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); }
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&&takeout=Y&sort_in=ASC&order_by=distance_in_km",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) restaurantObject(request.responseText);
    };
    }   if (sortMenu.lastElementChild.value == "lowPrice") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); }
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&takeout=Y&sort_in=ASC&order_by=avg_lunch_pricing",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) restaurantObject(request.responseText);
    };
    } if (sortMenu.lastElementChild.value == "highPrice") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); }
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&takeout=Y&sort_in=DESC&order_by=avg_lunch_pricing",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) restaurantObject(request.responseText);
    };
    } if (sortMenu.lastElementChild.value == "stars") {
        if (XMLHttpRequest) { request = new XMLHttpRequest(); }
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&takeout=Y&sort_in=DESC&order_by=rating",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) ) restaurantObject(request.responseText);
    };
    }
}
//Skapar info till den ruta som visas när användaren klickar på en restaurang-marker
function createInfoElements(name, rating, price, tags) {//dessa parametrar skickades med genom ett klick på en marker
    var contentDiv = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    var header = document.createElement("h5");//H5 för att restaurangnamnet skall vara som en rubrik
    var ratingP = document.createElement("p");
    var priceP = document.createElement("p");
    //var tagsP = document.createElement("p");
        contentDiv.setAttribute("id", "content");
        contentDiv.classList.add("info");
        header.appendChild(document.createTextNode(name));//Skapar en textnode för h5-taggen
        header.classList.add("name");
        //tagsP.appendChild(document.createTextNode(tags));//skapar en textnode för p-taggen
        //tagsP.classList.add("tags");
        ratingP.appendChild(document.createTextNode(rating));//skapar en textnode för p-taggen
        ratingP.classList.add("rating-outer");
        priceP.appendChild(document.createTextNode(price));//skapar en textnode för p-taggen
        priceP.classList.add("price-outer");
        contentDiv.appendChild(header);//Info läggs in i div-elementet
        contentDiv.appendChild(ratingP);//Info läggs in i div-elementet
        contentDiv.appendChild(priceP);//Info läggs in i div-elementet
        //contentDiv.appendChild(tagsP);//Info läggs in i div-elementet
    return contentDiv;
    };
