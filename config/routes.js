'use strict'

const AuthContoller = require('../controllers/AuthController');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Welocome to orlito Auth API',
        });
    });

    app.get('/email/:email', AuthContoller.checkEmail);
}