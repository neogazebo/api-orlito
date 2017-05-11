'use strict'

const db = require('../config/database');

let getDomainAndEmployeeByEmail = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select employee.corporate_email '
        + 'from company_domain '
        + 'left join company on company.id = company_domain.company_id '
        + 'left join employee on company.id = employee.company_id '
        + 'where company_domain.name = "' + data.domain +'" '
        + 'and employee.corporate_email = "' + data.email +'" limit 1';

        connection.query(statement, function (error, results, fields) {
            if (error) throw error;

            console.log(results);

            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

}

let getDomainNameRegistered = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select name '
        + 'from company_domain '
        + 'where company_domain.name = "' + data +'" '
        + ' limit 1';

        connection.query(statement, function (error, results, fields) {
            if (error) throw error;

            console.log(results);

            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });
}

module.exports = {
    getDomainAndEmployeeByEmail : getDomainAndEmployeeByEmail,
    getDomainNameRegistered : getDomainNameRegistered
}