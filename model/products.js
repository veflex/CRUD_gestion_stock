/*jshint esversion :  6 */

// @root/model/user.js

const productsModel = function productsModel(connection) {

    const create = function createProduct(clbk, data) {
        const q = "INSERT INTO produits (id_marque, nom, prix, description) VALUES (?, ?, ?, ?)";
        const payload = [data.nom_marque, data.nom, data.prix, data.description];

        connection.query(q, payload, (err, res, cols) => {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };

    const remove = function deleteProduct(clbk, ids) {
        // la clause SQL IN permet de chercher une valeur dans un tableau
        const q = "DELETE FROM produits WHERE id IN (?)";

        connection.query(q, [ids], function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(res, null);
            return clbk(null, res);
        });
    };

    const update = function editProduct(clbk, prod) {
        const q = "UPDATE produits SET nom = ?, description = ?, prix = ? WHERE id = ?";
        const payload = [prod.nom, prod.description, prod.prix, prod.id];
        connection.query(q, payload, function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };

    const get = function getProducts(clbk, id) {
        var query = "SELECT p.id, p.nom, p.prix,m.nom as 'nom_marque', p.description, m.id as 'id_marque' FROM produits p INNER JOIN marques m ON  m.id= p.id_marque;"
        connection.query(query, function (error, results, fields) {
            if (error) return clbk(error, null);
            return clbk(null, results);
        });
    };

    return {
        create,
        remove,
        update,
        get
    };
};

module.exports = productsModel;
