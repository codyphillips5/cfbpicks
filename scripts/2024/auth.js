// listen for auth status changes
auth.onAuthStateChanged(user => {
    if(user) {
        // get data
        //console.log(user);
        db.collection('guides').onSnapshot(snapshot => {
        //setupGuides(snapshot.docs);
        setupUI(user);
        }, err => {
            console.log(err.message)
        })
    }
    else {
        setupUI();
		document.getElementById("savePicks").disabled = true;
		document.getElementById("savePicks").innerHTML = "Login to Submit";
        //setupGuides([]);
    }
})
 
// also update line 115
var weekNum = 3;
var fn;
var requiredSelected = true;
// create new guide
const createForm = document.querySelector('#save_picks');
if(createForm) {
	// show picks if selected
	firebase.auth().onAuthStateChanged(user => {
	var week = db.collection('week' + weekNum).doc(auth.currentUser.email);

	week.get()
		.then((docSnapshot) => {
			if (docSnapshot.data()) {
				if (docSnapshot.data().Fifty !== undefined) { 
					document.getElementById("label-choice-50").innerHTML = `<label for="50" class="choice">${docSnapshot.data().Fifty}</label>`;
					//document.getElementById('50').value = `${docSnapshot.data().Fifty}`;
					document.getElementById("label-choice-40").innerHTML = `<label for="40" class="choice">${docSnapshot.data().Forty}</label>`;
					//document.getElementById('40').value = `${docSnapshot.data().Forty}`;
					document.getElementById("label-choice-30").innerHTML = `<label for="30" class="choice">${docSnapshot.data().Thirty}</label>`;
					//document.getElementById('30').value = `${docSnapshot.data().Thirty}`;
					document.getElementById("label-choice-20").innerHTML = `<label for="20" class="choice">${docSnapshot.data().Twenty}</label>`;
					//document.getElementById('20').value = `${docSnapshot.data().Twenty}`;
					document.getElementById("label-choice-10").innerHTML = `<label for="10" class="choice">${docSnapshot.data().Ten}</label>`;
					//document.getElementById('10').value = `${docSnapshot.data().Ten}`;
				}
			}
		});
	});	
	
	// submit picks	
		createForm.addEventListener('submit', (e) => {
			e.preventDefault();
			
			// get user's first name
			var docRef = db.collection("Users").doc(auth.currentUser.email);
			docRef.get().then((doc) => {
				if (doc.exists) {
					fn = doc.data().FirstName;
					console.log(fn);
				} else {
					// doc.data() will be undefined in this case
					console.log("No such document!");
				}
			}).catch((error) => {
				console.log("Error getting document:", error);
			})
			
			var elem = document.getElementById('alert-alert');
			
			if(elem !== null) {
				return;
			}

		db.collection('week' + weekNum).doc(auth.currentUser.email).set({
				user: auth.currentUser.email,
				lastUpdate: firebase.firestore.Timestamp.fromDate(new Date()),
				Fifty: document.getElementById('50').value,
				Forty: document.getElementById('40').value,
				Thirty: document.getElementById('30').value,
				Twenty: document.getElementById('20').value,
				Ten: document.getElementById('10').value
			}).then(() => {			
				console.log("still: " + fn);
				createForm.reset();
				createForm.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Success! Your picks have been saved. <br>Good luck, ${fn}!</div>`;
				document.getElementById("savePicks").disabled = true;
				document.getElementById("savePicks").innerHTML = "Saved";
			}).catch(err => {
				console.log(err.message)
				signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
			});
		});
		
}
// create new guide
const saveResults = document.querySelector('#save_results');
if(saveResults) {
	// show picks if selected
	firebase.auth().onAuthStateChanged(user => {
		if (auth.currentUser.email === 'codyphill5@gmail.com') {
			// submit picks
			saveResults.addEventListener('submit', (e) => {
				e.preventDefault();
				
				var userNames = document.getElementsByClassName('points').length;
				var usercheck;
				var weekcheck;
				var pointscheck;
				var topcheck;
				
				for (var r = 1; r <= userNames; r++) {
					usercheck = document.getElementById('user' + r).innerHTML;
					weekcheck = "week" + weekNum;
					pointscheck = Number(document.getElementById('points' + r).innerHTML);
					topcheck = document.getElementById('top' + r).checked;
					
					// update the number every week 
					const data = {
						user: usercheck,
						week2: {
							id: weekcheck,
							points: pointscheck,
							top: topcheck
						}
					};
					
					db.collection('Results').doc(usercheck).update(data).then(() => {
					saveResults.reset();
					saveResults.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Success! Week ${weekNum} picks saved! </div>`;
					document.getElementById("saveResults").disabled = true;
					document.getElementById("saveResults").innerHTML = "Saved";
				}).catch(err => {
					console.log(err.message)
					//signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
				});
				}
			});
		}
	})
}

// signup
const signupForm = document.querySelector('#signup-form');
if(signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // get user info
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const firstName = signupForm['signup-firstname'].value;
        const lastName = signupForm['signup-lastname'].value;

        // sign up the user
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
			var user = db.collection('Users').doc(email);
				user.set({
					Email: email,
					FirstName: firstName,
					LastName: lastName,
					UserID: 0
				});
			
			signupForm.reset();
            signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Success! Account created. Redirecting to <a href='picks.html'>Game Lines</a>...</div>`;
            document.getElementById("signup").disabled = true;
			setTimeout(function(){
            window.location.href = 'picks.html';}, 5000);
        }).catch(err => {
                signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
        });
    });
}

// logout 
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // get user info
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
    
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            // close the login modal and reset the form
            loginForm.reset();
            location.replace("picks.html");
        }).catch(err => {
            loginForm.querySelector('.error').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
        })
    });
}

// forgot-password
const forgotForm = document.querySelector('#forgot-form');
if(forgotForm) {
	console.log("here");
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // get user info
        const email = forgotForm['forgot-email'].value;
    console.log(email);
		auth.sendPasswordResetEmail(email).then(cred => {
			forgotForm.reset();
            forgotForm.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Reset Email Sent. Return to <a href='log.html'>Log In</a></div>`;
		})
		.catch(err => {
			forgotForm.querySelector('.error').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
		});
    });
}