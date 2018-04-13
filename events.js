// JavaScript Document

// Lägg till en händelsehanterare
// obj är elementet, type är händelsen och fn är funktionen
function addListener(obj, type, fn) {
	if (obj.addEventListener) obj.addEventListener(type,fn,false);
	else obj.attachEvent("on"+type,fn);
} // End addListener

// Ta bort en händelsehanterare
function removeListener(obj, type, fn) {
	if (obj.removeEventListener) obj.removeEventListener(type,fn,false);
	else obj.detachEvent("on"+type,fn);
} // End removeListener

// Ta fram en referens till det element som händelsen inträffade för
function getTarget(e) { // e är ett Event-objekt
	if (e.target) return e.target;
	else return e.srcElement;
} // End getTarget

// Stoppa fördefinierad händelse
function preventDefault(e) { // e är ett Event-objekt
	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
} // End preventDefault