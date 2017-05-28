'use strict'

const CompanyDomain = require('../models/CompanyDomain');
const Employee =  require('../models/Employee');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../lib/JwtHelper')

exports.checkEmail = (req, res) => {

    let domain = req.params.email.split('@')[1];

    checkRegisteredEmail({domain:domain, email:req.params.email}, (data) => {
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
            CompanyDomain.getDomainNameRegistered(domain, (err, data) => {
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
};



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
};

exports.signup = (req, res) => {
    
    req.checkBody(schema);
    req.getValidationResult().then(function(results) {

        if(!results.isEmpty()) {
            res.json({
                success : false,
                message : results.mapped()
            });
            return;
        }

        Company.getCompanyByCode(req.body.company_code, (err, data) => {
            if(data !== null) {
                CompanyDomain.getDomainNameRegistered(req.body.email.split('@')[1], (err, data) => {

                    let employee_email = (data !== null) ? {corporate_email: req.body.email, personal_email:''} : {corporate_email : '', personal_email : req.body.emai};
                    let data_employee = {
                        password : req.body.password,
                        name : req.body.employee_name,
                        corporate_email : employee_email.personal_email,
                        personal_email : employee_email.corporate_email,
                        company_id : data.results.company_id,
                        activation_url : new Buffer(data.results.company_id +'-'+ require('moment').unix()).toString('base64')
                    };
                    Employee.addEmployee(data_employee, (err, data) => {
                        if(data !== null)
                        {
                            let payload = {employee_id:data.results, company_id:data_employee.company_id, employee_name:data_employee.name};
                            res.json({
                                success:true,
                                data: {
                                    employee_id : data.results
                                },
                                token : jwtHelper.Encrypt(JSON.stringify(payload)),
                                message : 'signup success'
                            });

                            require('../lib/emailHelper').sendMail(data_employee.activation_url, req.body.email);
                        }
                        else
                        {
                            res.json({
                                success : false,
                                message : 'error on creting user'
                            });
                        }
                    });
                });
            }
            else
            {
                res.json({
                    success : false,
                    message : 'invalid company code'
                });
            }
        });
        
    });
};

exports.activate = (req, res) => {
    Employee.getEmployeeActivationUrl(req.params.urlcode, (err, data) => {
        if(data!==null)
        {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(data.results.password, salt, (err, hash) => {
                    Employee.editEmployee({id:data.results.id, set:{activation_url:1, is_active:1, password:hash}}, (err, data) => {
                        if(data !== null)
                        {
                            res.json({
                                success : true,
                                message : 'activation success'
                            });
                        }
                        else
                        {
                            res.json({
                                success : false,
                                message : 'activation failed'
                            });
                        }
                    });
                });
            });
        }
        else
        {
            res.json({
                success : false,
                message : 'invalid'
            });
        }
    });
}

let checkRegisteredEmail = (data, callback) => {
    let email = data.email;
    CompanyDomain.getDomainAndEmployeeByEmail({domain:data.domain, email:email}, (err, data) => {
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
};

let checkRegisteredCode = (data, callback) => {
    Company.getCompanyByCode(data, (err, data) => {
        if(data !== null) {
            CompanyDomain.getDomainNameRegistered(data, (err, data) => {
                callback((data !== null) ? {used_mail : Employee.USED_MAIL_CORPORATE } : {used_mail : Employee.USED_MAIL_PERSONAL});
            });
        }
        callback(null);
    });
}

let schema = {
    'email': {
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    'password': {
        notEmpty: true,
        errorMessage: 'password cannot blank' // Error message for the parameter
    },
    'company_code' : {
        notEmpty : false,
        errorMessage : 'company code cannot empty'
    },
    'employee_name' : {
        notEmpty : true,
        errorMessage : 'name code cannot empty'
    }
};