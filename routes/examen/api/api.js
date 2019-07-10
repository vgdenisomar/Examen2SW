const express = require('express');
const router= express.Router();


function routerInit(db){
    const clasesApi = require('./incidentes')(db);
    router.use('/incidentes', clasesApi);

    return router
    
}

module.exports=routerInit;
