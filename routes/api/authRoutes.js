const express = require('express');
const authCtrl = require('../../controllers/auth-controller');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const validateBody = require('../../decorators/validateBody');
const { userSignupSchema } = require('../../models/Users');
const authenticate = require('../../middlewares/authenticate');

const userSignupValidate = validateBody(userSignupSchema);

const authRoutes = express.Router();

authRoutes.post('/signup', isEmptyBody, userSignupValidate, authCtrl.signup);

authRoutes.post('/login', authCtrl.login);

authRoutes.get('/current', authenticate, authCtrl.currentUser);

authRoutes.post('/logout', authenticate, authCtrl.logout);

module.exports = authRoutes;