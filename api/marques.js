/*jshint esversion :  6 */

// @root/api/country.js

const marqueAPi = function countryAPi(connection) {
    const router = require("express").Router();

    const marqueModel = require("./../model/marques")(connection);

    router.get('/marques', (req, res) => {
        marqueModel.get((err, dataset) => {
            res.send(dataset);
        }, null);
    });

    router.post('/marques', (req, res) => {
        console.log(req.body);
        marqueModel.create((err, dataset) => {
            res.send(dataset);
        }, req.body); // post datas ici ...
    });

    router.delete('/marques', (req, res) => {
        marqueModel.remove((err, dataset) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(dataset);
        }, req.body.ids); // tableau d'ids ici ...
    });

    router.patch('/marques', (req, res) => {
        marqueModel.update((err, dataset) => {
            if (err) return res.status(500).send(err);
            else return res.status(200).send(dataset);
        }, req.body);
    });

    return router;
};

module.exports = marqueAPi;
