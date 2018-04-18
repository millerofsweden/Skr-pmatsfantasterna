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
}
//Skapar info-rutan
function openInfoWindow(marker, content) {
    return function() {
        var infoWindow = new google.maps.InfoWindow ({content});
        infoWindow.open(map, marker);
    }
}