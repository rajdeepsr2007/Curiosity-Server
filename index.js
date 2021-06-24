const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const http=require('http');

const db=require('./config/mongoose');
const passport = require('passport');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(passport.initialize());
app.use(express.static('./assets/'))
app.use('/uploads' , express.static('./uploads'))
app.use('/',require('./routes'));

const PollServer = http.createServer(app);
const PollSocket = require('./config/pollSocket').createPollServer(PollServer)
PollServer.listen(process.env.CURIOSITY_POLL_PORT || 5000);

app.listen( port , ( err ) => {
    if( err ){
        console.log('Error in starting server')
    }else{
        console.log('Server up and running on port',port);
    }
} )