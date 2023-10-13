const ctrlWrapper = require("../decorators/ctrlWrapper");
const HttpError = require("../helpers/HttpError");
const ContactsModel = require('../models/ContactsModel');

const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await ContactsModel.find({ owner }, '-createdAt -updatedAt', {skip, limit}).populate('owner', 'username email');
    res.json(result); 
}

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await ContactsModel.findById(contactId);
    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json(result);
}

const addNewContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await ContactsModel.create({ ...req.body, owner });
    res.status(201).json(result);
}

const deleteCurrentContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await ContactsModel.findByIdAndRemove(contactId);
    
    if (!result) {
      throw HttpError(404, 'Not found');
    }

    res.json({message: 'contact deleted'});
}

const updateCurrentContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await ContactsModel.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!result) throw HttpError(404, 'Not found');

    res.json(result);
}

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await ContactsModel.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!result) throw HttpError(404, 'Not found');

    res.json(result);
}


module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addNewContact: ctrlWrapper(addNewContact),
    deleteCurrentContact: ctrlWrapper(deleteCurrentContact),
    updateCurrentContact: ctrlWrapper(updateCurrentContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
}