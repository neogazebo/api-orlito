'use strict'

const db = require('../config/database');

exports.getEmployeeByEmail = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select personal_email from employee where is_active = 1 and personal_email = "' + data +'" limit 1';

        connection.query(statement, function (error, results, fields) {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

};

exports.getEmployeeCredential = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select employee.id, employee.password, employee.company_id, employee.name '
        + 'from employee '
        + 'where is_active = 1 and '
        + '(employee.personal_email = "' + data +'" '
        + 'or employee.corporate_email = "' + data +'") '
        + 'limit 1';

        connection.query(statement, function (error, results, fields) {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });
};