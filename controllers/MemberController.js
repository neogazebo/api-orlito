'use strict'

const CompanyDomain = require('../models/CompanyDomain');
const Employee =  require('../models/Employee');
const Company = require('../models/Company');
const orlito = require('../lib/orlito');

exports.getProfile = (req, res) => {
    let employee_id = orlito.getEmployeeID();
    Employee.getEmployeeProfileByID(employee_id, (err, data) => {
        if(data !== null)
        {
            res.json({
                success: true,
                data : data.results
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

exports.updateProfile = (req, res) => {
    let employee_id = orlito.getEmployeeID();
    req.checkBody(schema);
    req.getValidationResult().then(function(results) {

        if(!results.isEmpty()) {
            res.json({
                success : false,
                message : results.mapped()
            });
            return;
        }

        Employee.updateProfile({id: employee_id, name:req.body.name, gender: req.body.gender}, (err, data) => {
            if(data !== null)
            {
                res.json({
                    success: true,
                    data : {
                        employee_id : employee_id,
                        employee_name : req.body.name
                    }
                });
            }
            else
            {
                res.json({
                    success: false,
                    message: 'cannot update profile'
                });
            }
        });
    });
};


let schema = {
    'gender': {
        notEmpty: true,
        errorMessage: 'gender cannot blank' // Error message for the parameter
    },
    'name' : {
        notEmpty : true,
        errorMessage : 'employee name cannot empty'
    }
};