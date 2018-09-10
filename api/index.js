/* jshint esversion : 6 */

// @root/api/index.js

// ROUTAGE DE L'API
const api = function api() {

    const APIVersion = 1; // notre api est en version 1

    const database = require(__dirname + "/../model")({
        password: "", // définition du mot de passe de mySQL
        database: "tp_gestion_de_stock" // base de donnée cible
    });

    // IMPORT DES ROUTES DE l'API USER
    const routers = []; // on expotera ce tableau une fois rempli
    const productsRouter = require("./products")(database.connection); // module api user

    ///////////////////////////////////
    // C'est à vous pour la suite ....
    ///////////////////////////////////

    // IMPORT DES ROUTES DE l'API COUNTRY
    const marquesRouter = require("./marques")(database.connection);
    // IMPORT DES ROUTES DE l'API BILL
    // const billRouter = require("./bill")(database.connection);

    routers.push(productsRouter); // aggrégation des routeurs dans un tableau
    routers.push(marquesRouter); // aggrégation des routeurs dans un tableau

    return { // définition des propriétés publiques du module /api/index.js
        version: APIVersion,
        prefix: `/api/v${APIVersion}`,
        routers: routers
    }; // on récupère ces valeurs dans @root/index.js
};

module.exports = api;
