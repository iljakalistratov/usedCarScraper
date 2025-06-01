import mongoose, { Schema } from "mongoose";
import { User } from "../models/User"; 

const db = mongoose.connect("mongodb://admin:admin@mongo:27017/usedCarScraper");


const UserSchema = new Schema({
  chatId: { type: Number, required: true },
  timePeriod: { type: Number, required: true },
  cars: [{
    make: { type: String, required: true },
    model: { type: String, required: true }
  }]
});

export const UserModel = mongoose.model('User', UserSchema);

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
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// Function to delete a user by chatId
export async function deleteUser(chatId: number): Promise<void> {
  try {
    const result = await UserModel.deleteOne({ chatId });
    if (result.deletedCount === 0) {
      throw new Error(`No user found with chatId: ${chatId}`);
    }
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}



//addCar function, only possible if car array of this User is < 3

// export function addCar(chatId: number, make: string, model: string) {
//     if (User.where({ chatId: chatId }).cars.length < 3) {
//         User.updateOne({ chatId: chatId }, { $push: { cars: { make: make, model: model } } });
//     }
// }

