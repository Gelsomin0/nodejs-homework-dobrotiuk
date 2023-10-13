const HttpError = require("../helpers/HttpError");
const jwt = require('jsonwebtoken');
const { User } = require("../models/Users");
const ctrlWrapper = require('../decorators/ctrlWrapper');

const { JWT_SECRET } = process.env;

const authenticate = async(req, res, next)=> {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if(bearer !== 'Bearer') {
        throw HttpError(401);
    }

    try {
        const verifyedToken = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(verifyedToken.id);
        if(!user) {
            throw HttpError(401);
        }

        req.user = user;

        next();
    } catch(error) {
        next(HttpError(401));
    }
}

module.exports = ctrlWrapper(authenticate);