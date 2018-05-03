//funktionen hämtar ett json-dokiument från googles API utifrån vilken address användaren sökt på.
function searchZipcode (zipCode) {
    var request; // Object för Ajax-anropet
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","https://maps.googleapis.com/maps/api/geocode/json?address=" + zipCode + "&key=AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA",true,); 
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
            if ( (request.readyState == 4) && (request.status == 200) ) showZip (request.responseText);
        };
}

//funktinen hämtar ut koordinaterna från jsaon-filen och sparar värdet i variablar som sedan skickas vidare till getRestaurants
function showZip (response) {
    var responseZip = JSON.parse(response);
    for (var i = 0; i < responseZip.results.length; i++) {
        lat = responseZip.results[i].geometry.location.lat;
        lng = responseZip.results[i].geometry.location.lng;
        sessionStorage.setItem("lat" ,lat);
        sessionStorage.setItem("lng", lng);
            map = new google.maps.Map(
                document.getElementById("map"),{
                center: {lat:lat, lng:lng},
                zoom: 12,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'})  
            userMarker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                title: "Här är du",
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}); 
                userMarker.setPosition({lat:lat,lng:lng});
                userMarker.setMap(map); 
        getRestaurants(lat, lng);
    };
}


