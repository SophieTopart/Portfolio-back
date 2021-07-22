const connection = require('../conf')
const Joi = require('joi');
const argon2 = require('argon2');

const db = connection.promise();

const validate = (data, forCreation = true) => {
    const presence = forCreation ? 'required' : 'optional';
    return Joi.object({
        username: Joi.string().max(100).presence(presence),
        password: Joi.string().min(8).max(50).presence(presence),
    }).validate(data, { abortEarly: false }).error
}

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1
  };
  
  const hashPassword = (plainPassword) => {
    return argon2.hash(plainPassword, hashingOptions);
  };
  
  const verifyPassword = (plainPassword, hashedPassword) => {
    return argon2.verify(hashedPassword, plainPassword, hashingOptions);
  };
  

const findAll = () => {
    let sql = 'SELECT * from admin'
    return db
    .query(sql)
    .then(([results]) => results)
}

const findOne = (id) => {
    let sql = 'SELECT * FROM admin WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([results]) => results[0])
}

/*const findByUsername = ({ filters : { username } }) => {
    let sql = 'SELECT * FROM admin WHERE username = ?'
    return db
    .query(sql, [username])
    .then(([results]) => results)
}*/

const findByUsername = (username) => {
    return db
      .query('SELECT * FROM admin WHERE username = ?', [username])
      .then(([results]) => results[0]);
  };

const update = (id, newAttributes) => {
    let sql = 'UPDATE admin SET ? WHERE id = ?'
    return db
    .query(sql, [newAttributes, id])
}
  
const destroy = (id) => {
    let sql = 'DELETE FROM admin WHERE id = ?'
    return db
    .query(sql, [id])
    .then(([result]) => result.affectedRows !== 0)
}

module.exports = {
    validate,
    findAll,
    findOne,
    findByUsername,
    update,
    hashPassword,
    verifyPassword,
    destroy
}