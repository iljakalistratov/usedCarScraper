import mongoose, { Schema } from "mongoose"

const db = mongoose.connect("mongodb://admin:admin@mongo:27017/usedCarScraper");


const UserSchema = new Schema({
    chatId: Number,
    timePeriod: Number,
    cars: [{
        make: String,
        model: String
    }]
})

const User = mongoose.model("User", UserSchema);

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
export function createNewUser(chatId: number, timePeriod: number, cars: [{ make: string, model: string }]) {
    const newUser = new User({
        chatId: chatId,
        timePeriod: timePeriod,
        cars: cars
    });
    newUser.save();
}

export function deleteUser(chatId: number) {
    User.deleteOne({ chatId: chatId });
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