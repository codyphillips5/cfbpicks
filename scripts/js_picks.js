var game = {
	team: "",
	spread : "",
	pts : "",
	game : "" 
  };
  var attempt = {
	  thisTeam : "",
	  thisMascot : "",
	  thisTeamAbb : "",
	  thisTeamImg : ""
  };
  
  var choices = [{teamAbb: "", fullTeam: "", game: "", spread : "", pts : "50"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "40"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "30"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "20"}, {teamAbb: "", fullTeam: "", game: "", spread : "", pts : "10"}];
  
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
  
  var xFile, yFile;
  
  var requestX = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/games/week9.json", function(json){
	  xFile = json;
  });
  
  var requestY = $.getJSON("https://codyphillips5.github.io/cfbpicks/json/teams.json", function(json){
	  yFile = json;
  });
  
  $.when(requestX, requestY).then(function(){
	  for (var key in xFile) {
		  for (var i = 0; i < xFile[key].length; i++) {
			  var gameId = xFile[key][i].gameId;
			  // set home team values
			  var home = xFile[key][i].homeTeam;
			  for (var k in yFile) {
				  for (var j = 0; j < yFile[k].length; j++) {
					  if(home == yFile[k][j].teamId) {
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
					  if(away == yFile[k][j].teamId) {
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
			  var required = xFile[key][i].required;
			  var badge = document.createElement('div');
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
				  badge.className = 'required';
			  }
			  else {
				  badge.className = 'games-layout';		
			  }
			  var header = '<span class=\'header\'><h4>' + awayTeam + ' vs ' + homeTeam + ' (' + homeSide + spread + ') </h4><br>';
			  var select = '<select class=\'teamlist\' id=\'game' + gameId + '\' onchange=\"showPointTotals(\'point_totals_game_' + gameId + '\', this);\"><option value = \"\"> -- Select Team -- </option><option value=\"' + awayTeamVal + '\">' + awayTeam + ' ' + awaySide + spread + '</option><option value=\"' + homeTeamVal + '\">' + homeTeam + ' ' + homeSide + spread + '</option></select>';
			  var display = '<div id=\"point_totals_game_' + gameId + '\" style=\"display:none;\">';
			  var numbers = [5, 4, 3, 2, 1];
			  var radios = [];
			  for (var j = 0; j < numbers.length; j++) {
				  if (required) {
					  var radio = '<label class="radio-inline font-weight-bold"><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0 required>' + numbers[j] + '0</label>'
				  } 
				  else {
					  var radio = '<label class="radio-inline font-weight-bold"><input type=\"radio\" onchange=\"assignPointsByTeam(this.value, ' + gameId +');\" name=\"pick_worth\" value=' + numbers[j] + '0>' + numbers[j] + '0</label>'
				  }
				  radios.push(radio);
			  }
			  badge.innerHTML = '<form>' + header + select + '<br>'+ display + radios.join(' ') + '</form>';		
			  document.getElementById(key).appendChild(badge);
		  }
	  }
  });
  
  var request;
  
  function assignPointsByTeam(pts, id) {
	  var pick = document.getElementById("game" + id);
	  var userPick = pick.options[pick.selectedIndex].value;
	  var fullTeamName = pick.options[pick.selectedIndex].text;
	  fullTeamSpread = fullTeamName.replace(/[^\d+.-]/g, '');
	  game.team = userPick;
	  game.spread = attempt.thisTeamImg;
	  document.getElementById(pts).value = game.team;
	  document.getElementById("label-choice-" + pts).innerHTML = `<label for="${pts}" class="choice">${game.team} ${fullTeamSpread}</label>`;
	  getTeamInfo(userPick);
	  request.success(function(response){
		  for (i = 0; i < choices.length; i++) {
			  // only allow a team to be chosen once
			  if (game.team == choices[i].teamAbb) {
				  choices[i].teamAbb = "";
				  choices[i].fullTeam = "";
				  document.getElementById(choices[i].pts).value = "";
				  document.getElementById("label-choice-" + choices[i].pts).innerHTML = `<label for="${choices[i].pts}" class="choice"></label>`;
				  document.getElementById("image" + choices[i].pts).innerHTML = ``;
			  }
			  if (pts == choices[i].pts) {
				  if(choices[i].teamAbb != "") {
					  console.log("game.game = " + game.game);
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
				  choices[i].spread = attempt.thisTeamImg;
				  document.getElementById("image" + pts).innerHTML = `<img src="https://b.fssta.com/uploads/content/dam/fsdigital/fscom/global/dev/static_resources/ncaaf/teams/retina/${choices[i].spread}.vresize.200.200.medium.2.png">`;
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
					  document.getElementById(choices[i].pts).value = "";
					  document.getElementById("label-choice-" + choices[i].pts).innerHTML = `<label for="${choices[i].pts}" class="choice"></label>`;
					  document.getElementById("image" + choices[i].pts).innerHTML = ``;
					  choices[i].teamAbb = "";
					  choices[i].fullTeam = "";
					  choices[i].game = "";
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
			  console.log(fifty);
		  }
		  catch (err) {
			  console.log(err);
			  console.log(err.message);
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