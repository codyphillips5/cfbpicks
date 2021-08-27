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
  
var fn;  
// create new guide
const createForm = document.querySelector('#save_picks');
if(createForm) {
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        db.collection('week0').doc(auth.currentUser.email).set({
            user: auth.currentUser.email,
            50: document.getElementById('50').value,
            40: document.getElementById('40').value,
            30: document.getElementById('30').value,
            20: document.getElementById('20').value,
            10: document.getElementById('10').value
        }).then(() => {
            // close the modal and reset form
            //const modal = document.querySelector('#modal-create');
            //M.Modal.getInstance(modal).close();
			
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