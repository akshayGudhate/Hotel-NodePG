const jwt = require('jsonwebtoken');                // jwt - authentication
// env
require('dotenv').config();
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;      // env - access token


/////////////////////////
//    generate token   //
/////////////////////////

const generateToken = async (owner) => {
    return jwt.sign(owner, ACCESS_TOKEN, { expiresIn: '12h' });
};


/////////////////////////
//     authenticate    //
/////////////////////////

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.status(400).json({
                status: false,
                info: 'Please add authentication token!'
            });
        };
        // if token exist verify
        const owner = jwt.verify(token, ACCESS_TOKEN);
        req.owner = owner;

        next();

    } catch (err) {
        console.log(err);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: false,
                info: err.name
            });
        };

        return res.status(500).json({
            status: false,
            info: err.message
        });
    }
};



module.exports = { generateToken, authenticateToken };