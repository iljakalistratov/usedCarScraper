import mongoose, { Schema } from "mongoose";
import { User } from "../models/User"; 

const db = mongoose.connect("mongodb://admin:admin@mongo:27017/usedcarsdb?authSource=admin");


const UserSchema = new Schema({
  chatId: { type: Number, required: true },
  timePeriod: { type: Number, required: true },
  cars: [{
    make: { type: String, required: true },
    model: { type: String, required: true }
  }]
});

export const UserModel = mongoose.model('User', UserSchema);

// --- CarAd Schema & Model ---

export interface CarAd extends mongoose.Document {
  title: string;
  price?: string;
  km?: string;
  year?: string;
  link: string;
  imgSrc?: string;
  chatId: number;
}

const CarAdSchema = new Schema<CarAd>(
  {
    title: { type: String, required: true },
    price: { type: String, default: null },
    km: { type: String, default: null },
    year: { type: String, default: null },
    link: { type: String, required: true, unique: true },
    imgSrc: { type: String, default: null },
    chatId: { type: Number, required: true },
  },
  {
    collection: "carAdListings",
    timestamps: true,
  }
);

export const CarAdModel: mongoose.Model<CarAd> = mongoose.model<CarAd>(
  "carAdListings",
  CarAdSchema
);


// Function to create a new user
export async function createUser(userData: {
  chatId: number;
  timePeriod: number;
  cars: Array<{ make: string; model: string }>;
}): Promise<User> {
  try {
    const user = new UserModel(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

export async function deleteUser(chatId: number): Promise<void> {
  try {
    const result = await UserModel.deleteOne({ chatId });
    if (result.deletedCount === 0) {
      throw new Error(`No user found with chatId: ${chatId}`);
    }
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to delete user: ${err.message}`);
  }
}

// Function to find a user by chatId
export async function findUserByChatId(chatId: number): Promise<User | null> {
  try {
    const user = await UserModel.findOne({ chatId });
    return user;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to find user: ${err.message}`);
  }
}



//addCar function, only possible if car array of this User is < 3

// export function addCar(chatId: number, make: string, model: string) {
//     if (User.where({ chatId: chatId }).cars.length < 3) {
//         User.updateOne({ chatId: chatId }, { $push: { cars: { make: make, model: model } } });
//     }
// }

// --- CarAd Functions ---

/**
 * Checks if a CarAd with the given link already exists for this user.
 *
 * @param chatId - Telegram chat ID of the user.
 * @param link - Unique link/URL of the car ad.
 * @returns Promise<boolean> - true if the ad exists, false otherwise.
 */
export async function checkIfCarAdAlreadyInDb(
  chatId: number,
  link: string
): Promise<boolean> {
  const existing = await CarAdModel.exists({ chatId, link });
  return existing !== null;
}

/**
 * Adds a new CarAd document to the database, associated with the given user.
 * Will only insert if an ad with the same link for that user does not already exist.
 *
 * @param chatId - Telegram chat ID of the user.
 * @param adData - Object containing the CarAd fields (title, price, km, year, link, imgSrc).
 * @returns Promise<CarAd> - The newly created CarAd document.
 */
export async function addCarAdToDb(
  chatId: number,
  adData: {
    title: string;
    price?: string;
    km?: string;
    year?: string;
    link: string;
    imgSrc?: string;
  }
): Promise<CarAd> {

  const newAd = new CarAdModel({
    title: adData.title,
    price: adData.price || null,
    km: adData.km || null,
    year: adData.year || null,
    link: adData.link,
    imgSrc: adData.imgSrc || null,
    chatId,
  });

  return newAd.save();
}