
function createInfoElements(name, rating, price, tags) {
    var contentDiv = document.createElement("div");
    var header = document.createElement("h5");
    var ratingP = document.createElement("p");
    var priceP = document.createElement("p");
    var tagsP = document.createElement("p");
    contentDiv.setAttribute("id", "content");
    header.appendChild(document.createTextNode(name));
    ratingP.appendChild(document.createTextNode(rating));
    priceP.appendChild(document.createTextNode(price));
    tagsP.appendChild(document.createTextNode(tags));
    contentDiv.appendChild(header);
    contentDiv.appendChild(ratingP);
    contentDiv.appendChild(priceP);
    contentDiv.appendChild(tagsP);
    return contentDiv;
}

function openInfoWindow(marker, content) {
    return function() {
        var infoWindow = new google.maps.InfoWindow ({content});
        infoWindow.open(map, marker);
    }
}