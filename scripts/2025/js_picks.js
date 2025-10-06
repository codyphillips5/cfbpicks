var game = {
	team: "",
	spread : "",
	pts : "",
	game : "",
	timegame : ""
  };
  var attempt = {
	  thisTeam : "",
	  thisMascot : "",
	  thisTeamAbb : "",
	  thisTeamImg : ""
  };
  
// week of year, first game
var week = 7;
if (week === 0) {
	document.getElementById("week-title").innerHTML = `<div class="alert alert-danger" role="alert"><p class="alert-heading h4">🚨WEEK 0 TESTING🚨</p>
	<hr><p>This is a test of the system for <strong>Week 0</strong>.</p><p>Return for <strong> Week 1 </strong> - <strong>opening August 28<sup>th</sup></strong> - for pick submission and the start of the season!</p></div>`;
}
else if (week === 15) {
	document.getElementById("week-title").innerHTML = `<div class="h3" style="background-color:orange;">Thanks for a great season</div><div class="h2">Enjoy the Playoff!</div>`;
}
else {
	document.getElementById("week-title").innerHTML = `<h2>Week ${week}</h2>`;
}
  
  var choices = [{teamAbb: "", fullTeam: "", game: "", timegame: "", spread : "", pts : "50"}, {teamAbb: "", fullTeam: "", game: "", timegame: "", spread : "", pts : "40"}, {teamAbb: "", fullTeam: "", game: "", timegame: "", spread : "", pts : "30"}, {teamAbb: "", fullTeam: "", game: "", timegame: "", spread : "", pts : "20"}, {teamAbb: "", fullTeam: "", game: "", timegame: "", spread : "", pts : "10"}];
  
  var gameId = "";
  var home = "";
  var homeTeam = "";
  var homeTeamVal = "";
  var homeTeamMascot = "";
  var homeTeamImage = "";
  var away = "";
  var awayTeam = "";
  var awayTeamVal = "";
  var spread = "";
  var fav ="";
  var homeSide = "";
  var awaySide = "";
  var required = "";
  var num = 0;
  var requiredMatch = [];
  
	var xFile, yFile;
  
	var requestX = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week" + week + ".json", function(json){
		xFile = json;
	});
  
	var requestY = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(json){
		yFile = json;
	});
  
	var date1 = new Date();
  
  $.when(requestX, requestY).then(function(){
	  for (var key in xFile) {
		  for (var i = 0; i < xFile[key].length; i++) {
			  var gameId = xFile[key][i].gameId;
			  // set home team values
			  var home = xFile[key][i].homeTeam;
			  for (var k in yFile) {
				  for (var j = 0; j < yFile[k].length; j++) {
					  if(home == yFile[k][j].teamValue) {
						  homeTeam = yFile[k][j].team;
						  homeTeamVal = yFile[k][j].teamValue;
						  homeTeamMascot = yFile[k][j].teamMascot;
						  homeTeamImage = yFile[k][j].teamImage;
					  }
				  }
			  }
			  // set away team values 
			  var away = xFile[key][i].awayTeam;
			  for (var k in yFile) {
				  for (var j = 0; j < yFile[k].length; j++) {
					  if(away == yFile[k][j].teamValue) {
						  awayTeam = yFile[k][j].team;
						  awayTeamVal = yFile[k][j].teamValue;
						  awayTeamMascot = yFile[k][j].teamMascot;
						  awayTeamImage = yFile[k][j].teamImage;
					  }
				  }
			  }
			  var spread = xFile[key][i].spread;
			  var fav = xFile[key][i].favorite;
			  var homeSide = "-";
			  var awaySide = "+";
			  var channel = xFile[key][i].channel;
			  var date = new Date(xFile[key][i].gameTime);
			  var date2 = new Date(xFile[key][0].gameTime);
			  var required = xFile[key][i].required;
			  var badge = document.createElement('div');
			  var col = document.createElement('div');
			  var number = num + 1; 
			  col.className = 'col mt-2 mb-2';
			  col.id = 'col' + number;
			  var isRequired = false;
			  var requiredField = "";

			  if (fav != home) {
				  homeSide = "+";
				  awaySide = "-";		
			  }
			  if (spread == 0) {
				  homeSide = "";
				  awaySide = "";
				  spread = "PK";
			  }
			  if (required) {
				  requiredField = 'bg-warning bg-gradient';
				  isRequired = true;
				  requiredMatch.push(awayTeamVal);
				  requiredMatch.push(homeTeamVal);
			  }
			  else {
				  requiredField = 'bg-light';		
			  }
			  var header = '<div class=\'p-3 border '+ requiredField +'\'><span class=\'header\'><div class=\'h5 pt-2 lh-1\' style=\'margin-bottom: 0px;\'>' + awayTeam + ' vs ' + homeTeam + ' (' + homeSide + spread + ') </div>';
			  var gameInfo = '<small class=\'w-100\' id=\'time-game' + gameId + '\' > '+ channel + " · " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0+/, '') + '</small>';
			  var select = '<select class=\'teamlist form-select form-select-sm\' style=\'width:auto;\' id=\'game' + gameId + '\' onchange=\"showPointTotals(\'point_totals_game_' + gameId + '\', this);\"><option value = \"\"> -- Select Team -- </option><option value=\"' + awayTeamVal + '\">' + awayTeam + ' ' + awaySide + spread + '</option><option value=\"' + homeTeamVal + '\">' + homeTeam + ' ' + homeSide + spread + '</option></select>';
			  var display = '<div class=\'pt-3 lh-1\' id=\"point_totals_game_' + gameId + '\" style=\"display:none;\">';
			  var numbers = [5, 4, 3, 2, 1];
			  var radios = [];
			  for (var j = 0; j < numbers.length; j++) {
				  if (required) {
					  var radio = '<label class="radio-inline font-weight-bold px-3"><input class="form-check-input" type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +', '+ isRequired +');\" name=\"pick_worth\" value=' + numbers[j] + '0 required> <br>' + numbers[j] + '0</label>'
				  } 
				  else {
					  var radio = '<label class="radio-inline font-weight-bold px-3"><input class="form-check-input" type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0> <br>' + numbers[j] + '0</label>'
				  }
				  radios.push(radio);
			  }
			  badge.innerHTML = '<form>' + header + gameInfo + select + display + radios.join(' ') + '</form></div>';		
			  document.getElementById(key).appendChild(col);
			  document.getElementById("col" + number).appendChild(badge);
			  num = number;
		  }
	  }
	  
	  	// if current time is after start time of first game, lock
		if (date1.getTime() > date2.getTime()) {
			document.getElementById("saver").innerHTML = `<button type="submit" disabled id="savePicks" class='btn btn-primary'>Picks Locked</button>`;
		}
		else {
			if (date1.getDay() < 4) {
				document.getElementById("saver").innerHTML = `<button type="submit" disabled id="savePicks" class='btn btn-primary'>Picks Open Thursday</button>`;	
			}
			else {
				// if day is Thursday before noon, picks open soon
				if (date1.getDay() == 4 && date1.getHours() < 12) {
					document.getElementById("saver").innerHTML = `<button type="submit" disabled id="savePicks" class='btn btn-primary'>Picks Open Soon</button>`;
				}
				// else picks are open
				else {
					document.getElementById("saver").innerHTML = `<button type="submit" id="savePicks" class='btn btn-primary'>Save My Picks</button>`;
				}
			}
		}
  });
  
  var request;
  
  function assignPointsByTeam(pts, id, req) {
	  var pick = document.getElementById("game" + id);
	  console.log(pick.selectedIndex);
	  var userPick = pick.options[pick.selectedIndex].value;
	  var timeofgame = document.getElementById("time-game" + id).innerText;
	  var fullTeamName = pick.options[pick.selectedIndex].text;
	  fullTeamSpread = fullTeamName.replace(/[^\d+.-]/g, '');
	  game.team = userPick;
	  game.spread = attempt.thisTeamImg;
	  if (req == true) {
		document.getElementById(pts + "-point-maker").className = "p-2 border bg-warning bg-gradient gotw";
	  }
	  document.getElementById(pts).value = game.team;
	  document.getElementById("label-choice-" + pts).innerHTML = `<label for="${pts}" class="choice">${game.team} ${fullTeamSpread}</label>`;
	  getTeamInfo(userPick);
	  request.success(function(response){
		  for (i = 0; i < choices.length; i++) {
			  // only allow a team to be chosen once
			  if (game.team == choices[i].teamAbb) {
				  choices[i].teamAbb = "";
				  choices[i].fullTeam = "";
				  choices[i].game = "";
				  choices[i].timegame = "";
				  choices[i].spread = "";
				  document.getElementById(choices[i].pts + "-point-maker").className = "p-2 border bg-light";
				  document.getElementById(choices[i].pts).value = "";
				  document.getElementById("label-choice-" + choices[i].pts).innerHTML = `<label for="${choices[i].pts}" class="choice"></label>`;
				  document.getElementById("image" + choices[i].pts).innerHTML = ``;
				  document.getElementById("time" + choices[i].pts).innerHTML = ``;
			  }
			  if (pts == choices[i].pts) {
				  if(choices[i].teamAbb != "") {
					  console.log("game.game = " + game.game);
					  if (req == true) {
						document.getElementById(pts + "-point-maker").className = "p-2 border bg-warning bg-gradient gotw";
					}
					else {
						document.getElementById(pts + "-point-maker").className = "p-2 border bg-light";
					}
						  if(choices[i].game != game.game) {
						  var inputs = document.getElementById("point_totals_game_" + choices[i].game).getElementsByTagName("input");
						  for (j = 0; j < inputs.length; j++) {
							  inputs[j].checked = false;
						  }
					  }
				  }
				  // The request is done, and we can do something else
				  choices[i].teamAbb = userPick;
				  choices[i].fullTeam = fullTeamName;
				  choices[i].game = id;
				  choices[i].timegame = timeofgame;
				  choices[i].spread = attempt.thisTeamImg;
				  document.getElementById("image" + pts).innerHTML = `<img class="pt-1" src="https://b.fssta.com/uploads/application/college/team-logos/${choices[i].spread}.vresize.200.200.medium.0.png">`;
				  document.getElementById("time" + pts).innerHTML = `<span class="badge rounded-pill bg-secondary">${choices[i].timegame}</span>`;
				  game.game = id;
			  }
		  }
	  });
	  document.getElementById(pts).value = game.team;
  }
  
  function showPointTotals(divId, element){
	  document.getElementById(divId).style.display = element.value != "" ? 'block' : 'none';
	  var gm = divId.substring(divId.lastIndexOf("_") + 1);
	  console.log(choices);
	  for (i = 0; i < choices.length; i++) {
		  // only allow a team to be chosen once
		  if (choices[i].game == gm){ 
			  if (element.value != choices[i].teamAbb) {
				  if (choices[i].pts) {
					  console.log("goner");
					  document.getElementById(choices[i].pts).value = "";
					  document.getElementById(choices[i].pts + "-point-maker").className = "p-2 border bg-light";
					  document.getElementById("label-choice-" + choices[i].pts).innerHTML = `<label for="${choices[i].pts}" class="choice"></label>`;
					  document.getElementById("image" + choices[i].pts).innerHTML = ``;
					  document.getElementById("time" + choices[i].pts).innerHTML = ``;
					  choices[i].teamAbb = "";
					  choices[i].fullTeam = "";
					  choices[i].game = "";
					  choices[i].timegame = "";
					  choices[i].spread = "";
				  }
			  }
		  }
	  }
  
	  var inputs = document.getElementById("point_totals_game_" + gm).getElementsByTagName("input");
	  for (j = 0; j < inputs.length; j++) {
		  inputs[j].checked = false;
	  }
	  game.team = element.value;
	  game.game = gm;
  }
  
  function setTeam(element) {
	  game.team = element.value;
  }
  
  // save picks
  const savePicks = document.querySelector('#save_picks');
  if(savePicks) {
	  savePicks.addEventListener('submit', (e) => {
		  try {
			e.preventDefault();
			const fifty = document.getElementById('50').value;
			const forty = document.getElementById('40').value;
			const thirty = document.getElementById('30').value;
			const twenty = document.getElementById('20').value;
			const ten = document.getElementById('10').value;
			  
			isRequiredTeamIncluded(fifty, forty, thirty, twenty, ten);
			savePicks.querySelector('.response').innerHTML = ``;
		  }
		  catch (err) {
			savePicks.querySelector('.response').innerHTML = `<br><div class="alert alert-danger" id="alert-alert" role="alert">
			<p class='h2'>NOT SO FAST!</p> 
			<p> ${err.message} Must select a team from the required game (${requiredMatch[0]} vs ${requiredMatch[1]}) and resubmit.</p>
			<p><iframe class="video" width="480" height="270" src="https://video.twimg.com/ext_tw_video/1553867879166070784/pu/vid/480x270/OCHuLYGIIWW_sKBa.mp4?tag=12" title="video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen=""></iframe></p>
			</div>`;
		  }
	  })
  }
  
  function getTeamInfo(teamId) {
	  request = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(team) {
	  for (var key in team) {
		  for (var i = 0; i < team[key].length; i++) {
			  if(team[key][i].teamValue == teamId){
				  attempt.thisTeam = team[key][i].team;
				  attempt.thisTeamAbb = team[key][i].teamValue;
				  attempt.thisTeamImg = team[key][i].teamImage;
			  }
		  }
	  }
  });	
  }
  
   {


  }
  
  
function isRequiredTeamIncluded(fif, fort, thirt, twet, te) {
	const allOfThePicks = [];
	allOfThePicks.push(fif);
	allOfThePicks.push(fort);
	allOfThePicks.push(thirt);
	allOfThePicks.push(twet);
	allOfThePicks.push(te);
			
	if (allOfThePicks.includes(requiredMatch[0]) || allOfThePicks.includes(requiredMatch[1])) {
		requiredSelected = true;
	}
	else {
		throw new Error('These picks cannot be saved.');
	}
}