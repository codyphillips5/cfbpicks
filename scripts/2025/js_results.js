var firtName = "";
var lastName = "";
var allEntries = [];
var allFifties = [];
var allForties = [];
var allThirties = [];
var allTwenties = [];
var allTens = [];
var allUsers = [];
var allFirst = [];
var allLast = [];
var storeUsers = [];
var coversNum = [];
var coversTeam = [];
var userPickTeams = [];
var coversArr = [""];
var weekNum = 1;
var isCorrect;
var isMe;
var date1 = new Date();
var date2;
var date3;
var days = 1;
var itsme = false;
var check = "";
var myUsername = "";

var picksList, teamsList, resultsList, usersList;
var resultsList = [];
document.getElementById("loader").innerHTML = `<button onclick='sortTable(6);return false;' class='btn btn-primary'>Sort Results</button>`;
var badge = document.createElement('div');
badge.className = 'results';

// future weeks 
/*
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(13);return false;' id =""></span>Week 13</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(12);return false;' id =""></span>Week 12</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(11);return false;' id =""></span>Week 11</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(10);return false;' id =""></span>Week 10</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(9);return false;' id =""></span>Week 9</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(8);return false;' id =""></span>Week 8</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(7);return false;' id =""></span>Week 7</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(6);return false;' id =""></span>Week 6</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(5);return false;' id =""></span>Week 5</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(4);return false;' id =""></span>Week 4</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(3);return false;' id =""></span>Week 3</a></li>
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(2);return false;' id =""></span>Week 2</a></li>
*/

var select = `
 <a class="btn btn-secondary dropdown-toggle" href="#" id="desktop_buttons" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      Previous
  </a>
	<ul class="dropdown-menu" aria-labelledby="desktop_buttons">

		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(1);return false;' id =""></span>Week 1</a></li>
	</ul>
 <a class="btn btn-secondary dropdown-toggle" href="#" id="mobile_buttons" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      Previous
  </a>
    <ul class="dropdown-menu" aria-labelledby="mobile_buttons">
		<li class=""><a class="dropdown-item" href="#"  onclick='getResultsByWeek(1);return false;' id =""></span>Week 1</a></li>
     </ul>`;

badge.innerHTML = '<form>' + select + '</form>';		
document.getElementById("weeks").appendChild(badge);

getResultsByWeek(weekNum)

function getResultsByWeek(x) {
	
	var tableStart = "";
	var tableUser = "";
	var tableEnd = "";
	
	var requestX = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + x + ".json", function(json){
		xFile = json;
	});

	$.when(requestX).then(function(){
		date2 = new Date(xFile["games"][0].gameTime);
	});

	// query for all user emails and names
	var users = db.collection("Users").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			allUsers.push(doc.data().Email);
			allFirst.push(doc.data().FirstName);
			allLast.push(doc.data().LastName);
		})
	});
	
	// build top header section of table
	tableStart = `<div class="table-responsive"><table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col bg-light bg-gradient">Name</th><th scope="col" class="text-center">50</th><th scope="col" class="text-center">40</th><th scope="col" class="text-center">30</th><th scope="col" class="text-center">20</th><th scope="col" class="text-center">10</th><th scope="col" class="bg-light bg-gradient text-center">Total</th></tr></thead><tbody>`;

	// get results
	var getResults = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + x + "_results.json", function(json){
		resultsList = json;
	});	

	// query for all user picks for the current week
	var names = db.collection("week" + x).get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			allEntries.push(doc.data().user);
			allFifties.push(doc.data().Fifty);
			allForties.push(doc.data().Forty);
			allThirties.push(doc.data().Thirty);
			allTwenties.push(doc.data().Twenty);
			allTens.push(doc.data().Ten);
		})
	});
	
	$.when(users, names, requestX, getResults).then(function(){
		var covers = Object.values(resultsList["results"]);
		var coversArr = Array.from(covers);
		
		date3 = new Date(date2);
		date3.setDate(date3.getDate() + days);	
		
		for (var loop = 0; loop < allUsers.length; loop++) {
			if (allEntries.includes(allUsers[loop])) {
				for (var testLoop = 0; testLoop < allEntries.length; testLoop++) {
					myUsername = "bg-light";
					if (allUsers[loop] === allEntries[testLoop]) {
						if(allUsers[loop] === auth.currentUser.email) {
							itsme = true;
							console.log(auth.currentUser.email);
							userPickTeams.push(allTens[testLoop]);
							userPickTeams.push(allTwenties[testLoop]);
							userPickTeams.push(allThirties[testLoop]);
							userPickTeams.push(allForties[testLoop]);
							userPickTeams.push(allFifties[testLoop]);
							isCorrect = "primary";
							myUsername = "table-primary";
						}
						else if (date1 >= date2) {
							myUsername = "bg-light";
							userPickTeams.push(allTens[testLoop]);
							userPickTeams.push(allTwenties[testLoop]);
							userPickTeams.push(allThirties[testLoop]);
							userPickTeams.push(allForties[testLoop]);
							userPickTeams.push(allFifties[testLoop]);
						}
						else {
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
						}
						tableUser = tableUser + `<tr><th class="first-col ${myUsername} bg-gradient">${allFirst[loop] + " " +allLast[loop]}</th>`;
					}
				}
			}
			else {
				tableUser = tableUser + `<tr><th class="first-col bg-light bg-gradient">${allFirst[loop] + " " +allLast[loop]}</th>`;
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
				userPickTeams.push(" ");
			}
				// set starters
				var points = 0;
				var pointTotal = 0;
				
				for (var up = 4; up >= 0; up--) {
					if (date3 <= date1) {
						if (coversArr.includes(userPickTeams[up])) {
							isCorrect = "success";
							check = "✅";
							pointTotals = (up + 1) * 10;
							pointTotal = pointTotal + pointTotals;
						}
						else {
							isCorrect = "danger";			
							check = "❌";
						}	
					}
					tableUser = tableUser + `<td class="table-${isCorrect} text-center" id="rockyTop">${userPickTeams[up]} ${check}</td>`;
				}
				if (itsme)
					myUsername = "table-primary";
				else 
					myUsername = "bg-light";
				tableUser = tableUser + `<td class="${myUsername} first-col text-center">${pointTotal}</td></tr>`;
				tableEnd = `</tbody></table>`;
				document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;	
				
				// reset
				while(userPickTeams.length > 0) {
					userPickTeams.pop();
				}
				itsme = false;
				isCorrect = "";
				check = "";

		}
		storeUsers = allUsers;
		while(allUsers.length > 0) {
					allUsers.pop();
					//allEntries.pop();
					//userPickTeams.pop();
		}
		sortTable(6);
		clearAll();
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
	console.log("rows: " + rows.length);
	console.log("users: " + allUsers.length);
	if ((rows.length-1) == allUsers.length || allUsers.length == 0) {
		document.getElementById("loader").innerHTML = ``;
	}
  }
}

function clearAll() {
	firtName = "";
	lastName = "";
	allEntries = [];
	allFifties = [];
	allForties = [];
	allThirties = [];
	allTwenties = [];
	allTens = [];
	allUsers = [];
	allFirst = [];
	allLast = [];
	storeUsers = [];
	coversNum = [];
	coversTeam = [];
	userPickTeams = [];
	coversArr = [""];
}
