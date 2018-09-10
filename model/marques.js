/* jshint esversion : 6 */

// @root/model/marques.js

const marquesModel = function marquesModel(connection) {
    const get = function getMarques(clbk, id) {
        var sql;
        sql = 'SELECT * FROM `marques`';
        connection.query(sql, (error, results, fields) => {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (error) return clbk(error, null);
            return clbk(null, results);
        });
    };

    const create = function createProduct(clbk, data) {
        const q = "INSERT INTO marques (nom) VALUES (?)";

        connection.query(q, [data.nom], (err, res, cols) => {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };

    const remove = function deleteProduct(clbk, ids) {
        // la clause SQL IN permet de chercher une valeur dans un tableau
        const q = "DELETE FROM marques WHERE id IN (?)";

        connection.query(q, [ids], function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(res, null);
            return clbk(null, res);
        });
    };

    const update = function editProduct(clbk, marque) {
        const q = "UPDATE marques SET nom = ? WHERE id = ?";
        const payload = [marque.nom, marque.id];
        connection.query(q, payload, function (err, res, fields) {
            // console.log(this.sql); // affiche la dernière requête SQL, pratique pour deboguer
            if (err) return clbk(err, null);
            return clbk(null, res);
        });
    };

    return {
        get,
        create,
        remove,
        update
    };
};

module.exports = marquesModel;
