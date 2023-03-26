const User = require("../models/user");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken'); //read
var ejwt = require('express-jwt'); //read  

exports.signUp = async (req, res) => {
    // console.log("statement 3");
    // return res.json({
    //     message : "Hello"
    // });
    // console.log("REQ BODY", req.body);
    // res.json({
    //     message: "SignUp works just fine"
    // });
    // const test = 7;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // console.log("statement 4");
        console.log(errors);
        return res.status(422).json({
            error: errors.array()[0].msg,
            field: errors.array()[0].param
        });
    }
    const user = new User(req.body);
    // user.save(async(err, user) => {
    //     if(err){
    //         return res.status(400).json({
    //             err: "Not able to create user"
    //         });
    //     }
    //     return res.json({
    //         name: user.name,
    //         email: user.email,
    //         id: user._id
    //     });
    // })
    // user.save().then(user => {

    // });
    try{
        await user.save();
        return res.json({
            name : user.name,
            email : user.email,
            id : user._id
        });
    } catch(err){
        return res.status(400).json({
            err : "Not able to create user"
        });
    }
};
// console.log(test);


exports.signIn = async (req, res) => {
    // console.log("entering signin");
    const { email, password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            field: errors.array()[0].param
        });
    }

    const us = await User.findOne({email});
    try{
        if(!us.authenticate(password)){
            console.log("signin unsuccessful");
            return res.status(401).json({
                error : "email and password don't match"
            })
        }
        const token = jwt.sign({_id : us._id}, process.env.SECRET)

        res.cookie("token", token, {expire : new Date() + 9999});

        const{_id, name, email, role, timestamps} = us;
        console.log("signin successful");
        return res.json({token, user : {_id, name, email, role, timestamps}});
    } catch(err){
        return res.status(400).json({
            error : "user email is not registered"
        })
    }
}


exports.signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signed out successfully"
    });
};


//protected routes
//use ejwt
exports.isSignedIn = ({
    secret: process.env.SECRET,
    userProperty: "auth"
});


//profile will be set from front end if and only if the user is logged in 
exports.isAuthenticated = (req, res, next) => {
    let check = req.profile && req.auth && req.profile._id == req.auth._id
    if(!check){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}


exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Not an ADMIN. ACCESS DENIED"
        }); 
    }
    next();
}