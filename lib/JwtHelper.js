'use strict';

const jwt = require('jsonwebtoken');

exports.Encrypt = (payload) => {
    return jwt.sign({
        data: payload
    }, 'b0tCh4t8OT', { 
        expiresIn: '48h' 
    });
}

exports.Decrypt = (token, callback) => {
    
    jwt.verify(token, 'b0tCh4t8OT', function(err, decoded) {
        if (err) {
            callback(true, null);
        } else {
            callback(false, decoded);
        }
    });
}