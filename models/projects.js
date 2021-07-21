const connection = require('../conf')

const db = connection.promise();

const findAll = () => {
    let sql = 'SELECT * from projects'
    return db
    .query(sql)
    .then(([results]) => results)
    }

module.exports = {
    findAll
}