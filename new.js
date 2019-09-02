var game = {
  team: "",
  spread : "",
  pts : "",
  game : "" 
};

var thisTeam = "";
var thisMascot = "";
var thisTeamAbb = "";

var choices = [{teamAbb: "", fullTeam: "", game: "", spread : "", pts : "50"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "40"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "30"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "20"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "10"}];

$.getJSON("https://codyphillips5.github.io/cfbpicks/week2.json", function(json) {
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
			var header = '<span class=\'header\'><h4>' + awayTeam + ' vs ' + homeTeam + ' (' + homeSide + spread + ') </h4><br>';
			var select = '<select class=\'teamlist\' id=\'game' + gameId + '\' onchange=\"showPointTotals(\'point_totals_game_' + gameId + '\', this);\"><option value = \"\"> -- Select Team -- </option><option value=\"' + awayTeamVal + '\">' + awayTeam + ' ' + awaySide + spread + '</option><option value=\"' + homeTeamVal + '\">' + homeTeam + ' ' + homeSide + spread + '</option></select>';
			var display = '<div id=\"point_totals_game_' + gameId + '\" style=\"display:none;\">';
			var numbers = [5, 4, 3, 2, 1];
			var radios = [];
			for (var j = 0; j < numbers.length; j++) {
				if (required) {
					var radio = '<label class="radio-inline font-weight-bold"><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0 required>' + numbers[j] + '0</label>'
				} 
				else {
					var radio = '<label class="radio-inline font-weight-bold"><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0>' + numbers[j] + '0</label>'
				}
				radios.push(radio);
			}
			badge.innerHTML = '<form>' + header + select + '<br>'+ display + radios.join(' ') + '</form>';		
			document.getElementById(key).appendChild(badge);
		}
	}
});

function getTeamInfo(teamId) {
	$.getJSON("https://codyphillips5.github.io/cfbpicks/teams.json", function(team) {
	for (var key in team) {
		if(team[key].teamId == teamId){
			thisTeam = team[key].team;
			console.log(thisTeam);
		}
	}
});
}

function assignPointsByTeam(pts, id) {
	var pick = document.getElementById("game" + id);
	var userPick = pick.options[pick.selectedIndex].value;
	var fullTeamName = pick.options[pick.selectedIndex].text;
	game.team = userPick;
	document.getElementById(pts).value = game.team;
	for (i = 0; i < choices.length; i++) {
		// only allow a team to be chosen once
		if (game.team == choices[i].teamAbb) {
			choices[i].teamAbb = "";
			choices[i].fullTeam = "";
			document.getElementById(choices[i].pts).value = "";
		}
		if (pts == choices[i].pts) {
			if(choices[i].teamAbb != "") {
				console.log("game.game = " + game.game);
 				if(choices[i].game != game.game) {
					var inputs = document.getElementById("point_totals_game_" + choices[i].game).getElementsByTagName("input");
					for (j = 0; j < inputs.length; j++) {
						inputs[j].checked = false;
					}
				}
			}
			choices[i].teamAbb = userPick;
			choices[i].fullTeam = fullTeamName;
			choices[i].game = id;
			game.game = id;
		}
	}
	document.getElementById(pts).value = game.team;
}

function showPointTotals(divId, element){
	document.getElementById(divId).style.display = element.value != "" ? 'block' : 'none';
	var gm = divId.substring(divId.lastIndexOf("_") + 1);
	console.log(choices);
	for (i = 0; i < choices.length; i++) {
		// only allow a team to be chosen once
		if (choices[i].game == gm){ 
			if (element.value != choices[i].teamAbb) {
				if (choices[i].pts) {
					document.getElementById(choices[i].pts).value = "";
					choices[i].teamAbb = "";
					choices[i].fullTeam = "";
					choices[i].game = "";
					choices[i].spread = "";
				}
			}
		}
	}

	var inputs = document.getElementById("point_totals_game_" + gm).getElementsByTagName("input");
	for (j = 0; j < inputs.length; j++) {
		inputs[j].checked = false;
	}
	game.team = element.value;
	game.game = gm;
}

function setTeam(element) {
	game.team = element.value;
}

// save picks
const savePicks = document.querySelector('#save_picks');
if(savePicks) {
    savePicks.addEventListener('submit', (e) => {
        try {
			e.preventDefault();
			const fifty = document.getElementById('50').value;
			const forty = document.getElementById('40').value;
			const thirty = document.getElementById('30').value;
			const twenty = document.getElementById('20').value;
			const ten = document.getElementById('10').value;
			console.log(fifty);
		}
		catch (err) {
			console.log(err);
			console.log(err.message);
		}
	})
}