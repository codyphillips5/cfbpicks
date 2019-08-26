var game = {
  team: "-",
  spread : "-",
  pts : "-",
};

var choices = [{team: "", game: "", spread : "-", pts : "50"}, {team: "", game: "", spread : "-", pts : "40"}, {team: "", game: "", spread : "-", pts : "30"}, {team: "", game: "", spread : "", pts : "20"}, {team: "", game: "", spread : "", pts : "10"}];

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
			var badge = document.createElement('div');
			if (fav != homeTeamVal) {
				homeSide = "+";
				awaySide = "-";		
			}
			if (spread == 0) {
				homeSide = "";
				awaySide = "";
				spread = "PK";
			}
			if (required) {
				badge.className = 'required';
			}
			else {
				badge.className = 'games-layout';		
			}
			var header = '<span class=\'header\'><h3>' + awayTeam + ' vs ' + homeTeam + ' (' + homeSide + spread + ') </h3>';
			var select = '<select class=\'teamlist\' id=\'game' + gameId + '\' onchange=\"showPointTotals(\'point_totals_game_' + gameId + '\', this);\"><option value = \"\"> -- Select Team -- </option><option value=\"' + awayTeamVal + '\">' + awayTeam + ' ' + awaySide + spread + '</option><option value=\"' + homeTeamVal + '\">' + homeTeam + ' ' + homeSide + spread + '</option></select>';
			var display = '<div id=\"point_totals_game_' + gameId + '\" style=\"display:none;\">';
			var numbers = [5, 4, 3, 2, 1];
			var radios = [];
			for (var j = 0; j < numbers.length; j++) {
				if (required) {
					var radio = '<label><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0 required>' + numbers[j] + '0</label>'
				} 
				else {
					var radio = '<label><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0>' + numbers[j] + '0</label>'
				}
				radios.push(radio);
			}
			badge.innerHTML = '<form>' + header + select + '<br>'+ display + radios.join(' ') + '</form>';		
			document.getElementById(key).appendChild(badge);
		}
	}
});

function assignPointsByTeam(pts, id) {
	var pick = document.getElementById("game" + id);
	var userPick = pick.options[pick.selectedIndex].value;
	game.team = userPick;
	document.getElementById(pts).innerHTML = game.team;
	for (i = 0; i < choices.length; i++) {
		// only allow a team to be chosen once
		if(game.team == choices[i].team) {
			choices[i].team = "";
			document.getElementById(choices[i].pts).innerHTML = "";
		}
		if(pts == choices[i].pts) {
			choices[i].team = userPick;
			choices[i].game = id;
		}
		/*if(choices[i].pts != "") {
			console.log("clearing " + choices[i].game);
			document.getElementById("point_totals_game_" + choices[i].game).getElementsByTagName("input")[0].checked = false;
		}*/
	}
	document.getElementById(pts).innerHTML = game.team;
	console.log(choices);
}

function showPointTotals(divId, element){
	document.getElementById(divId).style.display = element.value != "" ? 'block' : 'none';
	game.team = element.value;
}

function setTeam(element) {
	game.team = element.value;
}