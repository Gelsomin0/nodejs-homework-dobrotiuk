const ctrlWrapper = require("../decorators/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const { User } = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');

const { JWT_SECRET } = process.env; 
const avatarsPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, `Email in use`);
    }

    const hashPassword = await bcrypt.hash(password, 10); 
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
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

const addAvatar = async (req, res) => {
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);

    await fs.rename(oldPath, newPath);

    const user = await User.findOne({ token: req.headers.authorization.split(' ')[1] });
    const avatar = path.join('public', 'avatars', filename);

    await Jimp.read(avatar)
        .then(img => {
            return img.cover(250, 250).resize(250, 250).write(avatar);
        })

    const result = await User.findByIdAndUpdate(user._id, { ...req.body, avatarURL: avatar });

    res.json({ avatarURL: result.avatarURL });
};

module.exports = {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout),
    addAvatar: ctrlWrapper(addAvatar),
}