import { Contacts } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  return await Contacts.find();
};

export const getContactById = async (id) => {
  return await Contacts.findById(id);
};
