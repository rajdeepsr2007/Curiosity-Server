const express = require('express');
const app = express();
const port = 8000;

const db=require('./config/mongoose');
app.use(express.urlencoded());
app.use('/',require('./routes'));

app.listen( port , ( err ) => {
    if( err ){
        console.log('Error in starting server')
    }else{
        console.log('Server up and running on port',port);
    }
} )