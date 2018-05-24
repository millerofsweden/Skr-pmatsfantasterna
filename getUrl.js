var map;
var userMarker;
var lat;
var lng;
var resultObject = [];//Innehåller informationen som hämtas från SMAPI
var objectLength;
var idInfo;
var markers = [];

function init() {
    var distanceSlider = document.getElementById("distanceSlider");//Slidern som ändrar sökradien
    distanceSlider.setAttribute("title", "Dra för att ändra sökradien");
    distanceSlider.addEventListener("input", filter);
    var typeList = document.getElementById("typeList");//Listan med filtreringsalternativ på typ av mat
    typeList.setAttribute("title", "Filtrera på typ av mat");
    typeList.addEventListener("change", filter);
    var resList = document.getElementById("resList").innerHTML = "";//Resultatlistan där restaurangerna visas i box-form
    var backBut = document.getElementById("backBtn");//tillbakaknapp
    backBut.setAttribute("title", "Tillbaka");
    var sortMenu = document.getElementById("sortMenu");//Lista me dolika val av sorteringar
    sortMenu.setAttribute("title", "Sortera restauranger");
    var modal = document.getElementById("modalBox");//https://www.w3schools.com/howto/howto_css_modals.asp
    window.onclick = function (event) {//Vid klick utanför boxen stängs boxen ner
        if (event.target == modal) {
            modal.style.display = "none";
            filter();
        }
    }
    //Kollar ifall det inte finns något sparat i sessionstorage. 
    //Finns det något i sessionstorage startar olika funktioner beroende på om det är plats eller sökfälts-sökning
    //Annars kommer användaren tillbaka till startsidan
    var lat = sessionStorage.getItem("lat");//Hämtar koordinater för latitud från sessionstorage
    var lng = sessionStorage.getItem("lan");//Hämtar koordinater för longitud från sessionstorage
    var zipCode = sessionStorage.getItem("zipCode");//HÄmtar den sparade informationen från sökfältet
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
    addListener(window, "scroll", fixedMap);//Om användaren scrollar anropas funktion för fixed-map
}
window.addEventListener("load", init);
//Fixerar kartan när användaren scrollar neråt
function fixedMap() {
    var left = document.getElementById("leftColumn");
    var right = document.getElementById("rightColumn");
    var topPosition = left.offsetTop + 75;

    if (window.matchMedia("(max-width: 870px)").matches) {
        left.classList.remove("fixed");
        right.classList.remove("fixed");
    }
    else {
        if (window.pageYOffset >= topPosition) {
            left.classList.add("fixed");
            right.classList.add("fixed");
        }
        else {
            left.classList.remove("fixed");
            right.classList.remove("fixed");
        }
    }
} //End fixedMap
//Sätter ut en markör för var användaren befinner sig just nu. koordinaterna kommer från sessionstorage från init-funktionen
function showYourPosition(lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    map = new google.maps.Map(
        document.getElementById("map"), {
            center: { lat: lat, lng: lng },
            zoom: 13,
            styles: [{
                featureType: "poi",
                stylers: [{
                    visibility: "off"
                }
                ]
            }],
            animation: google.maps.Animation.DROP,
            gestureHandling: "greedy",
            streetViewControl: false
        })
    userMarker = new google.maps.Marker({
        title: "Här är du",
        icon: 'pics/markerRed.png',
        animation: google.maps.Animation.DROP
    });
    userMarker.setPosition({ lat: lat, lng: lng });
    userMarker.setMap(map);
    map.setOptions({ minZoom: 9, maxZoom: 18 });
    getRestaurants(lat, lng);
}//End showYourPosition

//Hämtar restauranger som ligger inom en viss radie från användarens position
function getRestaurants(lat, lng) {
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + lat + "&lng=" + lng + "&radius=30&takeout=Y&sort_in=DESC&order_by=distance_in_km", true, );
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) restaurantObject(request.responseText);
    };
}//End getRestaurants

//skapar ett objekt med informationen från SMAPI
function restaurantObject(response) {
    var resList = document.getElementById("resList").innerHTML = "";
    var response = JSON.parse(response);
    var i;//loopvariabel
    objectLength = 0;
    for (i = 0; i < response.payload.length; i++) {
        resultObject[i] = {
            distance_in_km: response.payload[i].distance_in_km,
            lat: parseFloat(response.payload[i].lat),
            lng: parseFloat(response.payload[i].lng),
            name: response.payload[i].name,
            rating: response.payload[i].rating,
            avg_lunch_pricing: response.payload[i].avg_lunch_pricing,
            search_tags: response.payload[i].search_tags, number: i,
            sub_type: response.payload[i].sub_type,
            id: response.payload[i].id
        };
        objectLength++;
    }
    showRestaurants();
}//End restaurantObject
//Hämtar ut information om restaurangerna för att presentera den på sidan
function showRestaurants() {
    var i;
    var l;
    var tagList = "";
    var resList = document.getElementById("resList").innerHTML = "";
    var typeList = document.getElementById("typeList").value;
    for (var i = 0; i < objectLength; i++) {
        var resList = document.getElementById("resList");
        var distance = resultObject[i].distance_in_km;//Sparar avståndet
        distance = Math.round(distance * 100) / 100;//Avrundar avsåndet för att få färre decimaler
        var lat = parseFloat(resultObject[i].lat);//sparar latitude
        var lng = parseFloat(resultObject[i].lng);//sparar longitud
        var name = resultObject[i].name;//Sparar restaurangens namn
        var rating = resultObject[i].rating;//Sparar restaurangens betyg
        var price = resultObject[i].avg_lunch_pricing;//Sparar restaurangens snittpris
        var tags = resultObject[i].search_tags;//Sparar restaurangens sök taggar
        var id = resultObject[i].id//Sparar restaurangens unika id
        var li = document.createElement("li");//skapar ett li-element
        li.dataset.id = resultObject[i].id;//sparar restaurangernas id i en variabel
        var img = document.createElement("img");//skapar img-element

        if (resultObject[i].distance_in_km < distanceSlider.value) {//Kollar om avstånd till restaurang är mindre än slidersn värde
            if (resultObject[i].search_tags.indexOf(typeList) >= 0 || typeList == "Valj mattyp...") {//Kollar om någon typ av mat är vald
                img.setAttribute("id", "resImg");
                img.setAttribute("src", "pics/" + resultObject[i].sub_type + ".gif");//tillsätter en bild till img-taggen
                img.setAttribute("alt", "Bild för snabbmatsrestaurangen");//tillsätter alt-kommentar för img-taggen
                var contentDiv = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                var content = createInfoElements(name, rating, price, distance);//lägger in info för resList och infoWindow
                content.classList.add("infoContent");
                var marker = new google.maps.Marker({
                    lat, lng, content,
                    title: resultObject[i].name,
                    clickable: true,
                    store_id: id,
                    streetViewControl: false,
                    gestureHandling: "greedy",
                    animation: google.maps.Animation.DROP,
                    icon: "pics/burgerPin.png"
                });
                markers.push(marker);
                marker.setPosition({ lat, lng });//tillsätter koordinater på markörerna
                marker.setMap(map);//sätter ut markörer för restaurangerna
                map.setOptions({ minZoom: 9, maxZoom: 18 });//Min och max zoom för kartan
                google.maps.event.addListener(marker, "mouseover", showInfoWindow);//Funktion anropas om pekaren är över en markör
                google.maps.event.addListener(marker, "click", getMarkerInfo);//Funktion anropas vid klick på markör
                google.maps.event.addListener(marker, "click", getMarkerReview);//Funktion anropas vid klick på markör
                li.appendChild(img);//lägger in img i li
                li.appendChild(contentDiv);//lägger in contentDiv i li
                li.classList.add("resBox");//tillsätter li en class
                resList.appendChild(li);//lägger in li i resList
                li.addEventListener("click", getDetailedInfo);//Funktion anropas vid klick på ett li-element
                li.addEventListener("click", getReviewInfo);//Funktion anropas vid klick på ett li-element
                li.addEventListener("mouseover", function () {//funktion för att få en marker att hoppa
                    for (var i = 0; i < markers.length; i++) {
                        if (this.dataset.id === markers[i].store_id) {//Kollar om li-id är samma som markör-id, isf börjar en markör hoppa
                            markers[i].setAnimation(google.maps.Animation.BOUNCE)
                            map.setCenter(markers[i]);//Den hoppande markören centreras på kartan
                        }
                    }
                })
                li.addEventListener("mouseout", function () {//funktion för att markern ska sluta hoppa
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].setAnimation(null);
                    }
                })
                li.style.cursor = "pointer";
            }//stänger if
        }//stänger if
    }//stänger for
    //For-looparna går igenom drop-down filtreringen för att göra de val som inte finns tillgängliga disablade 
    //för att användaren inte ska kunna välja den typen av mat
    for (i = 1; i < document.getElementById("typeList").length; i++) {
        document.getElementsByTagName("option")[i].disabled = true;
    }
    for (i = 0; i < objectLength; i++) {
        tagList += resultObject[i].search_tags + ", ";
    }
    for (i = 1; i < document.getElementById("typeList").length; i++) {
        if (tagList.indexOf(document.getElementsByTagName("option")[i].innerHTML.toLowerCase()) >= 0) {
            document.getElementsByTagName("option")[i].disabled = false;
        }
    }
    infoWindow = new google.maps.InfoWindow();
}//End showRestaurants
//funktion för att visa inforutan
function showInfoWindow(marker, content) {
    infoWindow.setContent(this.content);
    infoWindow.open(map, this);
    google.maps.event.addListener(map, "click", function () {
        infoWindow.close();
    });
}//End showRestaurants
//Hämtar info från markören som användaren klickat på
function getMarkerInfo() {
    lat = this.lat;//hämtar koordinat sparat i sessionstorage
    lng = this.lng;//hämtar koordinat sparat i sessionstorage
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getfromlatlng&lat=" + lat + "&lng=" + lng + "&debug=true", true);
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) getModalInfo(request.responseText);
    };
}//End getMarkerInfo
//Hämtar information för det listobjektet användaren klickat på
function getDetailedInfo() {
    var idInfo = this.dataset.id;//sparar id i en ny variabbel som sedan förs in i smapi-anropet
    lat = sessionStorage.getItem("lat");//hämtar koordinat sparat i sessionstorage
    lng = sessionStorage.getItem("lng");//hämtar koordinat sparat i sessionstorage
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getAll&ids=" + idInfo + "&debug=true", true);
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) getModalInfo(request.responseText);
    };
}//End getDetailedInfo
//Hämtar recensioner för restaurangen och dess markör som blivit klickad på
function getMarkerReview() {
    var id = this.store_id;
    lat = sessionStorage.getItem("lat");//hämtar koordinat sparat i sessionstorage
    lng = sessionStorage.getItem("lng");//hämtar koordinat sparat i sessionstorage
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getreviews&id=" + id + "&debug=true", true);
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) reviewInfo(request.responseText);
    };
}//End getMarkerReview
//Hämtar recensioner för restaurangen och dess listobjekt som blivit klickad på
function getReviewInfo() {
    var idInfo = this.dataset.id;//sparar id i en ny variabbel som sedan förs in i smapi-anropet
    lat = sessionStorage.getItem("lat");//hämtar koordinat sparat i sessionstorage
    lng = sessionStorage.getItem("lng");//hämtar koordinat sparat i sessionstorage
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=establishment&method=getreviews&id=" + idInfo + "&debug=true", true);
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) reviewInfo(request.responseText);
    };
}//End getReviewInfo
//Skapar boxarna som dyker upp vid ett klick på markörerna eller på resultatlistan
function getModalInfo(response) {
    var infoContent = document.getElementById("infoContent");
    infoContent.innerHTML = "";//tömmer infoContent för att fylla på med ny information
    var response = JSON.parse(response);
    var lat = parseFloat(response.payload[0].lat);
    var lng = parseFloat(response.payload[0].lng);
    var nameInfo = response.payload[0].name;//Sparar restaurangens namn
    var abstract = response.payload[0].abstract;
    var description = response.payload[0].description;
    var text = response.payload[0].text;//Sparar restaurangens beskrivningstext
    var phone = response.payload[0].phone_number;//Sparar restaurangens telefonnummer
    var id = response.payload[0].id;//sparar restaurangens id
    var address = response.payload[0].address;
    var website = response.payload[0].website;//Sparar restaurangens webbsida
    var rating = response.payload[0].rating;
    var modalbox = document.getElementById("modalBox");
    modalbox.style.display = "block";

    var closeElem = document.createElement("span");//Span för kryss-ruta (för att stänga rutan)
    closeElem.setAttribute("class", "close");
    addListener(closeElem, "click", function () { modalbox.style.display = "none", filter(); });
    infoContent.appendChild(closeElem);


    var modalMap = document.createElement("div"); //Div för karta
    modalMap.setAttribute("id", "modalMap");
    infoContent.appendChild(modalMap);

    var modalInfo = createModalElement(nameInfo, abstract, description, text, phone, address, website, rating);
    infoContent.appendChild(modalInfo);

    map = new google.maps.Map(
        document.getElementById("modalMap"), {
            center: { lat: lat, lng: lng },
            zoom: 16,
            styles: [{
                featureType: "poi",
                stylers: [{
                    visibility: "off"
                }
                ]
            }],
            animation: google.maps.Animation.DROP,
            gestureHandling: "greedy",
            streetViewControl: false
        })
    var marker = new google.maps.Marker({
        lat, lng,
        title: nameInfo,
        clickable: true,
        cursor: "default",
        icon: "pics/burgerPin.png"
    })
    marker.setPosition({ lat, lng });//tillsätter koordinater på markörerna
    marker.setMap(map);//sätter ut markörer för restaurangerna
    map.setOptions({ minZoom: 9, maxZoom: 18 });
}//End getModalInfo
//Hämtar ut recensioner av användarna för en restaurang som sedan skrivs ut i modalboxen
function reviewInfo(response) {
    var revContent = document.getElementById("revContent");
    revContent.innerHTML = "";
    var modalReviews = document.createElement("div");
    modalReviews.setAttribute("class", "modalReviews");

    var response = JSON.parse(response);
    if (response.payload.length > 0) {
        for (var i = 0; i < response.payload.length; i++) {
            var name = response.payload[i].name;
            var comment = response.payload[i].comment;
            var rating = response.payload[i].rating;
            var time = response.payload[i].relative_time;
            var commentDiv = createReviewElement(name, comment, rating, time);
            modalReviews.appendChild(commentDiv);
        }
        revContent.appendChild(modalReviews);
    }
    if (response.payload.length == 0) {
        var commentDiv = document.createElement("div");
        commentDiv.setAttribute("class", "comment");
        commentDiv.appendChild(document.createTextNode("Tyvärr finns det inga recensioner än."));
        revContent.appendChild(commentDiv);
    }
}//End reviewInfo
//skapar info som sedan skickas till getModalInfo där boxen skapas
function createModalElement(nameInfo, abstract, description, text, phone, address, website, rating) {
    var ratingValue = Math.round((rating / 5) * 10) * 10; //räknar ut betyget i procent, för ratingIn senare i funktionen

    var modalInfo = document.createElement("span"); //Span-elem för information
    modalInfo.setAttribute("class", "modalInfo");

    var nameElem = document.createElement("h3"); //H3-tagg för restaurangnamn
    nameElem.appendChild(document.createTextNode(nameInfo)); //Lägger in namnet i H3 taggen
    modalInfo.appendChild(nameElem); //Lägger h3-taggen/noden i span-elementet modalInfo

    var ratingOut = document.createElement("div"); //Div-element för betyg/stjärnor
    ratingOut.setAttribute("class", "rating-outer"); //Tomma stjärnor, dessa täcks över med ifyllda beroende betyget
    modalInfo.appendChild(ratingOut);

    var ratingIn = document.createElement("div"); //Div-element för betyg/stjärnor
    ratingIn.setAttribute("class", "rating-inner"); //rating-inner är ifyllda stjärnor som ligger ovanpå rating-outer
    ratingIn.setAttribute("style", "width:" + ratingValue + "%"); //Width bestämt av betyget (default är width 0). Eg. ett betyg på 2.5 är 50%, allstå 2,5 stjärnor
    ratingOut.appendChild(ratingIn); //ratingIn-noden läggs under rating-outer, för att ligga ovanpå.

    var descElem = document.createElement("p"); //P-tagg för beskrivning, typ av restaurang
    descElem.setAttribute("class", "description"); //Klass för stilsättning
    descElem.appendChild(document.createTextNode(description));
    modalInfo.appendChild(descElem);

    if (website !== "") { //Skapar endast webElem om det finns en URL
        var webElem = document.createElement("a"); //P-elem för webbadress
        webElem.href = website;
        webElem.title = website;
        webElem.target = "_blank";
        webElem.appendChild(document.createTextNode("Restaurangens webbplats"));
        modalInfo.appendChild(webElem);//Info läggs in i div-elementet
    };

    var addElem = document.createElement("p");//P-tagg för gatuadress
    addElem.setAttribute("class", "address"); //Klass för stilsättning
    addElem.appendChild(document.createTextNode(address));
    modalInfo.appendChild(addElem);

    var phoneElem = document.createElement("p"); //P-tagg för telefonnummer
    phoneElem.setAttribute("class", "phone"); //klass för stilsättning
    phoneElem.appendChild(document.createTextNode(phone));
    modalInfo.appendChild(phoneElem);

    var abstElem = document.createElement("p");//P-tagg för abstrakt/beskrivning
    abstElem.setAttribute("class", "abstract");
    abstElem.appendChild(document.createTextNode(abstract));
    modalInfo.appendChild(abstElem);

    var textElem = document.createElement("p"); //P-tagg för text
    textElem.setAttribute("class", "text");
    textElem.appendChild(document.createTextNode(text));
    modalInfo.appendChild(textElem);

    return modalInfo; //Skickar tillbaka informationen till func. getModalInfo
}//End createModalInfo
//Funktion att skapa element där recensioner skrivs ut
function createReviewElement(name, comment, rating, time) {
    var ratingValue = Math.round((rating / 5) * 10) * 10; //räknar ut betyget i procent

    var commentDiv = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    commentDiv.setAttribute("class", "comment");

    var revName = document.createElement("h4");
    revName.appendChild(document.createTextNode(name));
    commentDiv.appendChild(revName);

    var revRatingOut = document.createElement("div");
    revRatingOut.setAttribute("class", "rating-outer");
    commentDiv.appendChild(revRatingOut);

    var revRatingIn = document.createElement("div");
    revRatingIn.setAttribute("class", "rating-inner");
    revRatingIn.setAttribute("style", "width:" + ratingValue + "%");
    revRatingOut.appendChild(revRatingIn);

    var revTime = document.createElement("p");
    revTime.appendChild(document.createTextNode(time));
    commentDiv.appendChild(revTime);

    var revComment = document.createElement("p");
    revComment.appendChild(document.createTextNode("\"" + comment + "\""));
    commentDiv.appendChild(revComment);

    return commentDiv;
}//End createReviewElement
//Funktion för att filtrera
function filter() {
    resList.innerHTML = "";
    var output = document.getElementById("valueDemo");//span-elementet som visar antal km för användaren
    output.innerHTML = distanceSlider.value; //Ändrar värdet vid förändring
    lat = sessionStorage.getItem("lat");
    lng = sessionStorage.getItem("lng");
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    map = new google.maps.Map(
        document.getElementById("map"), {
            center: { lat: lat, lng: lng },
            zoom: 13,
            styles: [{
                featureType: "poi",
                stylers: [{
                    visibility: "off"
                }
                ]
            }],
            streetViewControl: false,
            gestureHandling: "greedy",
            icon: 'pics/burgerPin'
        })
    userMarker = new google.maps.Marker({
        title: "Här är du",
        icon: 'pics/markerRed.png'
    });
    userMarker.setPosition({ lat: lat, lng: lng });
    userMarker.setMap(map);
    map.setOptions({ minZoom: 9, maxZoom: 18 });
    showRestaurants();
    if (resList.innerHTML === "") {
        resList.innerHTML = "Hoppsan, din sökning gav inga träffar. Prova att filtrera på något annat eller öka sökradien."
    }
}//End filter
/**
 *  Sortera en liststruktur (Array) innehållande objekt. Sorteringen 
 *  genomförs utifrån specifik objektegenskap.
 *
 *  @param {Array}   data Lista att sortera
 *  @param {String}  key  Egenskap att sortera efter
 *  @param {Boolean} asc  Sortera i fallande eller stigande ordning
 *
 *  @return {Array} Sorterad lista
 *///Henrik Andersen 2018
function m_sort(data, key, asc) {
    key = key || "rating";
    asc = asc || false;
    if (data.constructor === Array && data.length > 1) {
        if (data[0][key] == null) return data;
        data.sort(function (a, b) {
            if (Number(a[key]) < Number(b[key])) return (asc === true) ? 1 : -1;
            else if (Number(a[key]) > Number(b[key])) return (asc === true) ? -1 : 1;
            else return 0;
        });
    }

    return data;
}//End m-sort
//sorterar restaurangerna i den ordning som användaren valt.
function sorting() {
    if (sortMenu.lastElementChild.value == "distance") {//Om användaren valt att sortera på avstånd
        var sr = m_sort(resultObject, "distance_in_km", false);
        showRestaurants(sr);
    } else if (sortMenu.lastElementChild.value == "lowPrice") {//Om användaren valt att sortera på lågt pris
        var sr = m_sort(resultObject, "avg_lunch_pricing", false);
        showRestaurants(sr);
    } else if (sortMenu.lastElementChild.value == "highPrice") {//Om användaren valt att sortera på högt pris
        var sr = m_sort(resultObject, "avg_lunch_pricing", true);
        showRestaurants(sr);
    } else if (sortMenu.lastElementChild.value == "stars") {//Om användaren valt att sortera på betyg
        var sr = m_sort(resultObject, "rating", true);
        showRestaurants(sr);
    }
}//End sorting

//Skapar info till den ruta som visas när användaren klickar på en restaurang-marker
function createInfoElements(name, rating, price, distance, id) {//dessa parametrar skickades med genom ett klick på en marker
    var contentDiv = document.createElement("div");//Skapar ett div element där nedanstående information skall stå
    var header = document.createElement("h3");//H3 för att restaurangnamnet skall vara som en rubrik
    var ratingOut = document.createElement("div");
    var ratingIn = document.createElement("div");
    var priceOut = document.createElement("div");
    var priceIn = document.createElement("div");
    var distanceDiv = document.createElement("div");
    var ratingValue = Math.round((rating / 5) * 10) * 10; //räknar ut betyget i procent
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
    priceIn.setAttribute("style", "width:" + priceValue + "%");
    priceOut.appendChild(priceIn);
    priceOut.setAttribute("title", "Snittpriset för en lunch är " + price + " kr");
    distanceDiv.appendChild(document.createTextNode("Avstånd: " + distance + " km"));
    distanceDiv.classList.add("distance");

    contentDiv.appendChild(header);//Info läggs in i div-elementet
    contentDiv.appendChild(distanceDiv);
    contentDiv.appendChild(ratingOut);//Info läggs in i div-elementet
    contentDiv.appendChild(priceOut);//Info läggs in i div-elementet
    return contentDiv;
};//End createInfoElements