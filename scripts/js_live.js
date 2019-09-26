var firtName = "";
var lastName = "";
var coversNum = [];
var coversTeam = [];

var standings, standings, resultsList, usersList;

var getPicks = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week5_picks.json", function(json){
	standings = json;
});

var getStandings = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(json){
	standings = json;
});

var getUsers= $.getJSON("https://codyphillips5.github.io/cfbpicks/json/users.json", function(json){
    usersList = json;
});

$.when(getPicks, getStandings, getUsers).then(function(){
	var tableStart = `<table class="table table-hover" id="results"><thead><tr><th scope="col">Name</th><th scope="col">50</th><th scope="col">40</th><th scope="col">30</th><th scope="col">20</th><th scope="col">10</th></tr></thead><tbody>`;

	for (var key in standings) {
		for (var i = 0; i < standings[key].length; i++) {
			// set starters
			var pointTotal = 0;
			var isCorrect;

			var user = standings[key][i].userId;
			// get user info
			for (var k in usersList) {
				for (var j = 0; j < usersList[k].length; j++) {
						if (user == usersList[k][j].userId) {
							firstName = usersList[k][j].FirstName;
							lastName = usersList[k][j].LastName;
					}
				}
			}
			var tableUser = tableUser + `<tr><th>${firstName + " " + lastName}</th>`;
			// check user picks against results
			for (var pointTotals = 50; pointTotals >= 10; pointTotals = pointTotals-10) {
				tableUser = tableUser + `<td>${standings[key][i][pointTotals]}</td>`;
			}
		}
	}
	tableUser = tableUser.replace("undefined","");
	var tableEnd = `</tbody></table>`;	
	document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
});