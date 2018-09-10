/* jshint esversion : 6 */

// @root/api/user.js

const produitAPi = function produitAPi(connection) {

    const router = require("express").Router();
    const productsModel = require("./../model/products")(connection);


    router.post('/produits', (req, res) => {
        console.log(req.body);
        productsModel.create((err, dataset) => {
            res.send(dataset);
        }, req.body); // post datas ici ...
    });



    router.get('/produits', (req, res) => {
        productsModel.get((err, dataset) => {
            res.send(dataset);
        }, null);
    });

    router.delete('/produits', (req, res) => {
        productsModel.remove((err, dataset) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(dataset);
        }, req.body.ids); // tableau d'ids ici ...
    });

    router.patch('/produits', (req, res) => {
        productsModel.update((err, dataset) => {
            if (err) return res.status(500).send(err);
            else return res.status(200).send(dataset);
        }, req.body);
    });

    return router;
};

module.exports = produitAPi;
