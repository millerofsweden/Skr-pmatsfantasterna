function init() {
	var about = document.getElementById("contactBtn");
	about.setAttribute("title", "Om oss");
	var homeButton = document.getElementById("home").addEventListener("click", home);
	var backBut = document.getElementById("backBtn");//tillbakaknapp
	if (backBut != null) {//vid tryck på tillbakaknappen anropas funktion backFunc
		backBut.addEventListener("click", backFunc);
	}
	var popUp = document.getElementById("popup");
	popup.setAttribute("title", "Klicka för hjälp");
	popUp.addEventListener("click", popUpFunc);

	var x = window.matchMedia("(max-width: 870px)")
	changeHeader(x);
	x.addListener(changeHeader);

} //End init
window.addEventListener("load", init);

function changeHeader(x) {
	var header = document.getElementById("home");
	if (x.matches) { // If media query matches
        header.src = "pics/smallheader.gif";
    } else {
        header.src = "pics/header.gif";
    }
} //End changeHeader

function backFunc() {
	window.history.back(); //Backar bakåt ett steg i användarens historik, 'om' det finns historik.
}

//Funktion för att visa popupfönster
function popUpFunc() {
	var popup;
	popup = document.getElementById("helpPop");
	popup.classList.toggle("show");
	popup.classList.toggle("hide");
}

function about() {
	about.addEventListener("click", aboutPage);
}

function aboutPage() {
	location.href = "about.html";
}

function home() {
	location.href = "index.html";
}
