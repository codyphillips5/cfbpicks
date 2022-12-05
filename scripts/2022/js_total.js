var homeTeams = [];
var awayTeams = [];
var coverTeams = [];
var allTeams = [];
var theField = [];
var winners = [];
var large = [];
var autoTeams = 0;
var largeTeams = 0;
var tourneyTeams = 0;
var tourneyGames = 0;
var totalGames = 0;
var percTourney;
var home, away, cover, totalWeek, game;
var games = false;
var tournTeam = ""
var fullNameTeam = "";

var standings, teams, resultsList, usersList;
game = 0;
totalWeek = 5;

for (var i = 1; i <= totalWeek; i++) {
	var getGames = $.getJSON("https://codyphillips5.github.io/cbbpicks/json/games/week" + i + ".json", function(json){
		standings = json;
		
		for (var key in standings) {
			for (var i = 0; i < standings[key].length; i++) {
				if (standings[key][i].cover !== undefined) {
					home = standings[key][i].homeTeam;
					away = standings[key][i].awayTeam;
					cover = standings[key][i].cover;
					homeTeams.push(home);
					awayTeams.push(away);
					coverTeams.push(cover);					
				}
			}
		}
	});
}

var getTeams = $.getJSON("https://codyphillips5.github.io/cbbpicks/json/teams.json", function(json){
	teams = json;
});

var getTourney = $.getJSON("https://codyphillips5.github.io/cbbpicks/json/tournament.json", function(json){
	tourney = json;
	for (var i = 0; i < tourney.auto.length; i++) {
		var object = tourney.auto[i];
		winners.push(object["winner"]);
	}
	
	for (var i = 0; i < tourney.atlarge.length; i++) {
		var object = tourney.atlarge[i];
		large.push(object["team"]);
	}
	theField = winners.concat(large);
});


$.when(getGames, getTeams, getTourney).then(function(){
	game = coverTeams.length - ((totalWeek-1)*10);
	
	if (game < 0) {
		location.reload();
	}
	else {
		if (game == 0) {
			game = 10;
			totalWeek = totalWeek - 1;
		}		
		
		allTeams = homeTeams.concat(awayTeams);
		allTeams = numbers(allTeams);
		coverTeams = numbers(coverTeams);
		
		var tableStart = `<div class="table-responsive"><table class="table table-bordered table-hover" id="results"><thead><tr><th scope="col">Team</th><th scope="col">#</th><th scope="col">W-L</th><th scope="col">Cover %</th></tr></thead><tbody>`;
		
		for (var team in teams) {
			for (var j = 0; j < allTeams[0].length; j++) {
				// set starters
				var guess = allTeams[0][j];
				getFullTeamName(guess);
				/*if (teams[team][j].teamValue == guess) 
					console.log(teams[team][j].team);*/
				
				var color = "";
				var percColor = "";
				switch(allTeams[1][j]) {
					case 9:
					case 7:
					case 5:
					case 3:
					case 1:
						color = "table-light";
						break;
					default:
						color = "";
						break;
						// code block
				}
				
				var wins = 0;
				var losses = 0;
				var perc;
				if (coverTeams[0].includes(allTeams[0][j])) {
					const isSameNumber = (element) => element == allTeams[0][j];
					var spot = coverTeams[0].findIndex(isSameNumber);
					wins = coverTeams[1][spot];
					losses = allTeams[1][j] - wins;	
					//console.log(wins);
				}
				else {
					losses = allTeams[1][j];
				}
				
				perc = (wins / (wins + losses)) * 100;
				if (perc >= 62.0) {
					percColor = "table-success";
				}
				else if (perc < 62.0 && perc >= 40.0) {
					percColor = "table-warning";
				}
				else if (perc < 40.0) {
					percColor = "table-danger";
				}
				else {
					percColor = color;
				}
				
				if (winners.includes(guess)) {
					tournColor = color;
					tournTeam = fullNameTeam;
					tournTeam = tournTeam.toUpperCase();
					tournTeam = tournTeam.bold();
					autoTeams++;
					tourneyGames = tourneyGames + allTeams[1][j];
				}
				else if (large.includes(guess)) {
					tournColor = color;
					tournTeam = fullNameTeam;
					tournTeam = tournTeam.bold();
					largeTeams++;
					tourneyGames = tourneyGames + allTeams[1][j];
				}
				else {
					tournColor = color;
					tournTeam = fullNameTeam;
				}
				tourneyTeams = autoTeams + largeTeams;
				totalGames = totalGames + allTeams[1][j];
				tableStart = tableStart + `<tr><td id="${guess}" class="${tournColor}">${tournTeam}</td><td class="${color}">${allTeams[1][j]}</td><td class="${color}">${wins}-${losses}</td><td class="${percColor}">${perc.toFixed(1)}</td>`;
			}
		}
		
		percTourney = (tourneyGames / totalGames) * 100;
		var tableEnd = `</tbody></table>`;	
		document.getElementById("records").innerHTML = `
			<div class="seasonStats"><dl>
			<dt>Team Records</dt>
			<dd><li>Records reflected through Game ${game} of Week ${totalWeek}.</li></dd></div>
			<div class="marchStats" id="marchStats" style="display:none"><dt>Dancin' Designations</dt>
			<dd><li>Auto qualifiers are listed in <b>bold</b> CAPS.</li></dd>
			<dt>Picks in the Postseason</dt>
			<dd><li>We selected <b>${tourneyTeams}</b> of the ${winners.length + large.length} total tournament teams.</li></dd>
			<dd><li>We selected <b>${autoTeams}</b> of the ${winners.length} auto bids.</li></dd>
			<dd><li>We selected <b>${largeTeams}</b> of the ${large.length} at-large bids.</li></dd>
			<dd><li>A tournament team was offered in <b>${tourneyGames} (${percTourney.toFixed(1)}%)</b> of ${totalGames} options.</li></dd>
			</dl></div>`;
/*			<dd><li>Tournament teams are designated with a blue background.</li></dd> */
		document.getElementById("standings").innerHTML = tableStart + tableEnd;
		sortTable(4);
		sortTable(2);		
	}
});


function numbers(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
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

function getFullTeamName(theTeam) {
	for (var team in teams) {
		for (var n = 0; n < teams[team].length; n++) {
			if (teams[team][n].teamValue == theTeam) 
				fullNameTeam = teams[team][n].team;	
		}
	}
}

function marchMode() {
  // Get the checkbox
  var marchCheckbox = document.getElementById("flexSwitchCheckDefault");
  // Get the output text
  var marchText = document.getElementById("marchStats");

  // If the checkbox is checked, display the output text
  if (marchCheckbox.checked == true){
    marchText.style.display = "block";
	for (let squad of theField) {
		console.log(squad);
		if (allTeams[0].includes(squad)) {
			console.log(squad);
			document.getElementById(squad).className = 'table-info';
		}
	} 
  } else {
    marchText.style.display = "none";
	for (let squad of theField) {
		console.log(squad);
		if (allTeams[0].includes(squad)) {
			console.log(squad);
			document.getElementById(squad).className = '';
		}
	} 
  }
}