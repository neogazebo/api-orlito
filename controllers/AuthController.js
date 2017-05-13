'use strict'

const CommanyDomain = require('../models/CompanyDomain');
const Employee =  require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../lib/JwtHelper')

exports.checkEmail = (req, res) => {

    let domain = req.params.email.split('@')[1];

    checkRegistered({domain:domain, email:req.params.email}, (data) => {
        if(data !== null)
        {   
            res.json({
                success: true,
                data : data,
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
                        data : data.results,
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
            });
        }
    });
}



exports.login = (req, res) => {
    let password = req.body.password;

    Employee.getEmployeeCredential(req.body.email, (err, data) => {
        if(data !== null)
                {
                    let password_hash = data.results.password;

                    bcrypt.compare(password, password_hash).then(function(isValid) {
                        if(isValid) {
                            let payload = {employee_id:data.results.id, company_id:data.results.company_id, employee_name:data.results.name};
                            res.json({
                                success: true,
                                message: 'login success',
                                token : jwtHelper.Encrypt(JSON.stringify(payload))
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