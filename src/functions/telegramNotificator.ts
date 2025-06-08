import TelegramBot from 'node-telegram-bot-api';
import { CarAd } from '../models/CarAd';
import { createUser } from '../databases/mongodb';
import { mainLogicSpecificUser } from '../functions/businessLogic';
import 'dotenv/config';

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, { polling: true });

// let chatId = 0;

// Bot on on /start
export async function testTgBot() {

    bot.onText(/\/start/, (msg: TelegramBot.Message) => {
        console.log(msg);
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Welcome to usedCarScraperBot.\nYou can be notified for up to 3 Car models\n\nTo add a car model to your preferences, type /addCarModel');

        bot.onText(/\/addCarModel/, (msg: TelegramBot.Message) => {
            console.log(msg);

            bot.removeAllListeners('message');

            bot.sendMessage(chatId, 'Please type the make of the car you want to be notified for');

            const makeListener = (msg: TelegramBot.Message) => {
                const make = msg.text?.trim();
                if (!make) {
                    bot.sendMessage(chatId, 'Invalid input. Please type the make of the car you want to be notified for.');
                    return;
                }
                bot.sendMessage(chatId, 'Thank you.\nNow please type the model of the car you want to be notified for');
                bot.removeListener('message', makeListener);
                
                //toyota yaris

                const modelListener = (msg: TelegramBot.Message) => {
                    const model = msg.text?.trim();
                    if (!model) {
                        bot.sendMessage(chatId, 'Invalid input. Please type the model of the car you want to be notified for.');
                        return;
                    }
                    bot.sendMessage(chatId, 'Thank you.\nNow please type the time period in seconds you want to be notified for (min. 300 sec)');
                    bot.removeListener('message', modelListener);

                    const timeListener = async (msg: TelegramBot.Message) => {
                        const timeInSeconds = parseInt(msg.text || '', 10);
                        if (isNaN(timeInSeconds) || timeInSeconds < 300) {
                            bot.sendMessage(chatId, 'Invalid time period. Please enter a number greater than or equal to 300.');
                            return;
                        }
                        bot.sendMessage(chatId, `Thank you. Your data will be updated every ${timeInSeconds} seconds.`);
                        bot.removeListener('message', timeListener);
                        
                        // save the user inclusive preferences to the database
                        // const user = {
                        //     chatId: chatId,
                        //     timePeriod: timeInSeconds,  // in seconds
                        //     cars: [{ make, model }]  // validated make and model
                        // };

                        var timePeriod = timeInSeconds;
                        let parsedCars: Array<{ make: string; model: string }> = [];

                        //console.log(user);
                        parsedCars.push({ make, model });
                        const userTest = await createUser({ chatId, timePeriod, cars: parsedCars });

                        console.log(userTest);
                        // create the user in mongodb
                        // createUser(user)
                        //     .then((createdUser) => {
                        //         console.log('User created:', createdUser);
                        //         bot.sendMessage(chatId, `Your preferences have been saved: ${JSON.stringify(createdUser)}`);
                        //     })
                        //     .catch((error) => {
                        //         console.error('Error creating user:', error);
                        //         bot.sendMessage(chatId, 'There was an error saving your preferences. Please try again later.');
                        //     });
                        
                        //Call main logic here
                        mainLogicSpecificUser(chatId);
                    };

                    bot.on('message', timeListener);
                };

                bot.on('message', modelListener);
            };

            bot.on('message', makeListener);
        });
    });

    // bot.onText(/\/downloadDatabase/, (msg) => {
    //     console.log(msg)
    //     chatId = msg.chat.id;
    //     const path = require('path');
    //     const filePath = path.join(__dirname, '../databases/carAdDatabase.json');
    //     bot.sendDocument(chatId, filePath);
    // }
    // );

}

export function sendAds(chatId: number, carAds: CarAd[]) {
    carAds.forEach((carAd) => {
        if (carAd.imgSrc) {
            bot.sendPhoto(chatId, carAd.imgSrc, {caption: carAd.title + '\n' + carAd.price + '\n' + carAd.km + '\n' + carAd.year + '\n' + carAd.link});
        }
        else {
            bot.sendMessage(chatId, carAd.title + '\n' + carAd.price + '\n' + carAd.km + '\n' + carAd.year + '\n' + carAd.link);
        }
    });

}

