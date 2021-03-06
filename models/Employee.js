'use strict'

const db = require('../config/database');
exports.getEmployeeByEmail = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select "" as corporate_email, personal_email from employee where is_active = 1 and personal_email = ? limit 1';

        connection.query(statement, [data], (error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

};

exports.getEmployeeActivationUrl = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select id, corporate_email, personal_email, password from employee where activation_url = ? limit 1';

        connection.query(statement, [data], (error, results, fields) => {
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
        + '(employee.personal_email = ? or employee.corporate_email = ?) '
        + 'limit 1';

        connection.query(statement, [data, data],(error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });
};

exports.addEmployee = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        connection.query('insert into employee set ?', data, (error, results) => {
            if (error) throw error;
            callback(null, {results:results.insertId})
            connection.release();
        });
    });
};

exports.editEmployee = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        let statement = 'update employee set activation_url = ?, is_active = ?, password = ? where id = ?';
        connection.query(statement, [data.set.activation_url, data.set.is_active, data.set.password, data.id], (error, results) => {
            if (error) throw error;
            callback(null, {results:results})
            connection.release();
        });
    });
};

exports.getEmployeeProfileByID = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        let statement = 'select employee.name as name,'
        +' employee.gender as gender,'
        +' employee.corporate_email as corporate_email,'
        +' employee.personal_email as personal_email,'
        +' company.name as company_name'
        +' from employee '
        +' left join company on company.id = employee.company_id '
        +' where employee.is_active = 1'
        +' and company.is_active = 1'
        +' and employee.id = ?'
        +' limit 1';

        connection.query(statement, [data],(error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });
}

exports.updateProfile = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        let statement = 'update employee set name = ?, gender = ? where id = ?';
        connection.query(statement, [data.name, data.gender, data.id], (error, results) => {
            if (error) throw error;
            callback(null, {results:results})
            connection.release();
        });
    });
};
