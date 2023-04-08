import TelegramBot from 'node-telegram-bot-api';
import { CarAd } from '../models/CarAd';
import 'dotenv/config';

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, { polling: true });

// let chatId = 0;

// Bot on on /start
export function testTgBot() {

    bot.onText(/\/start/, (msg) => {
        console.log(msg)
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Welcome to usedCarScraperBot');
    }
    );

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

