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
$.getJSON("https://codyphillips5.github.io/cfbpicks/week1.json", function(json) {
	for (var key in json) {
		for (var i = 0; i < json[key].length; i++) {
			var gameId = json[key][i].gameId;
			var homeTeam = json[key][i].homeTeam;
			var homeTeamVal = json[key][i].homeTeamValue;
			var awayTeam = json[key][i].awayTeam;
			var awayTeamVal = json[key][i].awayTeamValue;
			var spread = json[key][i].spread;
			var fav = json[key][i].favorite;
			var homeSide = "-";
			var awaySide = "+";
			var required = json[key][i].required;
			if (fav != homeTeamVal) {
				homeSide = "+";
				awaySide = "-";		
			}
			if (spread == 0) {
				homeSide = "";
				awaySide = "";
				spread = "PK";
			}
			var header = '<span class=\'header\'><h3>' + awayTeam + ' vs ' + homeTeam + ' (' + homeSide + spread + ') </h3>';
			var select = '<select class=\'teamlist\' id=\'game\' onchange=\"showDiv(\'point_totals_game_' + gameId + '\', this);\"><option value = \"\"> -- Select Team -- </option><option value=\"' + awayTeamVal + '\">' + awayTeam + ' ' + awaySide + spread + '</option><option value=\"' + homeTeamVal + '\">' + homeTeam + ' ' + homeSide + spread + '</option></select>';
			var display = '<div id=\"point_totals_game_' + gameId + '\" style=\"display:none;\">';
			var numbers = [5, 4, 3, 2, 1];
			var radios = [];
			for (var j = 0; j < numbers.length; j++) {
				var radio = '<label><input type=\"radio\" onchange=\"myNewFunction(this.value);\" name=\"pick_worth\" value=' + numbers[j] + '0>' + numbers[j] + '0</label>'
				radios.push(radio);
			}
			var badge = document.createElement('div');
			if(required) {
			badge.className = 'required';
			}
			else {
				badge.className = 'games-layout';		
			}

			badge.innerHTML = '<form>' + header + select + display + radios.join(' ') + '</form>';		
			document.getElementById(key).appendChild(badge);
		}
	}
	console.log(json); // this will show the info it in firebug console
});
