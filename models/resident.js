
import { Schema, model } from 'mongoose';

const residentSchema = new Schema(
  {
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      //unique: true,
      lowercase: true,
      trim: true,
      //match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      //unique: true,
   // match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    profession: {
      type: String,
      required: true,
    },
    interest: {
      type: String,
      required: true,
    },
    residentType: {
      type: String,
      enum: [
        "Land", 
        "Single-Family-Homes", 
        "Apartments/Flats", 
        "Condominiums", 
        "Specialized-Residences", 
        "Shared Residences", 
        "Luxury-Residences", 
        "Temporary-Residences"],
      required: true
    },
    moveInDate: {
        type: Date,
        required: true
    },
    inspectionFee: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Resident = model("Resident", residentSchema)

export default Resident;