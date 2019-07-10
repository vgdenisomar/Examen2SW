const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

function routerInit(db) {

    var incidentesStruct = {
        "descripcion": '',
        "fechaYhora": new Date().getTime(),
        "tipo": '',
        "estado": '',
        "usuarioRegistra": '',
        "usuarioAsignado": '',
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

    router.get('/:id', (req, res, next)=>{
        var query = {"_id": new ObjectID(req.params.id)}
        incidentesCollection.findOne(query, (err, doc)=>{
          if(err) {
            console.log(err);
            return res.status(401).json({"error":"Error al extraer documento"});
          }
          return res.status(200).json(doc);
        });
      });

    router.post('/', (req, res, next) => {
        var newElement = Object.assign({},
            incidentesStruct,
            req.body,
            {
                "estado": "registrado",
            }
        );

        incidentesCollection.insertOne(newElement, {}, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(404).json({ "error": "No se pudo Insertar el incidente" });
            }

            return res.status(200).json({ "n": result.insertedCount, "obj": result.ops[0] });
        });
    });

    router.put('/asign/:id', (req, res, next) => {
        var query = {"_id": new ObjectID(req.params.id)};
        var update = { "$set":{"estado": "asignado", "fechaHoraAsignado":new Date().getTime(), "usuarioAsignado":req.body.usuarioAsignado}};
        incidentesCollection.updateOne(query, update, (err, rst) => {
          if(err){
            console.log(err);
            return res.status(400).json({"error": "Error al actualizar documento"});
          }
          return res.status(200).json(rst);
        }); 
      });

      router.put('/close/:id', (req, res, next) => {
        var query = {"_id": new ObjectID(req.params.id)};
        var update = { "$set":{"estado": "cerrado", "fechaHoraCerrado":new Date().getTime(), "usuarioRegistra":req.body.usuarioRegistra}};
        incidentesCollection.updateOne(query, update, (err, rst) => {
          if(err){
            console.log(err);
            return res.status(400).json({"error": "Error al actualizar documento"});
          }
          return res.status(200).json(rst);
        }); 
      });

            
      router.delete('/:id', (req, res, next) => {
        var query = { "_id": new ObjectID(req.params.id) };
        incidentesCollection.removeOne(query, (err, rslt) => {
          if (err) {
            console.log(err);
            return res.status(404).json({ "error": "No se pudo eliminar el incidente" });
          }
    
          return res.status(200).json(rslt);
        })
    }); // delete


    return router

}

module.exports = routerInit;
