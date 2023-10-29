const express = require('express');
const authCtrl = require('../../controllers/auth-controller');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const validateBody = require('../../decorators/validateBody');
const { userSignupSchema, userLoginSchema, userEmailSchema } = require('../../models/Users');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');

const userSignupValidate = validateBody(userSignupSchema);
const userLoginValidate = validateBody(userLoginSchema);
const userEmailValidate = validateBody(userEmailSchema);

const authRoutes = express.Router();

authRoutes.post('/register', isEmptyBody, userSignupValidate, authCtrl.signup);

authRoutes.post('/login', isEmptyBody, userLoginValidate, authCtrl.login);

authRoutes.get('/current', authenticate, authCtrl.currentUser);

authRoutes.post('/logout', authenticate, authCtrl.logout);

authRoutes.patch('/avatars', upload.single('avatar'), authenticate, authCtrl.addAvatar);

authRoutes.get('/verify/:verificationToken', authCtrl.verifyUser);

authRoutes.post('/verify', userEmailValidate, authCtrl.resendEmail);

module.exports = authRoutes;