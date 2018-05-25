function init() {
	var about = document.getElementById("aboutBtn");
	about.setAttribute("title", "Om oss");
	var homeButton = document.getElementById("home");
	homeButton.setAttribute("title", "Till startsidan");
	homeButton.addEventListener("click", home);
	var backBut = document.getElementById("backBtn");//tillbakaknapp
	if (backBut != null) {//vid tryck på tillbakaknappen anropas funktion backFunc
		backBut.addEventListener("click", backFunc);
	}
	var popUp = document.getElementById("popup");
	popUp.addEventListener("click", popUpFunc);
	popUp.setAttribute("title", "Klicka för hjälp");
	var x = window.matchMedia("(max-width: 600px)")
	changeHeader(x);
	x.addListener(changeHeader);

} //End init
window.addEventListener("load", init);
//Byter headern när fönstret blir mindre
function changeHeader(x) {
	var header = document.getElementById("home");
	if (x.matches) { // If media query matches
		header.src = "pics/smallheader.gif";
	} else {
		header.src = "pics/header.gif";
	}
} //End changeHeader
//Gör så att användaren kan gå bakåt med den tillagda knappen
function backFunc() {
	window.history.back(); //Backar bakåt ett steg i användarens historik, 'om' det finns historik.
}//End backFunc

//Funktion för att visa popupfönster
function popUpFunc() {
	var showpopup;
	showpopup = document.getElementById("helpPop");
	showpopup.classList.toggle("show");
	showpopup.classList.toggle("hide");
}//End popUpFunc
//Tar annvändaren till about.html
function about() {
	about.addEventListener("click", aboutPage);
}//End about

function aboutPage() {
	location.href = "about.html";
}//aboutPage
//Tar användaren till index.html
function home() {
	location.href = "index.html";
}//End home
