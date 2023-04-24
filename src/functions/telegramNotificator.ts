import TelegramBot from 'node-telegram-bot-api';
import { CarAd } from '../models/CarAd';
import 'dotenv/config';

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, { polling: true });

// let chatId = 0;

// Bot on on /start
export function testTgBot() {

    bot.onText(/\/start/, (msg: TelegramBot.Message) => {
        console.log(msg);
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Welcome to usedCarScraperBot.\nYou can be notified for up to 3 Car models\n\nTo add a car model to your preferences, type /addCarModel');

        bot.onText(/\/addCarModel/, (msg: TelegramBot.Message) => {
            console.log(msg);
            bot.sendMessage(chatId, 'Please type the make of the car you want to be notified for');

            const makeListener = (msg: TelegramBot.Message) => {
                console.log(msg.text);
                bot.sendMessage(chatId, 'Thank you.\nNow please type the model of the car you want to be notified for');
                bot.removeListener('message', makeListener);

                const modelListener = (msg: TelegramBot.Message) => {
                    console.log(msg.text);
                    bot.sendMessage(chatId, 'Thank you.\nNow please type the time period in seconds you want to be notified for (min. 300 sec)');
                    bot.removeListener('message', modelListener);

                    const timeListener = (msg: TelegramBot.Message) => {
                        const timeInSeconds = parseInt(msg.text || '', 10);
                        if (isNaN(timeInSeconds) || timeInSeconds < 300) {
                            bot.sendMessage(chatId, 'Invalid time period. Please enter a number greater than or equal to 300.');
                            return;
                        }
                        bot.sendMessage(chatId, `Thank you. Your data will be updated every ${timeInSeconds} seconds.`);
                        bot.removeListener('message', timeListener);
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

