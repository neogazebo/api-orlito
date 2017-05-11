'use strict'

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Welocome to orlito Auth API',
        });
    });

}