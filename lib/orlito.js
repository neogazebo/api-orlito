'use strict'

let employee_id;
let tokenData;

exports.setTokenData = (data) => {
    tokenData = JSON.parse(data);
    employee_id = tokenData.employee_id;
}

exports.getEmployeeID = () => {
    return employee_id;
}