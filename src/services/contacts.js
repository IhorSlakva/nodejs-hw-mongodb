import { SORT_ORDER } from '../constants/constants.js';
import { ContactsCollections } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 5,
  sortBy = '_id',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollections.find({ userId });

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollections.find({ userId }).countDocuments(),
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

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollections.findOne({ _id: contactId, userId });

  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollections.create(payload);

  return contact;
};

export const updateContact = async (contactId, payload, userId, fileUrl) => {
  const result = await ContactsCollections.findOneAndUpdate(
    { _id: contactId, userId, fileUrl },
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollections.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
