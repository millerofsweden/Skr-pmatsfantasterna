function init () {
    var popUp = document.getElementById("popup");
        addListener(popUp, "click", popUpFunc);
    var slider = document.getElementById("distanceSlider");
    var backBut = document.getElementById("backBtn");
    var resList= document.getElementById("resList");
        if (slider != null) {
            addListener (slider, "input", sliderValue);}
        if (backBut != null) {
            addListener (backBut, "click", backFunc);
        }
}
window.addEventListener("load", init);