//funktionen hämtar ett json-dokiument från googles API utifrån vilken address användaren sökt på.
function searchZipcode(zipCode) {
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); }
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA", true, );
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ((request.readyState == 4) && (request.status == 200)) showZip(request.responseText);
    };
}//End searchZipCode

//funktionen hämtar ut koordinaterna från json-filen och sparar värdet i variablar som sedan skickas vidare till getRestaurants
//Funktionen gör även så att användaren inte kan söka utanför småland och öland
function showZip(response) {
    var responseZip = JSON.parse(response);
    lat1 = responseZip.results[0].geometry.location.lat;
    lng1 = responseZip.results[0].geometry.location.lng;
    if (lat1 < "56.180545") {
        alert("Tjänsten funkar inte om du söker utanför Småland eller Öland. Latitude < 56.180545.");
        location.href = "index.html";
    }
    else if (lat1 > "57.386792") {
        alert("Tjänsten funkar inte om du söker utanför Småland eller Öland. Latitude > 57.386792.");
        location.href = "index.html";
    }
    else if (lng1 > "17.186522") {
        alert("Tjänsten funkar inte om du söker utanför Småland eller Öland. Longitude > 17.186522.");
        location.href = "index.html";
    }
    else if (lng1 < "13.235257") {
        alert("Tjänsten funkar inte om du söker utanför Småland eller Öland. Longitude < 13.235257.");
        location.href = "index.html";
    }

    for (var i = 0; i < responseZip.results.length; i++) {
        lat = responseZip.results[i].geometry.location.lat;
        lng = responseZip.results[i].geometry.location.lng;
        sessionStorage.setItem("lat", lat);
        sessionStorage.setItem("lng", lng);
        map = new google.maps.Map(
            document.getElementById("map"), {
                center: { lat: lat, lng: lng },
                zoom: 13,
                streetViewControl: false,
                gestureHandling: "greedy",
                icon: "pics/burgerPin.png"
            })
        userMarker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            title: "Här är du",
            icon: 'pics/markerRed.png'
        });
        userMarker.setPosition({ lat: lat, lng: lng });
        userMarker.setMap(map);
        map.setOptions({ minZoom: 9, maxZoom: 18 });
        getRestaurants(lat, lng);
    };
}//End showZip