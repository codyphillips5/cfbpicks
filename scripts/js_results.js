var game = {
  team: "",
  spread : "",
  pts : "",
  game : "" 
};
var attempt = {
	thisTeam : "",
	thisMascot : "",
	thisTeamAbb : "",
	thisTeamImg : ""
};

var choices = [{teamAbb: "", fullTeam: "", game: "", spread : "", pts : "50"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "40"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "30"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "20"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "10"}];

var firtName = "";
var lastName = "";
var coversNum = [];
var coversTeam = [];

var picksList, teamsList, resultsList, usersList;

var getPicks = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week1_picks.json", function(json){
	picksList = json;
});

var getResults = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week1_results.json", function(json){
	resultsList = json;
	// get results
	for (var result in resultsList) {
		for (var r = 0; r < resultsList[result].length; r++) {
			coversNum.push(resultsList[result][r].cover);
		}
	}
});

var getTeams = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(json){
	teamsList = json;
});

var getUsers= $.getJSON("https://codyphillips5.github.io/cfbpicks/json/users.json", function(json){
    usersList = json;
});

$.when(getResults, getTeams).then(function(){
	for (var cov = 0; cov < coversNum.length; cov++) {
		for (var team in teamsList) {
			for (var t = 0; t < teamsList[team].length; t++) {
				if (coversNum[cov] == teamsList[team][t].teamId) {
					coversTeam.push(teamsList[team][t].teamValue);
				}
			}
		}
	}
});

$.when(getPicks, getResults, getTeams, getUsers).then(function(){
	var tableStart = `<table class="table table-hover" id="results"><thead><tr><th scope="col">Name</th><th scope="col">50</th><th scope="col">40</th><th scope="col">30</th><th scope="col">20</th><th scope="col">10</th><th scope="col">Total</th></tr></thead><tbody>`;

	for (var key in picksList) {
		for (var i = 0; i < picksList[key].length; i++) {
			// set starters
			var pointTotal = 0;
			var isCorrect;

			var user = picksList[key][i].userId;
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
				if(coversTeam.includes(picksList[key][i][pointTotals])) {
					isCorrect = "success";
					pointTotal = pointTotal + pointTotals;
				}
				else {
					isCorrect = "danger";				
				}
				tableUser = tableUser + `<td class="${isCorrect}">${picksList[key][i][pointTotals]}</td>`;
			}
			//calculate score			
			tableUser = tableUser + `<td>${pointTotal}</td></tr>`;
		}
	}
	var tableEnd = `</tbody></table>`;	
	document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
	sortTable(6);
});

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("results");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "desc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n-1];
      y = rows[i + 1].getElementsByTagName("TD")[n-1];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
