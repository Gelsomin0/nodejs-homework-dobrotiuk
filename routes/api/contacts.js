const express = require('express');
const ctrlFunc = require('../../controllers/contacts');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const bodyContactSchema = require('../../shemas/contactBodyShema');
const contactBodyValidate = require('../../decorators/contactBodyValidate');

const contactBodyValidateSchema = contactBodyValidate(bodyContactSchema);

const router = express.Router();

router.get('/', ctrlFunc.getAll);

router.get('/:contactId', ctrlFunc.getById);

router.post('/', isEmptyBody, contactBodyValidateSchema, ctrlFunc.addNewContact);

router.delete('/:contactId', ctrlFunc.deleteCurrentContact);

router.put('/:contactId', isEmptyBody, contactBodyValidateSchema, ctrlFunc.updateCurrentContact);

module.exports = router;
