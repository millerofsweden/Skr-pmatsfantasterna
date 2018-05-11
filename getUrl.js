  var map;
  var userMarker;
  var lat;
  var lng;
  var resultObject = {};//Innehåller informationen som hämtas från SMAPI
  var objectLength;

function init () {
    
    var distanceSlider = document.getElementById("distanceSlider").addEventListener("input", filter);//ändra till showrestaurants
    var typeList = document.getElementById("typeList").addEventListener("change", filter);//ändra till showrestaurants
    var resList = document.getElementById("resList").innerHTML = "";
    var sortMenu = document.getElementById("sortMenu");
    var modalContent = document.getElementById("modalContent");
  	var modal = document.getElementById("modalBox");//https://www.w3schools.com/howto/howto_css_modals.asp
  	    window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
      	        }
  	        }
    var lat = sessionStorage.getItem("lat");
    var lng = sessionStorage.getItem("lan");
    var zipCode = sessionStorage.getItem("zipCode");
        if (zipCode != undefined) {
            sessionStorage.setItem("zipCode", undefined);
                searchZipcode(zipCode);
        } else if (lat != undefined && lng != undefined) {
            sessionStorage.setItem("lat", lat);
            sessionStorage.setItem("lng", lng);
                showYourPosition(lat, lng);
        } else {
            location.href = "index.html";
        }
    }
window.addEventListener("load", init);
//Får koordinater från sessionstorage och Centrerar avändarens nuvarande position. Skickar med koordinaterna till getRestaurants

function home() {
    console.log(home);
    location.href = "index.html";
}
function showYourPosition (lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
        map = new google.maps.Map(
            document.getElementById("map"),{
                center: {lat:lat, lng:lng},
                zoom: 13,
                animation: google.maps.Animation.DROP,
                streetViewControl: false})
                    userMarker = new google.maps.Marker({
                    title: "Här är du",
                    icon: 'pics/markerRed.png'});
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
            for(i = 0; i < response.payload.length; i++) {
                resultObject[i] = {
                    distance_in_km:response.payload[i].distance_in_km,
                    lat: parseFloat(response.payload[i].lat),
                    lng: parseFloat(response.payload[i].lng),
                    name: response.payload[i].name,
                    rating: response.payload[i].rating,
                    avg_lunch_pricing: response.payload[i].avg_lunch_pricing,
                    search_tags: response.payload[i].search_tags, number: i,
                    sub_type: response.payload[i].sub_type,
                    id: response.payload[i].id
                };
            objectLength ++;
        }    
    showRestaurants();
}
//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants() {
    var i;
    var l;
    var tagList = "";
    var typeList = document.getElementById("typeList").value;
        for (var i = 0; i < objectLength; i++) {
                var resList = document.getElementById("resList");
                var distance = resultObject[i].distance_in_km;
                    distance = Math.round(distance * 100)/100;
                var lat = parseFloat(resultObject[i].lat);//sparar latitude med dess decimaler
                var lng = parseFloat(resultObject[i].lng);//sparar longitud med dess decimaler
                var name = resultObject[i].name;//Sparar restaurangens namn
                var rating = resultObject[i].rating;//Sparar restaurangens betyg
                var price = resultObject[i].avg_lunch_pricing;//Sparar restaurangens snittpris
                var tags = resultObject[i].search_tags;//Sparar restaurangens sök taggar
                var li = document.createElement("li");//skapar ett li-element
                    li.dataset.id = resultObject[i].id;//sparar restaurangernas id i en variabel
                var img = document.createElement("img");//skapar img-element

                    if (resultObject[i].distance_in_km < distanceSlider.value) {
                        if (resultObject[i].search_tags.indexOf(typeList) >= 0 || typeList == "Valj mattyp...") {//"Valj mattyp"... borde nog ändras till något bättre
                        img.setAttribute("id", "resImg");
                        img.setAttribute("src", "pics/" + resultObject[i].sub_type +".gif");//tillsätter en bild till img-taggen
                        img.setAttribute("alt", "logga");//tillsätter alt-kommentar för img-taggen
                        var contentDiv = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                        var content = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                        content.classList.add("infoContent");
                        var marker = new google.maps.Marker({lat, lng, content,
                            title: resultObject[i].name,
                            clickable: true,
                            streetViewControl: false,
                            icon: "pics/burgerPin.png"});
                                marker.setPosition({lat,lng});//tillsätter koordinater på markörerna
                                marker.setMap(map);//sätter ut markörer för restaurangerna
                                google.maps.event.addListener(marker, "click", showInfoWindow);
                                    li.appendChild(img);//lägger in img i li
                                    li.appendChild(contentDiv);//lägger in contentDiv i li
                                    li.classList.add("resBox");//tillsätter li en class
                                    resList.appendChild(li);//lägger in li i resList
                                    li.addEventListener("click", getDetailedInfo);
                                    }//stänger if
                                }//stänger if
                            }//stänger for
                        
                            for (i = 1; i < document.getElementById("typeList").length; i++) {
                                    document.getElementsByTagName("option")[i].disabled = true;
                                }
                            for (i = 0;i < objectLength;i++){
                                    tagList += resultObject[i].search_tags + ", ";
                            }
                            for (i = 1; i < document.getElementById("typeList").length; i++) {
                                if (tagList.indexOf(document.getElementsByTagName("option")[i].innerHTML.toLowerCase()) >= 0) {
                                    document.getElementsByTagName("option")[i].disabled = false;
                                }
                            }
                        infoWindow = new google.maps.InfoWindow();
}

//funktion för att visa inforutan
function showInfoWindow (marker, content) {
    infoWindow.setContent(this.content);
    infoWindow.open(map, this);
    google.maps.event.addListener(map, "click", function () {
    infoWindow.close();
    });
}

function getDetailedInfo() {
    var idInfo = this.dataset.id;//sparar id i en ny variabbel som sedan förs in i smapi-anropet
        lat = sessionStorage.getItem("lat");//hämtar koordinat sparat i sessionstorage
        lng = sessionStorage.getItem("lng");//hämtar koordinat sparat i sessionstorage
    var request; // Object för Ajax-anropet
            if (XMLHttpRequest) { request = new XMLHttpRequest(); }
            else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
            else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
            request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getAll&ids=" + idInfo, true);
            //request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getfromlatlng&types=food&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&sort_in=DESC&order_by=distance_in_km",true,);
            request.send(null);
            request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
            if ( (request.readyState == 4) && (request.status == 200) ) getModalInfo(request.responseText);
        };
}

function getModalInfo (response) {
    modalContent.innerHTML = "";//tömmer modalcontent för att inte fylla på med ny information
        var response = JSON.parse(response);
        var nameInfo = response.payload[0].name;//Sparar restaurangens namn
        var abstract = response.payload[0].abstract;
        var description = response.payload[0].description;
        var text = response.payload[0].text;//Sparar restaurangens beskrivningstext
        var phone =response.payload[0].phone_number;//Sparar restaurangens telefonnummer
        var id = response.payload[0].id;//sparar restaurangens id
        var address = response.payload[0].address;
        var website = response.payload[0].website;//Sparar restaurangens webbsida
        var modalbox = document.getElementById("modalBox");
  			modalbox.style.display = "block";
        var modalInfo = createModalElement(nameInfo, abstract, description, text, phone, address, website);
            modalContent.appendChild(modalInfo);
}

function createModalElement (nameInfo, abstract, description, text, phone, address, website) {
    var createModal = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    var nameInfoModal = document.createElement("h5");//H5 för att restaurangnamnet skall vara som en rubrik
        nameInfoModal.appendChild(document.createTextNode(nameInfo));//Skapar en textnode för h5-taggen
        createModal.appendChild(nameInfoModal);//Info läggs in i div-elementet
    var abstractInfoModal = document.createElement("p");//H5 för att restaurangnamnet skall vara som en rubrik
        abstractInfoModal.appendChild(document.createTextNode(abstract));//Skapar en textnode för h5-taggen
        createModal.appendChild(abstractInfoModal);//Info läggs in i div-elementet
    var descInfoModal = document.createElement("p");//H5 för att restaurangnamnet skall vara som en rubrik
        descInfoModal.appendChild(document.createTextNode(description));//Skapar en textnode för h5-taggen
        createModal.appendChild(descInfoModal);//Info läggs in i div-elementet
    var textModal = document.createElement("p");
        textModal.appendChild(document.createTextNode(text));//skapar en textnode för p-taggen
        createModal.appendChild(textModal);//Info läggs in i div-elementet
    var phoneModal = document.createElement("p");
        phoneModal.appendChild(document.createTextNode(phone));//skapar en textnode för p-taggen
        createModal.appendChild(phoneModal);//Info läggs in i div-elementet
    var addressInfoModal = document.createElement("p");//H5 för att restaurangnamnet skall vara som en rubrik
        addressInfoModal.appendChild(document.createTextNode(address));//Skapar en textnode för h5-taggen
        createModal.appendChild(addressInfoModal);//Info läggs in i div-elementet
    var websiteModal = document.createElement("p");
        websiteModal.appendChild(document.createTextNode(website));
        createModal.appendChild(websiteModal);//Info läggs in i div-elementet
    return createModal;
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
                        zoom: 13,
                        streetViewControl: false,
                        icon: 'pics/burgerPin'})
                    userMarker = new google.maps.Marker({
                        title: "Här är du",
                        icon: 'pics/markerRed.png'});
                            userMarker.setPosition({lat:lat,lng:lng});
                            userMarker.setMap(map);
                                showRestaurants();
}
//sorterar restaurangerna i den ordning som användaren valt.
function sorting () {
    
        if (sortMenu.lastElementChild.value == "distance") {
            var i;
            for(i=0;i<objectLength-1;i++){
                if (resultObject[i].distance_in_km > resultObject[i+1].distance_in_km) {
                    var temp1 = resultObject[i];
                    var temp2 = resultObject[i+1];
                        resultObject[i] = temp2;
                        resultObject[i+1] = temp1;
                            i=-0;
                        }
                        console.log("Distade vägar");
                    }
                restaurantSorting(resultObject);
            
    }   if (sortMenu.lastElementChild.value == "lowPrice") {
        var i;
            for(i=0;i<objectLength-1;i++){
                if(resultObject[i].avg_lunch_pricing < resultObject[i+1].avg_lunch_pricing){
                    var temp1 = resultObject[i];
                    var temp2 = resultObject[i+1];
                        resultObject[i] = temp2;
                        resultObject[i+1] = temp1;
                            i=0;
                        }
                        console.log("Låga priser");
                    }
                restaurantSorting(resultObject);
           
    } if (sortMenu.lastElementChild.value == "highPrice") {
        var i;
            for(i=0;i<objectLength-1;i++){
                if(resultObject[i].avg_lunch_pricing > resultObject[i+1].avg_lunch_pricing){
                    var temp1 = resultObject[i];
                    var temp2 = resultObject[i+1];
                        resultObject[i] = temp2;
                        resultObject[i+1] = temp1;
                            i=0;
                        }
                        console.log("Höga priser");
                    }
                restaurantSorting(resultObject);
            
    } if (sortMenu.lastElementChild.value == "stars") {
        var i;
            for(i=0;i<objectLength-1;i++){
                if(resultObject[i].rating < resultObject[i+1].rating){
                    var temp1 = resultObject[i];
                    var temp2 = resultObject[i+1];
                        resultObject[i] = temp2;
                        resultObject[i+1] = temp1;
                            i=0;
                        }
                        console.log("betyg");
                    }
                restaurantSorting(resultObject);
    }
            
}

function restaurantSorting(resultObject) {
    var i;
    var l;
    var tagList = "";
    var resList = document.getElementById("resList").innerHTML = "";
    var typeList = document.getElementById("typeList").value;
        for (var i = 0; i < objectLength; i++) {
                var resList = document.getElementById("resList");
                var distance = resultObject[i].distance_in_km;
                    distance = Math.round(distance * 100)/100;
                var lat = parseFloat(resultObject[i].lat);//sparar latitude med dess decimaler
                var lng = parseFloat(resultObject[i].lng);//sparar longitud med dess decimaler
                var name = resultObject[i].name;//Sparar restaurangens namn
                var rating = resultObject[i].rating;//Sparar restaurangens betyg
                var price = resultObject[i].avg_lunch_pricing;//Sparar restaurangens snittpris
                var tags = resultObject[i].search_tags;//Sparar restaurangens sök taggar
                var li = document.createElement("li");//skapar ett li-element
                    li.dataset.id = resultObject[i].id;//sparar restaurangernas id i en variabel
                var img = document.createElement("img");//skapar img-element

                    if (resultObject[i].distance_in_km < distanceSlider.value) {
                        if (resultObject[i].search_tags.indexOf(typeList) >= 0 || typeList == "Valj mattyp...") {//"Valj mattyp"... borde nog ändras till något bättre
                        img.setAttribute("id", "resImg");
                        img.setAttribute("src", "pics/" + resultObject[i].sub_type +".gif");//tillsätter en bild till img-taggen
                        img.setAttribute("alt", "logga");//tillsätter alt-kommentar för img-taggen
                        var contentDiv = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                        var content = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                        content.classList.add("infoContent");
                        var marker = new google.maps.Marker({lat, lng, content,
                            title: resultObject[i].name,
                            clickable: true,
                            streetViewControl: false,
                            icon: "pics/burgerPin.png"});
                                marker.setPosition({lat,lng});//tillsätter koordinater på markörerna
                                marker.setMap(map);//sätter ut markörer för restaurangerna
                                google.maps.event.addListener(marker, "click", showInfoWindow);
                                    li.appendChild(img);//lägger in img i li
                                    li.appendChild(contentDiv);//lägger in contentDiv i li
                                    li.classList.add("resBox");//tillsätter li en class
                                    resList.appendChild(li);//lägger in li i resList
                                    li.addEventListener("click", getDetailedInfo);
                                    }//stänger if
                                }//stänger if
                            }//stänger for
                        
                            for (i = 1; i < document.getElementById("typeList").length; i++) {
                                    document.getElementsByTagName("option")[i].disabled = true;
                                }
                            for (i = 0;i < objectLength;i++){
                                    tagList += resultObject[i].search_tags + ", ";
                            }
                            for (i = 1; i < document.getElementById("typeList").length; i++) {
                                if (tagList.indexOf(document.getElementsByTagName("option")[i].innerHTML.toLowerCase()) >= 0) {
                                    document.getElementsByTagName("option")[i].disabled = false;
                                }
                            }
                        infoWindow = new google.maps.InfoWindow();
}
//Skapar info till den ruta som visas när användaren klickar på en restaurang-marker
function createInfoElements(name, rating, price, distance) {//dessa parametrar skickades med genom ett klick på en marker
    var contentDiv = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    var header = document.createElement("h3");//H3 för att restaurangnamnet skall vara som en rubrik
    var ratingOut = document.createElement("div");
  	var ratingIn = document.createElement("div");
    var priceOut = document.createElement("div");
    var priceIn = document.createElement("div");
    var distanceDiv = document.createElement("div");
  	var ratingValue = (Math.round(rating)*100)/5; //räknar ut betyget i procent
    var priceValue;

            //Omvandlar pris till en procentsats
        if (price <= 50) priceValue = 34;
        else if (price <= 85) priceValue = 67;
        else priceValue = 100;

            contentDiv.setAttribute("id", "content");
            contentDiv.classList.add("info");

            header.appendChild(document.createTextNode(name));//Skapar en textnode för h3-taggen
            header.classList.add("name");

            ratingOut.classList.add("rating-outer");
            ratingIn.classList.add("rating-inner");
            ratingIn.setAttribute("style", "width:" + ratingValue + "%");
            ratingOut.appendChild(ratingIn);

            priceOut.classList.add("price-outer");
            priceIn.classList.add("price-inner");
            priceIn.setAttribute("style","width:" + priceValue + "%");
            priceOut.appendChild(priceIn);
            distanceDiv.appendChild(document.createTextNode("Avstånd: " + distance + " km"));
            distanceDiv.classList.add("tags");

            contentDiv.appendChild(header);//Info läggs in i div-elementet
            contentDiv.appendChild(distanceDiv);
            contentDiv.appendChild(ratingOut);//Info läggs in i div-elementet
            contentDiv.appendChild(priceOut);//Info läggs in i div-elementet
        return contentDiv;
};
