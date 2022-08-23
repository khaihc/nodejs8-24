const { Sequelize, DataTypes } = require('sequelize');
const db = require('./database')
const User = db.define('Users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    age: {
        type: DataTypes.INTEGER
    },
    gender: {
        type: DataTypes.BOOLEAN
    },
    password: {
        type: DataTypes.STRING
    },
    deleted: {
        type: DataTypes.BOOLEAN
    },
});
db.sync();

module.exports = User
