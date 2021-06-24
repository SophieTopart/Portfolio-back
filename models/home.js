const connection = require('../conf')

const db = connection.promise();

const findAll = () => {
    let sql = 'SELECT * from makeup'
    return db
    .query(sql)
    .then(([results]) => results)
    }

module.exports = {
    findAll
}