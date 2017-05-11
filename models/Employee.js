'use strict'

const db = require('../config/database');

var getEmployeeByEmail = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select personal_email from employee where is_active = 1 and personal_email = "' + data +'" limit 1';

        connection.query(statement, function (error, results, fields) {
            if (error) throw error;

            console.log(results);

            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

}

module.exports = {
    getEmployeeByEmail : getEmployeeByEmail
}