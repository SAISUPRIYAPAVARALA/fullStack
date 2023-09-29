var express = require("express");
var router = express.Router();
const firebase = require('firebase'); // Import Firebase library



// Sign up user and add data to Firebase collection
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Create user in Firebase authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

        // Add user data to Firebase collection
        await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
            name,
            email,
            password
        });

        res.redirect('/route/login?message=signup'); // Redirect to login page with success message
    } catch (error) {
        console.error(error);
        res.render('signup', { error: "Signup failed. Please try again." }); // Display error on signup page
    }
});


// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Authenticate user with Firebase
        await firebase.auth().signInWithEmailAndPassword(email, password);

        req.session.user = email;
        res.redirect('/route/dashboard');
    } catch (error) {
        res.end("Invalid Username or Password");
    }
});


// route for dashboard
router.get('/dashboard', (req, res) => {
    if(req.session.user){
        res.render('dashboard', {user : req.session.user})
    }else{
        res.send("Unauthorize User")
    }
})

// route for logout
router.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.render('base', { title: "Express", logout : "logout Successfully...!"})
        }
    })
})

module.exports = router;
