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
        //setupGuides([]);
    }
})

// create new guide
const createForm = document.querySelector('#save_picks');
if(createForm) {
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
        db.collection('week6').add({
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
            createForm.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Success! Your picks have been saved. At this time, picks may only be submitted ONCE. Please reach out to Kevin with questions or any pick changes.</div>`;
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

        // sign up the user
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            signupForm.reset();
            signupForm.querySelector('.response').innerHTML = `<br><div class="alert alert-success" role="alert">Success! Account created. Go view the <a href='picks.html'>Lines</a></div>`;
            document.getElementById("signup").disabled = true;
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
