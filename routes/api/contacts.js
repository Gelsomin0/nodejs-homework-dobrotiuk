const express = require('express');
const ctrlFunc = require('../../controllers/contacts');
const isEmptyBody = require('../../middlewares/isEmptyBody');
const bodyContactSchema = require('../../shemas/contactBodyShema');
const contactBodyValidate = require('../../decorators/contactBodyValidate');
const isValidId = require('../../middlewares/isValidId');

const contactBodyValidateSchema = contactBodyValidate(bodyContactSchema);

const router = express.Router();

router.get('/', ctrlFunc.getAll);

router.get('/:contactId', isValidId, ctrlFunc.getById);

router.post('/', isEmptyBody, contactBodyValidateSchema, ctrlFunc.addNewContact);

router.delete('/:contactId', isValidId, ctrlFunc.deleteCurrentContact);

router.put('/:contactId', 
isValidId, 
isEmptyBody, 
contactBodyValidateSchema, 
ctrlFunc.updateCurrentContact);

module.exports = router;
