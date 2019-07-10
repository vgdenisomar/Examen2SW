const express = require('express');
const router = express.Router();


function routerInit(db) {

    var incidentesStruct = {
        "descripcion": '',
        "fechaYhora": new Date().getTime(),
        "tipo": '',
        "estado": '',
        "usuarioRegistra": '',
        "usuarioRegistra": '',
        "fechaHoraAsignado": '',
        "fechaHoraCerrado": ''
    };



    var incidentesCollection = db.collection('incidentes');
    router.get('/', (req, res, next) => {
        incidentesCollection.find().toArray((err, plantas) => {
            if (err) return res.status(200).json([]);
            return res.status(200).json(plantas);
        });
    });

    router.post('/', (req, res, next) => {
        var newElement = Object.assign({},
            incidentesStruct,
            req.body,
        );

        incidentesCollection.insertOne(newElement, {}, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(404).json({ "error": "No se pudo Insertar el incidente" });
            }

            return res.status(200).json({ "n": result.insertedCount, "obj": result.ops[0] });
        });
    });

    return router

}

module.exports = routerInit;
