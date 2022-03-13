const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
const util = require('util');

module.exports = async (req,res,next) =>{

    const {token} = req.headers

    const secretKey = "my_secret_key";
    const verifyAsync = util.promisify(jwt.verify);
    try {

        await verifyAsync(token,secretKey);
        next();
    } catch (error) {
        // error = error + 'access Denied';
        next(error);
    }
}