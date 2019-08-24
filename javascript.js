var game = {
  team: "-",
  spread : "-",
  pts : "-",
};
function showDiv(divId, element){
	document.getElementById(divId).style.display = element.value != "" ? 'block' : 'none';
	game.team = element.value;
}
function setTeam(element) {
	game.team = element.value;
}
function myNewFunction(sel) {
	var pts = sel;
	document.getElementById(pts).innerHTML = game.team;
}