const connection = require('../conf')
const Joi = require('joi');

const db = connection.promise();

const validate = (data) => {
    return Joi.object({
        image: Joi.string().min(0).max(100),
        title: Joi.string().min(0).max(100).required(),
        description: Joi.string().min(0).required(),
        github: Joi.string().min(0).max(100),
        deploy: Joi.string().min(0).max(100),
    }).validate(data, { abortEarly: false }).error
}

const findAll = () => {
    let sql = 'SELECT * from projects'
    return db
    .query(sql)
    .then(([results]) => results)
}
    
const findOne = (id) => {
    let sql = 'SELECT * FROM projects WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([results]) => results[0])
}

const create = ({ title, description, github, deploy }) => {
    let sql = 'INSERT INTO projects (title, description, github, deploy) VALUES (?, ?, ?, ?)'
    return db
    .query(sql, [title, description, github, deploy])
    .then(([result]) => {
        const id = result.insertId
        return { id, title, description, github, deploy}
    })
}

const update = (id, newAttributes) => {
    let sql = 'UPDATE projects SET ? WHERE id = ?'
    return db
    .query(sql, [newAttributes, id])
}

const destroy = (id) => {
    let sql = 'DELETE FROM projects WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([result]) => result.affectedRows !== 0)
}

module.exports = {
    validate,
    findAll,
    findOne,
    create,
    update,
    destroy
}