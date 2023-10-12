const express = require('express');
const ctrlFunc = require('../../controllers/contacts');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const { bodyContactSchema, contactFavoriteSchema } = require('../../shemas/contactBodyShema');
const validateBody = require('../../decorators/validateBody');
const isValidId = require('../../middlewares/isValidId');
const authenticate = require('../../middlewares/authenticate');

const contactBodyValidateSchema = validateBody(bodyContactSchema);
const contactFavoriteSchemaDecor = validateBody(contactFavoriteSchema);

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlFunc.getAll);

router.get('/:contactId', isValidId, ctrlFunc.getById);

router.post('/', isEmptyBody, contactBodyValidateSchema, ctrlFunc.addNewContact);

router.delete('/:contactId', isValidId, ctrlFunc.deleteCurrentContact);

router.put('/:contactId', isValidId, isEmptyBody, contactBodyValidateSchema, ctrlFunc.updateCurrentContact);

router.patch('/:contactId/favorite', isValidId, contactFavoriteSchemaDecor, ctrlFunc.updateStatusContact);

module.exports = router;
