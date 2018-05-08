function init(){
	var backBut = document.getElementById("backBtn");//tillbakaknapp
	if (backBut != null) {//vid tryck på tillbakaknappen anropas funktion backFunc
		backBut.addEventListener ("click", backFunc);
	}
	var popUp = document.getElementById("popup");
		popUp.addEventListener("click", popUpFunc);
}
window.addEventListener("load", init);

function backFunc() {
	window.history.back(); //Backar bakåt ett steg i användarens historik, 'om' det finns historik.
}

//Funktion för att visa popupfönster
function popUpFunc() {
	var popup;
		popup = document.getElementById("helpPop");
		popup.classList.toggle("show");
}

function about () {
	var about = document.getElementById("contactBtn");
		about.addEventListener("click", aboutPage);
}

function aboutPage() {
	location.href = "about.html";
}