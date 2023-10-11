const express = require('express');
const ctrlFunc = require('../../controllers/contacts');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const { bodyContactSchema, contactFavoriteSchema } = require('../../shemas/contactBodyShema');
const contactBodyValidate = require('../../decorators/contactBodyValidate');
const isValidId = require('../../middlewares/isValidId');

const contactBodyValidateSchema = contactBodyValidate(bodyContactSchema);
const contactFavoriteSchemaDecor = contactBodyValidate(contactFavoriteSchema);

const router = express.Router();

router.get('/', ctrlFunc.getAll);

router.get('/:contactId', isValidId, ctrlFunc.getById);

router.post('/', isEmptyBody, contactBodyValidateSchema, ctrlFunc.addNewContact);

router.delete('/:contactId', isValidId, ctrlFunc.deleteCurrentContact);

router.put('/:contactId', isValidId, isEmptyBody, contactBodyValidateSchema, ctrlFunc.updateCurrentContact);

router.patch('/:contactId/favorite', isValidId, contactFavoriteSchemaDecor, ctrlFunc.updateStatusContact);

module.exports = router;
