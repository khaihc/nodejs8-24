const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var parseOData = require("odata-sequelize");
var sequelize = require("sequelize");

const env = require('dotenv').config();

exports.getUsers = (req, res, next) => {
    const query = parseOData(
        "$filter=deleted ne 'true'&$orderby=fullname desc",
        sequelize
      );
    userModel.findAll(query)
        .then(listUser => {
            console.log('listUser: ', listUser)
            res.status(200).json({
                message: 'Get all user',
                listUser: listUser,
                length: listUser.length
            })
        })
        .catch(err => {
            res.status(500).send({
                message11: err.message
            });
            next();
        });
}

exports.getUserById = (req, res, next) => {
    const userId = req.params.userIdemail;
    console.log('userId: ', userId);
    userModel.findByPk(userId)
        .then(user => {
            if (!user) {
                res.status(201).json({
                    status: false
                });
            } else {
                res.status(201).json({
                    status: true,
                    user: user
                });
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createUser = (req, res, next) => {
    const _email = req.body.email;
    const _password = req.body.password;
    userModel
        .findOne({where: {email: _email}})
        .then(user => {
            if(user){
                res.status(201).json({
                    status: false,
                    message: 'Email exist!!!'
                })
            }
            return bcrypt.hash(_password, 12);
        })
        .then(hashedPassword => {
            const _user = new userModel({
                email: _email,
                fullname: req.body.fullname,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
                password: hashedPassword,
                deleted : req.body.deleted
            });
            return _user.save();
        })
        .then(user => {
            res.status(201).json({
                status: true,
                message: 'Successfully added new user!!!',
                user: user
            });
        })
        .catch(function(err){
            res.status(404).json({
                status: false,
                err: err
            });
        })
}

exports.updateUser = (req, res, next) => {
    const _email = req.body.email;
    const _password = req.body.password;
    userModel
        .findOne({where: {email: _email}})
        .then(user => {
            if(!user){
                res.status(201).json({
                    status: false,
                    message: 'Email does not exist!!!'
                })
            }
            return bcrypt.hash(_password, 12);
        })
        .then(hashedPassword => {
            const _user = new Object({
                email: _email,
                fullname: req.body.fullname,
                phone: req.body.phone,
                age: req.body.age,
                gender: req.body.gender,
                password: hashedPassword,
                deleted : req.body.deleted

            });
            return userModel.update(_user, {where: {email: _user.email}})
        })
        .then(num => {
            if(num == 1){
                return res.status(201).json({
                    status: true,
                    message: 'User updated successfull!!!',
                    user: num
                });
            }else {
                return res.status(201).json({
                    status: false,
                    message: 'User update failed!!!',
                    user: num
                });
            }
            
        })
        .catch(function(err){
            res.status(404).json({
                status: false,
                err: err
            });
        })
}

exports.delUserByID = (req, res, next) => {
    const userId = req.params.userIdemail;
    console.log('userId: ', userId);
    userModel.findByPk(userId)
        .then(user => {
            if (!user) {
                res.status(201).json({
                    status: false
                });
            } else {
                userModel
                    .destroy({
                        where: {email:userId}
                    })
                    .then((result) => {
                        res.status(201).json({
                            status: true,
                            message: 'Deleted user successfull!!!',
                        });
                    });
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.checklogin = (req, res, next) => {
    const _email = req.body.email;
    const _password = req.body.password;
    userModel.findOne({where:{email:_email}})
        .then(user => {
            if (!user) {
                res.status(201).json({
                    status: false,
                    message: 'Invalid email or password'
                });
            } 
            return Promise.all([bcrypt.compare(_password, user.password), user]);
        })
        .then(result => {
            const isMatch = result[0];
            const user = result[1];
            console.log(user);
            if(!isMatch){
                //Invalid password 
                return res.status(200).json({
                    status: false,
                    message: 'Invalid email or password'
                });
            }
            const payLoad = {
                email: user.email
            }
            return jwt.sign(payLoad, process.env.ACCESS_TOKEN,{expiresIn: 36000});
        })
        .then(token => {
            return res.status(200).json({
                status: true,
                message: 'Login successful!!!',
                token: token
            });
        })
        .catch(err => {
            return res.status(500).json({err})
        })
}