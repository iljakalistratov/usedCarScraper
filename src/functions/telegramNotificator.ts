import TelegramBot from 'node-telegram-bot-api';
import { CarAd } from '../models/CarAd';
import 'dotenv/config';

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token!, { polling: true });

let chatId = 0;

export function testTgBot() {
    bot.on('message', (msg) => {
    console.log(msg)
    chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to usedCarScraperBot');
    });
}

export function sendAds(carAds: CarAd[]) {
    carAds.forEach((carAd) => {
        if (carAd.imgSrc) {
            bot.sendPhoto(chatId, carAd.imgSrc, {caption: carAd.title + '\n' + carAd.price + '\n' + carAd.km + '\n' + carAd.year + '\n' + carAd.link});
        }
        else {
            bot.sendMessage(chatId, carAd.title + '\n' + carAd.price + '\n' + carAd.km + '\n' + carAd.year + '\n' + carAd.link);
        }
    });

}

export function sendAdsTimePeriod(carAds: CarAd[], timePeriod: number) {
    
    while (true) {
        sendAds(carAds);
        setTimeout(() => {}, timePeriod * 1000);
    }

}
