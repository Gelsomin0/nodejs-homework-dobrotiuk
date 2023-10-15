const { Schema, model } = require('mongoose');

const contactsSchema = Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  }
}, { versionKey: false, timestamps: true });

const ContactsModel = model('contact', contactsSchema);

module.exports = ContactsModel;