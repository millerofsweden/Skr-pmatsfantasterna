// JavaScript Document
var popup;

function init() {
	var backBtn; //Tillbaka-knappen
	var slider; //Avstånds 'slidern'
	var locationSrchBtn; //Sökknapp på startsidan, platsbaserat
	var textSrchBtn; //Sökknapp på startsidan, textinmatning
	
	popupBtn = document.getElementById("popup");
	slider = document.getElementById("distanceSlider");
	backBtn = document.getElementById("backBtn");
	locationSrchBtn = document.getElementById("locSrchBtn");
	textSrchBtn = document.getElementById("txtSrchBtn");
	
	//Följande lyssnare bör delas upp i olika JS-filer anpassade för sidan där funktionen ska utföras. Detta är en tillfällig lösning.
	if (slider != null) { //results.html
		addListener(slider,"input",sliderValue);
	}
	if (backBtn != null) { //results.html & about.html
		addListener(backBtn,"click",backFunc);
	}
	if (locationSrchBtn != null) { //index.html
		addListener(locationSrchBtn,"click",function() {location.href="results.html";});
		addListener(textSrchBtn,"click",function() {location.href="results.html";});
	}
	
	addListener(popupBtn,"click",popFunc); //alla sidor
	
} //End init
addListener(window,"load",init);

function popFunc() { //Funktion för att visa popupfönster
	var popup; 
	popup = document.getElementById("helpPop");
	popup.classList.toggle("show");
}

function backFunc() {
	window.history.back(); //Backar baåt ett steg i användarens historik, 'om' det finns historik.
}

function sliderValue() {
	var output; //span-elementet som visar antal km för användaren
	
	output = document.getElementById("valueDemo");
	output.innerHTML = this.value; //Ändrar värdet vid förändring
}

function showRes() { //går till resultatsidan
	location.href="results.html";
}