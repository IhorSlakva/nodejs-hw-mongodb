import { SORT_ORDER } from '../constants/constans.js';
import { Contacts } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contacts.find().countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginationData,
  };
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
  const result = await Contacts.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });

  return result;
};

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({ _id: contactId });

  return contact;
};
