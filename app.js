'use strict'
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(morgan('dev'));

require('./config/routes.js')(app);

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        success: false,
        message: err.message,
        error: err
    });
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('app running on port '+ port);
});

exports = module.exports = app;
