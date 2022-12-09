var express = require("express");

var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
const final = require("./final.js");
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./finalViews/home.html"));
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, "./finalViews/register.html"));
})

app.post("/register", function (req, res) {
    final.register(req.body).then((user) => {
        res.json(user);
    }).catch((err) => {
        console.log(err);
        res.json({ERROR: err});
    })
    res.sendFile(path.join(__dirname, "./finalViews/register.html"));
})

app.get("/signIn", function (req, res) {
    res.sendFile(path.join(__dirname, "./finalViews/signIn.html"));
})

app.post("/signIn", function (req, res) {
    final.signIn(req.body).then((user) => {
        res.json(user);
    }).catch((err) => {
        res.json({ERROR: err});
    })
    res.sendFile(path.join(__dirname, "./finalViews/register.html"));
})

app.get("*", function (req, res) {
    res.send("Not Found");
})

final.startDB().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
})