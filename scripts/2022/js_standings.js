var userTotalPoints = [];
var allUsers = [];
var pointCollection;

var weekNum = 6;
var userWeekTop = false;

var users = db.collection("Users").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		allUsers.push(doc.data().Email);
	})
});

document.getElementById("loader").innerHTML = `<button onclick='sortTable(${weekNum + 1});return false;' class='btn btn-primary'>Sort Standings</button>`;

var tableStart = `<div class="table-responsive"><table class="table table-hover" id="standings-table"><thead><tr><th class="first-col bg-light" scope="col">Name</th>`;
for(var wn = 1; wn <= weekNum; wn++) {
	tableStart = tableStart + `<th scope="col" class="bg-light text-center bg-gradient">Week ${wn}</th>`;
}
tableStart = tableStart + `<th scope="col" class="bg-light text-center bg-gradient">Total</th></tr></thead><tbody>`;
	
$.when(users).then(function(){
	var tableUser = "";
	for (var loop = 0; loop < allUsers.length; loop++) {		
		var names = db.collection('Users').doc(allUsers[loop]);
		names.get()
		.then((docSnapshot) => {
			if (docSnapshot.data())
				tableUser = tableUser + `<tr><th class="first-col bg-light bg-gradient">${docSnapshot.data().FirstName + " " + docSnapshot.data().LastName}</th>`;
		})		
		
		// all other weeks
		
		for(var weekOfYr = 1; weekOfYr < weekNum; weekOfYr++) {
			var pointCollection = db.collection('Users').doc(allUsers[loop] + "/2022/Week" + weekOfYr);
			pointCollection.get()
				.then((docSnapshot) => {
					// set starters
					var pointTotal = 0;
					var weekTotal = 0;
					var points = 0;
					
					if (docSnapshot.data()) {
						points = docSnapshot.data().Points;
						userWeekTop = docSnapshot.data().Top;
					}
					else {
						points = 0;
						userWeekTop = false;
					}
					userTotalPoints.push(points);
					pointTotal = pointTotal + points;
					weekTotal++;
					if (userWeekTop) 
						tableUser = tableUser + `<td class='table-success text-center' id='week1'>${points}</td>`;
					else 
						tableUser = tableUser + `<td class="text-center" id="week1">${points}</td>`;
				});	
		}
		
		// most recent week
		var pointCollection = db.collection('Users').doc(allUsers[loop] + "/2022/Week" + weekNum);
			pointCollection.get()
				.then((docSnapshot) => {
					// set starters
					var points = 0;
					var pointTotal = 0;
					if (docSnapshot.data()) {
						points = docSnapshot.data().Points;
						userWeekTop = docSnapshot.data().Top;
					}
					else {
						points = 0;
						userWeekTop = false;
					}
					if (userWeekTop) 
						tableUser = tableUser + `<td class='table-success text-center' id='week${weekNum}'>${points}</td>`;
					else 
						tableUser = tableUser + `<td class="text-center" id='week${weekNum}'>${points}</td>`;
					
						userTotalPoints.push(points);
						console.log(userTotalPoints);
						for(var i=0; i < userTotalPoints.length; i++) {
							pointTotal = pointTotal + userTotalPoints[i];
						}
						tableUser = tableUser + `<td class="bg-light first-col text-center">${pointTotal}</td></tr>`;
						
					var tableEnd = `</tbody></table>`;	
					document.getElementById("standings").innerHTML = tableStart + tableUser + tableEnd;	
					while(userTotalPoints.length > 0) {
						userTotalPoints.pop();
					}
				//sortTable(weekNum + 1);
			});
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
	document.getElementById("loader").innerHTML = `<img src='https://clipartix.com/wp-content/uploads/2018/03/thinking-gif-2018-1.gif'><br><img src='https://raw.githubusercontent.com/codyphillips5/cfbpicks/master/sort.gif'>`;
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
