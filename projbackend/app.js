//middleware have access to req object, res objext and the next
//They can Make changes to the request and the response objects.



require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();



const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");



// console.log("statement this");

//sabse pehle routes -> auth.js mein jayega poori file dekhegi agar usme kahi require ayega toh uss file pr jayega poori file dekhega
//My routes
var authRoutes = require("./routes/auth.js");






mongoose.connect(process.env.DATABASE).then(() => {
    console.log("DB IS CONNECTED");
});

// mongoose.connect('mongodb://127.0.0.1:27017/taxi');


app.use(bodyParser.json());
app.use(cookieParser()); //read about this
app.use(cors());



// //My routes
// // console.log("statement or this");
app.use("/api", authRoutes);






// app.get("/admin", (req, res) => {
//     return res.send("welcome")
// });
const port = process.env.PORT || 8000;
// const port = 8000;
app.listen(port, () => {
    console.log(`App is running on ${port}`);
})
