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
  
var weekNum = 2;
var fn;  
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
					document.getElementById("label-choice-40").innerHTML = `<label for="40" class="choice">${docSnapshot.data().Forty}</label>`;
					document.getElementById("label-choice-30").innerHTML = `<label for="30" class="choice">${docSnapshot.data().Thirty}</label>`;
					document.getElementById("label-choice-20").innerHTML = `<label for="20" class="choice">${docSnapshot.data().Twenty}</label>`;
					document.getElementById("label-choice-10").innerHTML = `<label for="10" class="choice">${docSnapshot.data().Ten}</label>`;
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
    
        db.collection('week' + weekNum).doc(auth.currentUser.email).set({
            user: auth.currentUser.email,
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
            //signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-danger" role="alert">${err.message}</div>`;
        });
    });
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