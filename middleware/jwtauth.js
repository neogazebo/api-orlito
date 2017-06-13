'use strict';

const jwtHelper = require('../lib/JwtHelper');
const orlito = require('../lib/orlito');

module.exports = (req, res, next) => {

	let token = req.headers['x-access-token'];

	if (token) {
		jwtHelper.Decrypt(token, function(err, decoded){

			  if (err) {
			    return res.json({ success: false, message: 'Failed to authenticate token.' });    
			  } else {
			    req.decoded = decoded;
					orlito.setTokenData(decoded.data);
			    next();
			  }
		})

	} else {
		return res.status(403).send({ 
		    success: false, 
		    message: 'No token provided.' 
		});

	}	
};
