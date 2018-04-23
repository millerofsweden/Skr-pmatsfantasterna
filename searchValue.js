var zip;

function zipCode(input) {
    for(var i = 0; i < input.length; i++) {
        var zip = input[i].value;
    }
    zipCodeApi(zip);
}

function zipCodeApi (zip) {
    var request; // Object för Ajax-anropet
        if (XMLHttpRequest) { request = new XMLHttpRequest(); } 
        else if (ActiveXObject) { request = new ActiveXObject("Microsoft.XMLHTTP"); }
        else { alert("Tyvärr inget stöd för AJAX, så data kan inte läsas in"); return false; }
        request.open("GET","http://maps.googleapis.com/maps/api/geocode/json?&address=" + zip + "&api_key=AIzaSyDuDBtQhhfX6-Svdj0pf9pY3e0MXcMd-uA",true,);
        request.send(null);
        request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if ( (request.readyState == 4) && (request.status == 200) )  googleApi(request.responseText);
    };


function googleApi (response) {
    console.log(response);
    var responseGoogle = JSON.parse(response);
    }
}