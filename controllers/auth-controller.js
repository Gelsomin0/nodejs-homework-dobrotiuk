const ctrlWrapper = require("../decorators/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const { User } = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');
const sendEmail = require('../helpers/sendMail');

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
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationToken,
    });

    const emailVerificationData = {
        to: newUser.email,
        subject: 'Account verification',
        html: `
            <strong>To verify your accont, please
                <a href='http://localhost:3001/api/users/verify/${verificationToken}'>
                    click here
                </a>
            </strong>
        `
    }

    await sendEmail(emailVerificationData);

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

    if (!user.verify) {
        throw HttpError(401, 'Email is not already verifyed');
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

const verifyUser = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        throw HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });

    res.json({ message: 'Verification successful' });
}

const resendEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(404);
    }

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const emailVerificationData = {
        to: user.email,
        subject: 'Account verification',
        html: `
            <strong>To verify your accont, please
                <a href='http://localhost:3001/api/users/verify/${user.verificationToken}'>
                    click here
                </a>
            </strong>
        `
    }

    await sendEmail(emailVerificationData);

    res.json({ message: 'Verification email sent' });
}

module.exports = {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    currentUser: ctrlWrapper(currentUser),
    logout: ctrlWrapper(logout),
    addAvatar: ctrlWrapper(addAvatar),
    verifyUser: ctrlWrapper(verifyUser),
    resendEmail: ctrlWrapper(resendEmail),
}