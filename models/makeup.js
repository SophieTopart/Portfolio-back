const connection = require('../conf')
const Joi = require('joi');

const db = connection.promise();

const validate = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        product: Joi.string().max(255).presence(presence),
        price: Joi.number().min(0).presence(presence),
    }).validate(data, { abortEarly: false }).error
}

const findOne = (id) => {
    let sql = 'SELECT * FROM makeup WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([results]) => results[0])
}

const findByPrice = ({ filters : { price } }) => {
    let sql = 'SELECT * FROM makeup WHERE price <= ?'
    return db
    .query(sql, [price])
    .then(([results]) => results)
}

const create = ({product, price}) => {
    let sql = 'INSERT INTO makeup (product, price) VALUES (?, ?)'
    return db
    .query(sql, [product, price])
    .then(([result]) => {
        const id = result.insertId
        return { id, product, price }
    })
}

const update = (id, newAttributes) => {
    let sql = 'UPDATE makeup SET ? WHERE id = ?'
    return db
    .query(sql, [newAttributes, id])
}

const destroy = (id) => {
    let sql = 'DELETE FROM makeup WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([result]) => result.affectedRows !== 0)
}

module.exports = {
    validate,
    findOne,
    findByPrice,
    create,
    update,
    destroy
}