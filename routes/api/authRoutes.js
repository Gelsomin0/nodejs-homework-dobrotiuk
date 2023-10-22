const express = require('express');
const authCtrl = require('../../controllers/auth-controller');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const validateBody = require('../../decorators/validateBody');
const { userSignupSchema, userLoginSchema } = require('../../models/Users');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');

const userSignupValidate = validateBody(userSignupSchema);
const userLoginValidate = validateBody(userLoginSchema);

const authRoutes = express.Router();

authRoutes.post('/register', isEmptyBody, userSignupValidate, authCtrl.signup);

authRoutes.post('/login', isEmptyBody, userLoginValidate, authCtrl.login);

authRoutes.get('/current', authenticate, authCtrl.currentUser);

authRoutes.post('/logout', authenticate, authCtrl.logout);

authRoutes.patch('/avatars', upload.single('avatar'), authenticate, authCtrl.addAvatar);

module.exports = authRoutes;