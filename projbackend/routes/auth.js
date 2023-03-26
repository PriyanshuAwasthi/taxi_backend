var express = require("express");
var router = express.Router();
//import from auth.js -> controllers
const { signOut, signUp, signIn, isSignedIn } = require("../controllers/auth.js");
const { check, validationResult } = require('express-validator');

// console.log("statement 1");
router.post("/signup", 
check("name").isLength({min: 5}).withMessage("name must be atleast 5 char long"),
check("email").isEmail().withMessage("please provide a valid email"),
check("password").isLength({min: 3}).withMessage("password must be altleast 3 char long"),
signUp);
// console.log("statement 2");


router.post("/signin", 
check("email").isEmail().withMessage("please provide a valid email"),
check("password").isLength({min: 1}).withMessage("password should not be empty"),
signIn);


// console.log("statement 11");
router.get("/signout", signOut);




// router.get("/signout", (req, res) => {
//     res.send("user is signing out");
// });

// router.get("/testroute", isSignedIn, (req, res) => {
//     res.send("A protected route");
// });
// router.get("/testroute", isSignedIn, (req, res) => {
//     res.json(req.auth);
// });



// router.get("/admin", (req, res) => {
//     return res.send("welcome 3")
// });


module.exports = router;