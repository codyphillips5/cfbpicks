var firtName = "";
var lastName = "";
var coversNum = [];
var coversTeam = [];

var standings, usersList;

var getStandings = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/standings.json", function(json) {
		standings = json;
});
	
var getUsers= $.getJSON("https://codyphillips5.github.io/cfbpicks/json/users.json", function(json) {
		usersList = json;
});

$.when(getStandings, getUsers).then(function(){
	var tableStart = `<div class="table-responsive"> <table class="table table-hover" id="standings-table"><thead><tr><th class="first-col" scope="col">Name</th><th scope="col">Week 1</th><th scope="col">Week 2</th><th scope="col">Week 3</th><th scope="col">Week 4</th><th scope="col">Week 5</th><th scope="col">Week 6</th><th scope="col">Week 7</th><th scope="col">Week 8</th><th scope="col">Week 9</th><th scope="col">Week 10</th><th scope="col">Week 11</th><th scope="col">Week 12</th><th scope="col">Week 13</th><th scope="col">Week 14</th><th scope="col" class="first-col active">Total</th></tr></thead><tbody>`;

	for (var key in standings) {
		for (var i = 0; i < standings[key].length; i++) {
			
			// set starters
			var pointTotal = 0;
			var isTop;
			var weekTotal = 0;

			var user = standings[key][i].userId;

			for (var k in usersList) {
				for (var j = 0; j < usersList[k].length; j++) {
						if (user == usersList[k][j].userId) {
							firstName = usersList[k][j].FirstName;
							lastName = usersList[k][j].LastName;
					}
				}
			}
			var tableUser = tableUser + `<tr><th class="first-col">${firstName + " " + lastName}</th>`;

			for(var stand = 1; stand <= 14; stand++) {
				//tableUser = tableUser + `<td>${standings[key][i]["week_" + stand]}</td>`;
				pointTotal = pointTotal + standings[key][i]["week_" + stand];
				weekTotal++;
				if(standings[key][i]["week_" + stand + "_top"]) {
					tableUser = tableUser + `<td class='success'>${standings[key][i]["week_" + stand]}</td>`;
				}
				else {
					tableUser = tableUser + `<td>${standings[key][i]["week_" + stand]}</td>`;
				}
			}
			//calculate score			
			tableUser =  tableUser + `<td class="first-col active">${pointTotal}</td></tr>`;
		}
	}
	tableUser = tableUser.replace("undefined","");
	var tableEnd = `</tbody></table>`;	
	document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
	sortTable(weekTotal + 1);
});

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("standings-table");
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
