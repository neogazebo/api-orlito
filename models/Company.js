'use strict'

const db = require('../config/database');

exports.getCompanyByCode = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select company.id from company where code = ? limit 1';

        connection.query(statement, [data], (error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

};