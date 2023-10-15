const ctrlWrapper = require("../decorators/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const { User } = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env; 

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, `Email in use`);
    }

    const hashPassword = await bcrypt.hash(password, 10); 

    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    
    if (!comparedPassword) {
        throw HttpError(401, 'Email or password is wrong');
    }
    
    const payload = { id: user._id };
    
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: { email, subscription: user.subscription }
    });
}

const currentUser = async (req, res) => {
    const { email } = req.user;
    const { subscription } = await User.findOne({ email });

    res.json({ email, subscription });
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.status(204).json();
}

module.exports = {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout),
}