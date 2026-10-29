var firtName = "";
var lastName = "";
var weekList = "";
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
var weekNum = 9;
var isCorrect;
var isMe;
var date1 = new Date();
var date2;
var date3;
var days = 1;
var itsme = false;
var check = "";
var myUsername = "";
var resultsRequest = 0;

var picksList, teamsList, resultsList, usersList;
var resultsList = [];
//document.getElementById("loader").innerHTML = `<button onclick='sortTable(6);return false;' class='btn btn-primary'>Sort Results</button>`;
var badge = document.createElement('div');
badge.className = 'results';

for (var y = weekNum; y >= 1; y--) {
	weekList = weekList + `<li class=""><a class="dropdown-item" href="#" onclick='return getResultsByWeek(${y})' id="dd-week-${y}"></span>Week ${y}</a></li>`;
}

var select = `
 <a class="btn btn-secondary dropdown-toggle" href="#" id="desktop_buttons" role="button" data-bs-toggle="dropdown" aria-expanded="false">Previous</a>
<ul class="dropdown-menu" aria-labelledby="desktop_buttons">${weekList}</ul>
<a class="btn btn-secondary dropdown-toggle" href="#" id="mobile_buttons" role="button" data-bs-toggle="dropdown" aria-expanded="false">Previous</a>
<ul class="dropdown-menu" aria-labelledby="mobile_buttons">${weekList}</ul>
<span id="go"></span>`

badge.innerHTML = '<form>' + select + '</form>';		
document.getElementById("weeks").appendChild(badge);

getResultsByWeek(weekNum)

function loadJson(url) {
	return new Promise(function(resolve, reject) {
		$.getJSON(url).done(resolve).fail(reject);
	});
}

function getResultsByWeek(x) {
	var requestId = ++resultsRequest;
	var tableStart = "";
	var tableUser = "";
	var tableEnd = "";
	var userEmails = [];
	var userFirst = [];
	var userLast = [];
	var entries = [];
	var fifties = [];
	var forties = [];
	var thirties = [];
	var twenties = [];
	var tens = [];

	document.getElementById("week-title").innerHTML = `<div class="h2">Week ${x} Results</div>`;
	document.getElementById("standings").innerHTML = "";

	var gamesPromise = loadJson("https://codyphillips5.github.io/cfbpicks/json/games/week" + x + ".json");
	var resultsPromise = loadJson("https://codyphillips5.github.io/cfbpicks/json/games/week" + x + "_results.json");

	// query for all user emails and names
	var usersPromise = db.collection("Users").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			userEmails.push(doc.data().Email);
			userFirst.push(doc.data().FirstName);
			userLast.push(doc.data().LastName);
		})
	});

	// build top header section of table
	tableStart = `<div class="table-responsive"><table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col bg-light bg-gradient">Name</th><th scope="col" class="text-center">50</th><th scope="col" class="text-center">40</th><th scope="col" class="text-center">30</th><th scope="col" class="text-center">20</th><th scope="col" class="text-center">10</th><th scope="col" class="bg-light bg-gradient text-center">Total</th></tr></thead><tbody>`;

	// query for all user picks for the current week
	var picksPromise = db.collection("week" + x).get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			entries.push(doc.data().user);
			fifties.push(doc.data().Fifty);
			forties.push(doc.data().Forty);
			thirties.push(doc.data().Thirty);
			twenties.push(doc.data().Twenty);
			tens.push(doc.data().Ten);
		})
	});

	Promise.all([gamesPromise, resultsPromise, usersPromise, picksPromise]).then(function(loaded) {
		if (requestId !== resultsRequest) {
			return;
		}
		var gamesFile = loaded[0];
		var weekResults = loaded[1];
		var covers = Object.values(weekResults["results"]);
		var coversArr = Array.from(covers);
		date2 = new Date(gamesFile["games"][0].gameTime);
		date3 = new Date(date2);
		date3.setDate(date3.getDate() + days);

		for (var loop = 0; loop < userEmails.length; loop++) {
			if (entries.includes(userEmails[loop])) {
				for (var testLoop = 0; testLoop < entries.length; testLoop++) {
					myUsername = "bg-light";
					if (userEmails[loop] === entries[testLoop]) {
						if(userEmails[loop] === auth.currentUser.email) {
							itsme = true;
							console.log(auth.currentUser.email);
							userPickTeams.push(tens[testLoop]);
							userPickTeams.push(twenties[testLoop]);
							userPickTeams.push(thirties[testLoop]);
							userPickTeams.push(forties[testLoop]);
							userPickTeams.push(fifties[testLoop]);
							isCorrect = "primary";
							myUsername = "table-primary";
						}
						else if (date1 >= date2) {
							myUsername = "bg-light";
							userPickTeams.push(tens[testLoop]);
							userPickTeams.push(twenties[testLoop]);
							userPickTeams.push(thirties[testLoop]);
							userPickTeams.push(forties[testLoop]);
							userPickTeams.push(fifties[testLoop]);
						}
						else {
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
							userPickTeams.push("🔒");
						}
						tableUser = tableUser + `<tr><th class="first-col ${myUsername} bg-gradient">${userFirst[loop] + " " +userLast[loop]}</th>`;
					}
				}
			}
			else {
				tableUser = tableUser + `<tr><th class="first-col bg-light bg-gradient">${userFirst[loop] + " " +userLast[loop]}</th>`;
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
		sortTable(6);
		document.getElementById("loader").innerHTML = ``;
	});
	return false;
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
