import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  { timestamps: true },
);

export const Contacts = model('contacts', contactSchema);
