var userTotalPoints = [];
var allUsers = [];
var allNames = [];
var allEntries = [];
const entry = {};
var scores = [];
var pointCollection;
var myUsername = "";
var myPoints = "";
var itsme = false;

var weekNum = 1;
var userWeekTop = false;

var users = db.collection("Users").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		allUsers.push(doc.data().Email);
	})
});

var names = db.collection("Users").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		allNames.push(doc.data().FirstName + " " + doc.data().LastName);
	})
});
		
var results = db.collection("Results").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		allEntries.push(doc.data().user);
		scores.push(doc.data());
	})
});	

//document.getElementById("loader").innerHTML = `<button onclick='sortTable(${weekNum + 1});return false;' class='btn btn-primary'>Sort Standings</button>`;

var tableStart = `<div class="table-responsive"><table class="table table-hover" id="standings-table"><thead><tr><th class="first-col bg-light" scope="col">Name</th>`;
for(var wn = 1; wn <= weekNum; wn++) {
	tableStart = tableStart + `<th scope="col" class="bg-light text-center bg-gradient">Week ${wn}</th>`;
}
tableStart = tableStart + `<th scope="col" class="bg-light text-center bg-gradient">Total</th></tr></thead><tbody>`;

$.when(users, results).then(function(){
	var tableUser = "";
	
	for (var loop = 0; loop <= allUsers.length; loop++) {		
		myUsername = "bg-light";
		if(allUsers[loop] === auth.currentUser.email) {
			itsme = true;
			myUsername = "table-primary";
		}
		else {
			itsme = false;
			myUsername = "bg-light";
		}
		
		tableUser = tableUser + `<tr><th class="first-col ${myUsername} bg-gradient">${allNames[loop]}</th>`;
		for(var weekOfYr = 1; weekOfYr <= weekNum; weekOfYr++) {
			// set starters
			var pointTotal = 0;
			var weekTotal = 0;
			var points = 0;
			
			if (scores[loop]["week" + weekOfYr] === undefined) {
				points = 0;
				userWeekTop = false;
			}
			else {
				points = scores[loop]["week" + weekOfYr]["points"];
				userWeekTop = scores[loop]["week" + weekOfYr]["top"];
			}
			userTotalPoints.push(points);
			weekTotal++;
			if (userWeekTop) 
				myPoints = "table-success";
			else if (itsme) 
				myPoints = "table-primary";
			else 
				myPoints = "";
			
			tableUser = tableUser + `<td class="${myPoints} text-center" id="week1">${points}</td>`;
		}
			for(var i=0; i < userTotalPoints.length; i++) {
				pointTotal = pointTotal + userTotalPoints[i];
			}
			tableUser = tableUser + `<td class="${myUsername} first-col text-center">${pointTotal}</td></tr>`;
			
			var tableEnd = `</tbody></table>`;	
			document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;	
			sortTable(weekNum+1);
			while(userTotalPoints.length > 0) {
				userTotalPoints.pop();
			}
		}
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
	if ((rows.length-1) == allUsers.length) {
		document.getElementById("loader").innerHTML = ``;
	}
  }
}
