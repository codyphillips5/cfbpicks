var firtName = "";
var lastName = "";
var allUsers = [];
var coversNum = [];
var coversTeam = [];
var userPickTeams = [];
var coversArr = [""];
var weekNum = 1;
var isCorrect;
var date1 = new Date();
var itsme = false;

var picksList, teamsList, resultsList, usersList;
var resultsList = [];
var badge = document.createElement('div');
badge.className = 'results';
var select = `<select class='form-control form-select' id='results_by_week' onchange="getResultsByWeek(this.value);"><option value ='1'> Week 1 </option></select>`;
badge.innerHTML = '<form>' + select + '</form>';		
document.getElementById("weeks").appendChild(badge);

// query for all user emails
var users = db.collection("Users").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		allUsers.push(doc.data().Email);
	})
});

// build top header section of table
var tableStart = `<div class="table-responsive"><table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col bg-light bg-gradient">Name</th><th scope="col" class="text-center">50</th><th scope="col" class="text-center">40</th><th scope="col" class="text-center">30</th><th scope="col" class="text-center">20</th><th scope="col" class="text-center">10</th><th scope="col" class="bg-light bg-gradient text-center">Total</th></tr></thead><tbody>`;

// get results
var getResults = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + weekNum + "_results.json", function(json){
	resultsList = json;
});

$.when(users).then(function(){
	var covers = Object.values(resultsList["results"]);
	var coversArr = Array.from(covers);
	//getResultsByWeek(weekNum);
	var tableUser = "";
	for (var loop = 0; loop < allUsers.length; loop++) {	
		var names = db.collection('Users').doc(allUsers[loop]);
		names.get()
		.then((docSnapshot) => {
			if (docSnapshot.data())
				if (auth.currentUser.email === docSnapshot.data().Email) {
					itsme = true;
				}
				tableUser = tableUser + `<tr><th class="first-col bg-light bg-gradient">${docSnapshot.data().FirstName + " " + docSnapshot.data().LastName}</th>`;
		})
		
		// most recent week
		var pointCollection = db.collection('week' + weekNum).doc(allUsers[loop]);
		pointCollection.get()
		.then((docSnapshot) => {
			if (docSnapshot.data()) {
				console.log( "me : " +itsme);
				if(itsme) {
					userPickTeams.push(docSnapshot.data().Ten);
					userPickTeams.push(docSnapshot.data().Twenty);
					userPickTeams.push(docSnapshot.data().Thirty);
					userPickTeams.push(docSnapshot.data().Forty);
					userPickTeams.push(docSnapshot.data().Fifty);
				}
				else if (date1.getDay() != 6 && date1.getHours() < 12) {
					userPickTeams.push("--");
					userPickTeams.push("--");
					userPickTeams.push("--");
					userPickTeams.push("--");
					userPickTeams.push("--");
				}
				else {
					userPickTeams.push(docSnapshot.data().Ten);
					userPickTeams.push(docSnapshot.data().Twenty);
					userPickTeams.push(docSnapshot.data().Thirty);
					userPickTeams.push(docSnapshot.data().Forty);
					userPickTeams.push(docSnapshot.data().Fifty);
				}
			}
			else {
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
			}
			// set starters
			var points = 0;
			var pointTotal = 0;
			itsme = false;
			/*if (docSnapshot.data()) {
				points = docSnapshot.data().Points;
				userWeekTop = docSnapshot.data().Top;
			}
			else {
				points = 0;
				userWeekTop = false;
			}
			//userTotalPoints.push(points);
			for(var i=0; i < userTotalPoints.length; i++) {
				pointTotal = pointTotal + userTotalPoints[i];
			}
			if (userWeekTop) 
				tableUser = tableUser + `<td class='table-success text-center'>${points}</td>`;
			else 
				tableUser = tableUser + `<td class="text-center">${points}</td>`;
			*/	
			for (var up = 4; up >= 0; up--) {
				if (date1.getDay() == 1 && date1.getHours() >= 3) {
					if (coversArr.includes(userPickTeams[up])) {
						isCorrect = "success";
						pointTotals = (up + 1) * 10;
						pointTotal = pointTotal + pointTotals;
					}
					else {
						isCorrect = "danger";			
						console.log(coversArr + " does not contain " + userPickTeams[up]);
					}	
				}
				tableUser = tableUser + `<td class="table-${isCorrect} text-center" id="rockyTop">${userPickTeams[up]}</td>`;
			}
			tableUser = tableUser + `<td class="bg-light first-col text-center">${pointTotal}</td></tr>`;
			var tableEnd = `</tbody></table>`;	
			document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;	
			while(userPickTeams.length > 0) {
				userPickTeams.pop();
			}
			sortTable(6);		
		})
	}	
});	
/*
function getResultsByWeek(week) {

	
	var getPicks = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week"+ week +"_picks.json", function(json){
		picksList = json;
	});
	
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
		for (var key in picksList) {
			for (var i = 0; i < picksList[key].length; i++) {
				// set starters
				var pointTotal = 0;
	
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
				var tableUser = tableUser + `<tr><th class="first-col bg-light bg-gradient">${firstName + " " + lastName}</th>`;
				// check user picks against results
				for (var pointTotals = 50; pointTotals >= 10; pointTotals = pointTotals-10) {
					if(coversTeam.includes(picksList[key][i][pointTotals])) {
						isCorrect = "success";
						pointTotal = pointTotal + pointTotals;
					}
					else {
						isCorrect = "danger";				
					}
					tableUser = tableUser + `<td class="table-${isCorrect} text-center">${picksList[key][i][pointTotals]}</td>`;
				}
				//calculate score			
				tableUser = tableUser + `<td class="bg-light bg-gradient text-center">${pointTotal}</td></tr>`;
			}
		}
		var tableEnd = `</tbody></table>`;	
		document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;
		sortTable(6);
	});
}
*/
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
