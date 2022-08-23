const { Sequelize, Model } = require('sequelize');
const env = require('dotenv').config();
//
const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

db.authenticate()
    .then(() => {
        console.log('Connect server successfull!!!');
    });

module.exports = db