'use strict'

const AuthContoller = require('../controllers/AuthController');
const MemberController = require('../controllers/MemberController');
const JWTAuth = require('../middleware/jwtauth');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.json({
            success: true,
            message: 'Welocome to orlito Auth API',
        });
    });

    app.get('/checktoken/', [JWTAuth], (req, res) => {
        res.send('token valid');
    });

    app.get('/checkemail/:email', AuthContoller.checkEmail);
    app.post('/login/', AuthContoller.login);
    app.post('/signup/',AuthContoller.signup);
    app.get('/activate/:urlcode',AuthContoller.activate);

    app.get('/member/profile/', [JWTAuth], MemberController.getProfile);
    app.post('/member/profile/', [JWTAuth], MemberController.updateProfile);
}