/* jshint esversion : 6 */

// @root/index.js

const express = require("express");
const port = 8081;
const app = express();
const baseURL = `http://localhost:${port}`;
const api = require(__dirname + "/api")(app);
const http = require("http");

// APP CONFIG !!!
app.use(express.json({
    extended: false
}))
app.use(api.prefix, api.routers);
app.set("view engine", "ejs"); // CHECK THE DOC http://ejs.co/
app.set("views", __dirname + "/view"); //  précise à express le dossier des vues
// définition de ressources statiques...
app.use("/ejs", express.static(__dirname + "/node_modules/ejs"));
app.use(express.static(__dirname + "/public"));

// TEMPLATE VARS !!!
// Accessibles dans tout le template via app.locals (API express)
app.locals.site = {};
app.locals.baseURL = baseURL;
app.locals.site.title = "EVAL - Gestion de stock";
app.locals.site.description = "eval donnée par notre sensei guillaume (jeremy on t'oublie pas)";

app.locals.marques = []

// ROUTES DES PAGES DE l"APPLICATION


app.get("/", function (req, res) {
    //    const productsURL = "http://localhost:8081" + api.prefix + "/produits";
    const marquesURL = "http://localhost:8081" + api.prefix + "/marques";

    http.get(marquesURL, function (response) {

        response.on("data", function (chunk) {
            app.locals.marques[0] = JSON.parse(chunk);
        })

        response.on("end", function () {
            res.render("index", {
                title: "Eval - Gestion de stock",
                marques: app.locals.marques[0]
            });
        });

        response.on("error", function () {
            console.error("erreur")
        })
    });
});




app.listen(port, function () {
    console.log("node server started on port " + port);
});
