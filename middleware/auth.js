const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

exports.authentication = (req, res, next) => {
    const token = req.header('token');
    console.log(token);
    if(!token){
        res.status(401).json({
            status: false,
            message: 'Chua duoc cap quyen truy cap'
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) =>{
        if(err){
            return res.status(500).json({
                status: false,
                message: 'Chua duoc cap quyen truy cap'
            });
        }
        req.user = user;
        console.log('user verify: ', user);
        next();
    })
}
