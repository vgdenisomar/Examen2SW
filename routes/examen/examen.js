const express = require('express');
const router= express.Router();


function routerInit(db){
    const clasesApi = require('./api/api')(db);
    router.use('/api', clasesApi);

    return router
    
}

module.exports=routerInit;
