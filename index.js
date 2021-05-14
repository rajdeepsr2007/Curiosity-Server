const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

const db=require('./config/mongoose');
const passport = require('passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/',require('./routes'));

app.listen( port , ( err ) => {
    if( err ){
        console.log('Error in starting server')
    }else{
        console.log('Server up and running on port',port);
    }
} )