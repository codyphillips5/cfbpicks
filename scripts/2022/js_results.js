var firtName = "";
var lastName = "";
var allUsers = [];
var coversNum = [];
var coversTeam = [];
var userPickTeams = [];
var coversArr = [""];
var weekNum = 14;
var isCorrect;
var isMe;
var date1 = new Date();
var date2;
var date3;
var days = 1;
var itsme = false;
var check = "";

var picksList, teamsList, resultsList, usersList;
var resultsList = [];
var badge = document.createElement('div');
badge.className = 'results';
var select = `<select class='form-control form-select' id='results_by_week' onchange="getResultsByWeek(this.value);">`;
/*for (var theWeekOfTheYear = weekNum; theWeekOfTheYear <= 1; theWeekOfTheYear++) {
	select = select + `<option vale = '${theWeekOfTheYear}'> Week ${theWeekOfTheYear} </option>`;
}*/

select = select + `<option value ='14'> Champ Week </option><option value ='13'> Week 13 </option><option value ='12'> Week 12 </option><option value ='11'> Week 11 </option><option value ='10'> Week 10 </option><option value ='9'> Week 9 </option><option value ='8'> Week 8 </option><option value ='7'> Week 7 </option><option value ='6'> Week 6 </option><option value ='5'> Week 5 </option><option value ='4'> Week 4 </option><option value ='3'> Week 3 </option><option value ='2'> Week 2 </option><option value ='1'> Week 1 </option>`;
select = select + `</select>`;
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

	// query for all user emails
	var users = db.collection("Users").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			allUsers.push(doc.data().Email);
		})
	});

	// build top header section of table
	tableStart = `<div class="table-responsive"><table class="table table-hover" id="results"><thead><tr><th scope="col" class="first-col bg-light bg-gradient">Name</th><th scope="col" class="text-center">50</th><th scope="col" class="text-center">40</th><th scope="col" class="text-center">30</th><th scope="col" class="text-center">20</th><th scope="col" class="text-center">10</th><th scope="col" class="bg-light bg-gradient text-center">Total</th></tr></thead><tbody>`;

	// get results
	var getResults = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + x + "_results.json", function(json){
		resultsList = json;
	});
	$.when(users, requestX, getResults).then(function(){
		var covers = Object.values(resultsList["results"]);
		var coversArr = Array.from(covers);
		
		date3 = new Date(date2);
		date3.setDate(date3.getDate() + days);
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
			var pointCollection = db.collection('week' + x).doc(allUsers[loop]);
			pointCollection.get()
			.then((docSnapshot) => {
				if (docSnapshot.data()) {
					if(itsme) {
						userPickTeams.push(docSnapshot.data().Ten);
						userPickTeams.push(docSnapshot.data().Twenty);
						userPickTeams.push(docSnapshot.data().Thirty);
						userPickTeams.push(docSnapshot.data().Forty);
						userPickTeams.push(docSnapshot.data().Fifty);
						isCorrect = "primary";
					}
					else if (date1 >= date2) {
						userPickTeams.push(docSnapshot.data().Ten);
						userPickTeams.push(docSnapshot.data().Twenty);
						userPickTeams.push(docSnapshot.data().Thirty);
						userPickTeams.push(docSnapshot.data().Forty);
						userPickTeams.push(docSnapshot.data().Fifty);
					}
					else {
						userPickTeams.push("--");
						userPickTeams.push("--");
						userPickTeams.push("--");
						userPickTeams.push("--");
						userPickTeams.push("--");
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
				tableUser = tableUser + `<td class="bg-light first-col text-center">${pointTotal}</td></tr>`;
				tableEnd = `</tbody></table>`;
				document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;	
				
				// reset
				while(userPickTeams.length > 0) {
					userPickTeams.pop();
				}
				itsme = false;
				isCorrect = "";
				check = "";
				// sort results
				sortTable(6);		
			})
		}
		while(allUsers.length > 0) {
					allUsers.pop();
		}
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