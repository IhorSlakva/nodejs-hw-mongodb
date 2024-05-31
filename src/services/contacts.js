import { Contacts } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await Contacts.find();

  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);

  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contacts.create(payload);

  return contact;
};

export const updateContact = async (contactId, payload) => {
  const result = await Contacts.findOneAndUpdate({ _id: contactId }, payload);

  return result;
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({ _id: contactId });

  return contact;
};
