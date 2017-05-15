'use strict'

const db = require('../config/database');

let getDomainAndEmployeeByEmail = (data, callback) => {

    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select employee.corporate_email, "" as personal_email '
        + 'from company_domain '
        + 'left join company on company.id = company_domain.company_id '
        + 'left join employee on company.id = employee.company_id '
        + 'where company_domain.name = ? '
        + 'and employee.corporate_email = ? limit 1';

        connection.query(statement, [data.domain, data.email], (error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });

}

let getDomainNameRegistered = (data, callback) => {
    db.connection.getConnection( (err, connection) => {
        
        let statement = 'select company_domain.name as domain, company.code, company.id as company_id '
        + 'from company_domain '
        + 'left join company on company.id = company_domain.company_id '
        + 'where company_domain.name = ? '
        + ' limit 1';

        connection.query(statement, [data], (error, results, fields) => {
            if (error) throw error;
            callback(null, (results.length > 0 ? {results : results[0], meta : null} : null ));
            connection.release();
        });
    });
}

module.exports = {
    getDomainAndEmployeeByEmail : getDomainAndEmployeeByEmail,
    getDomainNameRegistered : getDomainNameRegistered
}