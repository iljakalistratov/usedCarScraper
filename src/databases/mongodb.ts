import mongoose, { Schema } from "mongoose"

const db = mongoose.connect("mongodb://localhost:27017/usedCarScraper");


const UserSchema = new Schema({
    chatId: Number,
    timePeriod: Number,
    cars: [{
        make: String,
        model: String
    }]
})

const User = mongoose.model("User", UserSchema);

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

