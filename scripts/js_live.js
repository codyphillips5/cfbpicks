var firtName = "";
var lastName = "";
var coversNum = [];
var coversTeam = [];

var standings, teams, resultsList, usersList;

var getPicks = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week11_picks.json", function(json){
	standings = json;
});

var getStandings = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(json){
	teams = json;
});

var getUsers= $.getJSON("https://codyphillips5.github.io/cfbpicks/json/users.json", function(json){
    usersList = json;
});

var date1 = new Date();
var date2 = new Date('2020-11-14T17:00Z');

$.when(getPicks, getStandings, getUsers).then(function(){
	var tableStart = `<div class="table-responsive"> <table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col">Name</th><th scope="col">50</th><th scope="col">40</th><th scope="col">30</th><th scope="col">20</th><th scope="col">10</th><th class="warning" scope="col">GOTW</th></tr></thead><tbody>`;

	for (var key in standings) {
		for (var i = 0; i < standings[key].length; i++) {

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
			var tableUser = tableUser + `<tr><th class="first-col">${firstName + " " + lastName}</th>`;
			// check user picks against results
			for (var pointTotals = 50; pointTotals >= 10; pointTotals = pointTotals-10) {
				if (date1.getTime() < date2.getTime() && standings[key][i][pointTotals]) {
					console.log(date1);
					console.log(date2);
					standings[key][i][pointTotals] = "--";
					standings[key][i].POTW = "--";
					standings[key][i].POTW_value = "--";
				}
				tableUser = tableUser + `<td>${standings[key][i][pointTotals]}</td>`;
			}
			tableUser = tableUser + `<td>${standings[key][i].POTW} (${standings[key][i].POTW_value})</td>`;
		}
	}
	tableUser = tableUser.replace("undefined","");
	var tableEnd = `</tbody></table>`;	
	document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
});