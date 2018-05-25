//hämtar ut element från HTML-filen
function init() {
    sessionStorage.clear();
    var yourPosition = document.getElementById("locSrchBtn");
    yourPosition.addEventListener("click", getLocation);
    yourPosition.setAttribute("title", "Klicka här för att hitta restauranger nära dig");

    var searchBut = document.getElementById("txtSrchBtn");
    searchBut.addEventListener("click", searchInput);

    var showTxtSrch = document.getElementById("showTxtSrch");
    showTxtSrch.addEventListener("click", showSrch);
    showTxtSrch.setAttribute("title", "Klicka här för att söka på valfri address");
}//End init
window.addEventListener("load", init);

//visar textsökfältet
function showSrch() {
    var txtSrch = document.getElementById("txtSrch");
    txtSrch.classList.toggle("showSrch");
    txtSrch.classList.toggle("hideSrch");
}//End showSrch

//Hämtar användarens nuvarande position
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(changePageLoc);
        //om platsåtkomst godkänns och hittas skickas användaren till en annan funktion
    } else {
        alert("Platsåtkomst är inte kompatibelt med din webbläsare");
    };
}//End getLocation

//sparar koordinaterna från geolocation i sessionstorage om användaren sökt inom småland och öland
function changePageLoc(e) {
    var lat;
    var lan;
    if (e.coords.latitude < "56.180545") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland.");
        return;
    } else if (e.coords.latitude > "57.386792") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland.");
        return;
    } else if (e.coords.longitude > "17.186522") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland.");
        return;
    } else if (e.coords.longitude < "13.235257") {
        alert("Tjänsten funkar inte om du inte befinner dig i Småland eller på Öland.");
        return;
    } else {
        sessionStorage.setItem("lat", JSON.stringify(e.coords.latitude));
        sessionStorage.setItem("lan", JSON.stringify(e.coords.longitude));
        location.href = "results.html";
    }
}//End changePageLoc

//sparar det som användaren skrivit i addressfältet i sessionstorage
//disablear Sök-knappen om ingenting står i textfältet
function searchInput() {
    var txtSrchBtn = document.getElementById("txtSrchBtn");
      txtSrchBtn.disabled = false;
      txtSrchBtn.classList.remove("disabled");
    if(document.getElementById("searchbar").value == ""){
      txtSrchBtn.disabled = true;
      txtSrchBtn.classList.add("disabled");
    }
  }//End searchInput
  
  //sparar det som användaren skrivit i addressfältet i sessionstorage
  function searchBtn(){
    var zipCode = document.getElementById("searchbar").value
      if (zipCode != "") {
          sessionStorage.setItem("zipCode", zipCode);
          location.href = "results.html";
  }
  }