const ctrlWrapper = require("../decorators/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const { 
    listContacts, 
    getContactById, 
    addContact, 
    removeContact, 
    updateContact 
} = require("../models/contacts");

const getAll = async (req, res) => {
    const result = await listContacts();
    res.json(result); 
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await getContactById(contactId);
    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json(result);
}

const addNewContact = async (req, res) => {
    const result = await addContact(req.body);
    res.status(201).json(result);
}

const deleteCurrentContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    
    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json({message: 'contact deleted'});
}

const updateCurrentContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) throw HttpError(404, 'Not found');

    res.json(result);
}


module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addNewContact: ctrlWrapper(addNewContact),
    deleteCurrentContact: ctrlWrapper(deleteCurrentContact),
    updateCurrentContact: ctrlWrapper(updateCurrentContact),
}