var firtName = "";
var lastName = "";
var coversNum = [];
var coversTeam = [];

var picksList, teamsList, resultsList, usersList;
var resultsList = [];
var badge = document.createElement('div');
badge.className = 'results';
var select = `<select class='form-control form-select' id='results_by_week' onchange="getResultsByWeek(this.value);"><option value ='14'> Week 14 </option><option value ='13'> Week 13 </option><option value ='12'> Week 12 </option><option value ='11'> Week 11 </option><option value ='10'> Week 10 </option><option value ='9'> Week 9 </option><option value ='8'> Week 8 </option><option value ='7'> Week 7 </option><option value ='6'> Week 6 </option><option value ='5'> Week 5 </option><option value ='4'> Week 4 </option><option value ='3'> Week 3 </option><option value ='2'> Week 2 </option><option value ='1'> Week 1 </option></select>`;
badge.innerHTML = '<form>' + select + '</form>';		
document.getElementById("weeks").appendChild(badge);

getResultsByWeek(14);

function getResultsByWeek(week) {
	console.log(week);
	var getPicks = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week"+ week +"_picks.json", function(json){
		picksList = json;
	});
	
	var getResults = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + week + "_results.json", function(json){
		resultsList = json;
		// get results
		for (var result in resultsList) {
			// reset covers
			coversNum.length = 0;
			coversTeam.length = 0;
			for (var r = 0; r < resultsList[result].length; r++) {
				coversNum.push(resultsList[result][r].cover);
				console.log(resultsList[result][r].cover);
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
		var tableStart = `<div class="table-responsive"><table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col">Name</th><th scope="col">50</th><th scope="col">40</th><th scope="col">30</th><th scope="col">20</th><th scope="col">10</th><th scope="col" class="table-secondary">Total</th></tr></thead><tbody>`;
	
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
				var tableUser = tableUser + `<tr><th class="first-col">${firstName + " " + lastName}</th>`;
				// check user picks against results
				for (var pointTotals = 50; pointTotals >= 10; pointTotals = pointTotals-10) {
					if(coversTeam.includes(picksList[key][i][pointTotals])) {
						isCorrect = "success";
						pointTotal = pointTotal + pointTotals;
					}
					else {
						isCorrect = "danger";				
					}
					tableUser = tableUser + `<td class="table-${isCorrect}">${picksList[key][i][pointTotals]}</td>`;
				}
				//calculate score			
				tableUser = tableUser + `<td class="table-secondary">${pointTotal}</td></tr>`;
			}
		}
		tableUser = tableUser.replace("undefined","");
		var tableEnd = `</tbody></table>`;	
		document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
		sortTable(6);
	});
}

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
