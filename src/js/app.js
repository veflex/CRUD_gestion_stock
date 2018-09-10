const app = (function app() {
    var dom = {},
        tableauId = [];
    const url = "http://localhost:8081/";
    var showProd = [];
    var showMarques = [];


    const doAjax = function doAjax(url, method, callback, data) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-Type', 'application/json'); // on paramètre un peu l'entête de notre requête
            data = data ? JSON.stringify(data) : null;

            if (method.toLowerCase() === "post") {
                if (!data) throw new Error("bad call");
            }
            // on attend le retour de l'appel AJAX
            xhr.onload = evt => callback(evt.target.response || evt.srcElement.response);
            xhr.send(data);

        } catch (err) {
            console.error(err);
        }
    };

    //fonction utilisable

    const getId = function getId(tabl) {
        tableauId = [];
        tabl.forEach(function (input) {
            tableauId.push(input.parentElement.parentElement.id)
        })
    };

    const checkboxChecked = function checkboxChecked(query) {
        var checkbox = document.querySelectorAll(query);
        var checked = Array.from(checkbox).filter(function (check) {
            return check.checked === true;
        })
        return checked;
    };

    const hideShow = function hideShow(tabl) {

        tabl.forEach(function (item) {
            item.classList.toggle("is-hidden");
        });

    };

    const showForm = function showForm(form) {
        form.classList.toggle("is-hidden");
    };

    //crud produit début =========>    



    const getInputValues = function getInputValues() {
        var nom = dom.nom.value;
        var marque = dom.marque.value;
        var description = dom.description.value;
        var prix = dom.prix.value;


        return {
            nom: nom,
            nom_marque: marque,
            description: description,
            prix: prix
        };
    };

    const newTr = function newTr(obj) {
        //creation des element de la table
        const tr = document.createElement("tr");
        const td_id = document.createElement("td");
        const td_nom = document.createElement("td");
        const td_marque = document.createElement("td");
        const td_description = document.createElement("td");
        const td_prix = document.createElement("td");
        const td_modif = document.createElement("td");
        const td_suppr = document.createElement("td");
        //creation d'icon et checkbox        
        const icon_modif = document.createElement("i");
        const icon_valid = document.createElement("i");
        const check_suppr = document.createElement("input");
        check_suppr.type = "checkbox"
        //icon fontawesome
        icon_modif.className = "far fa-edit fa-2x modify"
        icon_valid.className = "fas fa-check fa-2x valid is-hidden"
        //on defini l'id de la tr = id objet
        tr.id = obj.id;
        //on ecrit les valeur de l'objet dans chaque td
        td_id.innerHTML = obj.id;
        td_nom.innerHTML = obj.nom;
        td_marque.innerHTML = obj.nom_marque;
        td_description.innerHTML = obj.description;
        td_prix.innerHTML = obj.prix;
        //ajout du contenteditable
        tr.contentEditable = "false";
        td_id.contentEditable = "false";
        td_modif.contentEditable = "false";
        td_suppr.contentEditable = "false";
        td_marque.contentEditable = "false";

        //ajout des icon et checkbox dans leur td
        td_modif.appendChild(icon_valid);
        td_modif.appendChild(icon_modif);
        td_suppr.appendChild(check_suppr);
        td_modif.appendChild(icon_modif);
        //on met tout en place dans le tableau  
        tr.appendChild(td_id);
        tr.appendChild(td_nom);
        tr.appendChild(td_marque);
        tr.appendChild(td_description);
        tr.appendChild(td_prix);
        tr.appendChild(td_modif);
        tr.appendChild(td_suppr);
        dom.tbody.appendChild(tr)

    };

    const deleteProduct = function deleteProduct() {
        getId(checkboxChecked('#tbodyProd input'));
        doAjax(url + "api/v1/produits", "DELETE", function (result) {
            window.console.log(result);
        }, {
            ids: tableauId
        });
        tableauId.forEach(function (id) {
            var tr = document.getElementById(id);
            tr.remove()
        })
    };

    const showProducts = function showProducts(tabl) {

        hideShow(showProd);
        dom.tbody.innerHTML = "";
        tabl.forEach(function (product) {
            newTr(product);
        });
        eventModifValid("#tbodyProd i.modify", "#tbodyProd i.valid");
    };

    const modifyProduct = function modifyProduct(productId, clbk) {

        doAjax(url + "api/v1/produits", "PATCH", function (result) {
                window.console.log(JSON.parse(result));
            },
            clbk(productId));
    };

    const getTableValues = function getTableValues(id) {
        var tr = document.getElementById(id);
        const nom = tr.cells[1].innerHTML;
        const description = tr.cells[3].innerHTML;
        const prix = tr.cells[4].innerHTML;
        const id_prod = id;
        const obj = {
            id: id_prod,
            nom: nom,
            description: description,
            prix: prix
        };
        return obj;
    };

    const eventModifValid = function eventModif(iModif, iValid) {
        var modif = document.querySelectorAll(iModif);
        var valid = document.querySelectorAll(iValid);
        modif.forEach(function (icon) {
            icon.addEventListener("click", function () {
                icon.parentElement.parentElement.cells[1].classList.add("highlight");
                icon.parentElement.parentElement.cells[3].classList.add("highlight");
                icon.parentElement.parentElement.cells[4].classList.add("highlight");
                icon.parentElement.parentElement.contentEditable = "true";
                icon.classList.add("is-hidden");
                icon.previousElementSibling.classList.remove("is-hidden")
            })
        });

        valid.forEach(function (icon) {
            icon.addEventListener("click", function () {
                icon.parentElement.parentElement.cells[1].classList.remove("highlight");
                icon.parentElement.parentElement.cells[3].classList.remove("highlight");
                icon.parentElement.parentElement.cells[4].classList.remove("highlight");
                icon.parentElement.parentElement.contentEditable = "false";
                icon.classList.add("is-hidden");
                icon.nextElementSibling.classList.remove("is-hidden")
                const id = icon.parentElement.parentElement.id;
                modifyProduct(id, getTableValues)
            })
        })
    };

    const getFullProducts = function getProducts() {
        doAjax(url + "api/v1/produits", "GET", function (result) {
            showProducts(JSON.parse(result))
        })
    };

    const addProduct = function addProduct(evt) {
        evt.preventDefault();
        var newItem = getInputValues();
        doAjax(url + "api/v1/produits", "POST", function (result) {

            newItem.id = JSON.parse(result).insertId;

            var option = document.querySelectorAll('#marques option');
            option.forEach(function (o) {
                if (newItem.nom_marque === o.value) {
                    newItem.nom_marque = o.label
                }

            })
            newTr(newItem);
            eventModifValid("#tbodyProd i.modify", "#tbodyProd i.valid");
        }, newItem);
    };

    const bossCheck = function bossCheck(who, where) {
        var check = document.querySelectorAll(where);
        if (who.checked) {
            check.forEach(function (input) {
                input.checked = true;
            })
        } else {
            check.forEach(function (input) {
                input.checked = false;
            })
        }
    }

    //crud produit fin =========>

    //crud marques début =========>

    const addMarque = function addMarque(evt) {
        evt.preventDefault();
        var newMarque = {
            nom: dom.nomM.value
        }
        doAjax(url + "api/v1/marques", "POST", function (result) {
            newMarque.id = JSON.parse(result).insertId;
            newTrM(newMarque);
            eventModifValidM("#tbodyMarques i.modify", "#tbodyMarques i.valid");
            addOption(newMarque.nom, newMarque.id)
        }, newMarque)
    };

    const newTrM = function newTrM(obj) {
        const tr = document.createElement("tr");
        const td_id = document.createElement("td");
        const td_nom = document.createElement("td");
        const td_modif = document.createElement("td");
        const td_suppr = document.createElement("td");
        //creation d'icon et checkbox        
        const icon_modif = document.createElement("i");
        const icon_valid = document.createElement("i");
        const check_suppr = document.createElement("input");
        check_suppr.type = "checkbox"
        //icon fontawesome
        icon_modif.className = "far fa-edit fa-2x modify"
        icon_valid.className = "fas fa-check fa-2x valid is-hidden"
        //on defini l'id de la tr = id objet
        tr.id = "marque_" + obj.id;
        //on ecrit les valeur de l'objet dans chaque td
        td_id.innerHTML = obj.id;
        td_nom.innerHTML = obj.nom;
        //ajout du contenteditable
        tr.contentEditable = "false";
        td_id.contentEditable = "false";
        //ajout des icon et checkbox dans leur td
        td_modif.appendChild(icon_modif);
        td_modif.appendChild(icon_valid);
        td_suppr.appendChild(check_suppr);
        //on met tout en place dans le tableau  
        tr.appendChild(td_id);
        tr.appendChild(td_nom);
        tr.appendChild(td_modif);
        tr.appendChild(td_suppr);
        dom.tbodyM.appendChild(tr)
    };

    const addOption = function addOption(marque, id) {
        var option = document.createElement("option");
        option.value = id;
        option.innerHTML = marque;
        dom.marque.appendChild(option);
    };

    const eventModifValidM = function eventModifValidM(iModif, iValid) {
        var modif = document.querySelectorAll(iModif);
        var valid = document.querySelectorAll(iValid);

        modif.forEach(function (icon) {
            icon.addEventListener("click", function () {
                icon.parentElement.parentElement.cells[1].classList.add("highlight");
                icon.parentElement.parentElement.contentEditable = "true";
                icon.classList.add("is-hidden");
                icon.nextElementSibling.classList.remove("is-hidden")
            })
        });

        valid.forEach(function (icon) {
            icon.addEventListener("click", function () {
                icon.parentElement.parentElement.cells[1].classList.remove("highlight");
                icon.parentElement.parentElement.contentEditable = "false";
                icon.classList.add("is-hidden");
                icon.previousElementSibling.classList.remove("is-hidden")
                const id = icon.parentElement.parentElement.id;
                modifyMarque(id, getTableValuesM)
            })
        })
    };

    const modifyMarque = function modifyMarque(marqueId, clbk) {

        doAjax(url + "api/v1/marques", "PATCH", function (result) {
                getFullProducts();
                hideShow(showProd)
                window.console.log(JSON.parse(result));
            },
            clbk(marqueId));
    };

    const getTableValuesM = function getTableValues(id) {
        var tr = document.getElementById(id);
        var extractId = id.slice(7);
        const nom = tr.cells[1].innerHTML.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g, "");
        const id_marque = extractId;
        const obj = {
            id: id_marque,
            nom: nom,
        };
        return obj;
    };

    const deleteMarque = function deleteMarque() {
        getId(checkboxChecked('#tbodyMarques input'));
        var choice = prompt("!!!! ATTENTION !!!!" + "\n " + "Si vous décidez de supprimer une marque, tous les produits associé seront supprimé." + "\n" + "V pour valider");

        if (choice === null) {
            window.console.log("on fait rien");
        } else if (choice.toLowerCase() === "v") {
            var extractId = [];

            tableauId.forEach(function (id) {
                extractId.push(id.slice(7))
            })
            window.console.log(extractId);
            doAjax(url + "api/v1/marques", "DELETE", function (result) {
                window.console.log(result);
                getFullProducts();
                hideShow(showProd)
            }, {
                ids: extractId
            });

            var options = document.querySelectorAll('#formProd option');
            options.forEach(function (option) {
                extractId.forEach(function (id) {
                    if (id === option.value) {
                        option.remove()
                    }
                })
            });

            tableauId.forEach(function (id) {
                var tr = document.getElementById(id);
                tr.remove()
            });

        } else {
            window.console.log("on fait rien");
        }

    };

    //crud marques fin =========>

    const eventHandler = function eventHandler() {
        //////////////////Produits///////////////////
        dom.show.addEventListener("click", getFullProducts);
        dom.hide.addEventListener("click", function () {
            hideShow(showProd)
        });
        dom.check.addEventListener("change", function () {
            bossCheck(dom.check, '#tbodyProd input')
        })
        dom.plus.addEventListener("click", function () {
            showForm(dom.form);
        });
        dom.btn_form.addEventListener("click", addProduct);
        dom.delete.addEventListener("click", deleteProduct);

        //////////////////Marques///////////////////

        dom.checkM.addEventListener("change", function () {
            bossCheck(dom.checkM, '#tbodyMarques input')
        });

        dom.showM.addEventListener("click", function () {
            hideShow(showMarques)
        });
        dom.hideM.addEventListener("click", function () {
            hideShow(showMarques)
        });
        dom.plusM.addEventListener("click", function () {
            showForm(dom.formM);
        });
        dom.deleteM.addEventListener("click", deleteMarque);
        dom.btn_form_M.addEventListener("click", addMarque);

        eventModifValidM("#tbodyMarques i.modify", "#tbodyMarques i.valid");



    };

    var start = function () {
        ///////////////////produits//////////// 
        //tableau
        dom.table = document.getElementById('tableProd');
        dom.tbody = document.getElementById('tbodyProd');
        //icons tableau 
        dom.show = document.getElementById('showProd');
        dom.hide = document.getElementById('hideProd');
        dom.plus = document.getElementById('plusProd');
        dom.delete = document.getElementById('deleteProd');
        dom.check = document.querySelector('#tableProd thead input');
        //formulaire
        dom.form = document.getElementById('formProd');
        //formulaire inputs
        dom.nom = document.getElementById('nom');
        dom.marque = document.getElementById('marques');
        dom.description = document.getElementById('description');
        dom.prix = document.getElementById('prix');
        //btn form
        dom.btn_form = document.getElementById('btn_form');

        ///////////////////Marques//////////// 
        //tableau
        dom.tableM = document.getElementById('tableMarques');
        dom.tbodyM = document.getElementById('tbodyMarques');

        //icons tableau
        dom.showM = document.getElementById('showMarques');
        dom.hideM = document.getElementById('hideMarques');
        dom.plusM = document.getElementById('plusMarques');
        dom.deleteM = document.getElementById('deleteMarques');
        dom.checkM = document.querySelector('#tableMarques thead input');

        //formulaire
        dom.formM = document.getElementById('formMarques');
        //formulaire inputs
        dom.nomM = document.getElementById('nomMarque');
        dom.btn_form_M = document.getElementById('btn_form_M');



        showProd.push(dom.show);
        showProd.push(dom.hide);
        showProd.push(dom.table);
        showMarques.push(dom.showM);
        showMarques.push(dom.hideM);
        showMarques.push(dom.tableM);
        eventHandler();
    };
    document.addEventListener("DOMContentLoaded", start);
}());
