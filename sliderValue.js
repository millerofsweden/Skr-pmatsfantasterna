
function sliderValue() {
    var output = document.getElementById("valueDemo");
    output.innerHTML = this.value;
    var distance = this.value;
    var request; // Object för Ajax-anropet
    if (XMLHttpRequest) { request = new XMLHttpRequest(); } // Olika objekt (XMLHttpRequest eller ActiveXObject), beroende på webbläsare
    else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
    else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
    request.open("GET","https://cactuar.lnu.se/smapi/api/?api_key=9rntQ3eq&controller=food&method=getfromlatlng&debug=true&lat=" + latLng.latitude + "&lng=" + latLng.longitude + "&radius=" + distance + "&sort_in=DESC&order_by=distance_in_km",true,);
    request.send(null); // Skicka begäran till servern
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
    if ( (request.readyState == 4) && (request.status == 200) ) showRestaurants(request.responseText);
    };
}