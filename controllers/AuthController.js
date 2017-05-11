'use strict'

const CommanyDomain = require('../models/CompanyDomain');
const Employee =  require('../models/Employee');
const bcrypt = require('bcryptjs');

exports.checkEmail = (req, res) => {

    let domain = req.params.email.split('@')[1];

    checkRegistered({domain:domain, email:req.params.email}, (data) => {
        if(data !== null)
        {

            // todo generate token
            
            res.json({
                success: true,
                data : {
                    token : 'asdasdsa'
                },
                message: 'employee registered'
            });
        }
        else
        {
            CommanyDomain.getDomainNameRegistered(domain, (err, data) => {
                if(data !== null)
                {
                    res.json({
                        success: true,
                        message: 'domain registered'
                    });
                }
                else 
                {
                    res.json({
                        success: false,
                        message: 'domain not registered'
                    });
                }

                //todo send email activation

            });
        }
    });
}

function checkRegistered(data, callback){
    let email = data.email;
    CommanyDomain.getDomainAndEmployeeByEmail({domain:data.domain, email:email}, (err, data) => {
        if (data === null) {
            Employee.getEmployeeByEmail(email, (err, data) => {
                if (data !== null) {
                    callback(data.results);
                }
                else callback(null);
            });
        }
        else callback(data.results);

    });
}

exports.login = (req, res) => {
    let password = req.body.password;

    Employee.getEmployeeByAllEmail(req.body.email, (err, data) => {
        if(data !== null)
                {
                    let password_hash = data.results.password;

                    bcrypt.compare(password, password_hash).then(function(result) {
                        if(result) {
                            res.json({
                                success: true,
                                message: 'login success'
                            });
                        }
                        else {
                            res.json({
                                success: false,
                                message: 'invalid password'
                            });
                        }
                    });
                }
                else 
                {
                    res.json({
                        success: false,
                        message: 'invalid email'
                    });
                }
    });
}