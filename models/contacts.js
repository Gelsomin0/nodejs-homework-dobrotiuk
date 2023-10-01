const fs = require('fs/promises')
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.resolve(__dirname, 'contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const data = allContacts.find((contact) => contact.id === contactId);
  return data || null;
}

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
    const removedContact = allContacts.find((contact) => contact.id === contactId);
    const data = allContacts.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return removedContact || null;
}

const addContact = async (body) => {
  const newContact = { id: nanoid(), ...body};
  const allContacts = await listContacts();
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact
}

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();
  let contactsToUpdate = allContacts.find((contact) => contact.id === contactId) || null;
  const contactIndex = allContacts.indexOf(contactsToUpdate);

  if (!contactsToUpdate) {
    return null;
  }

  contactsToUpdate = { id: contactId, ...body };
  allContacts.splice(contactIndex, 1, contactsToUpdate);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return contactsToUpdate;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
