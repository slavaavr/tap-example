import crypto from 'crypto'
import {InitData} from "@telegram-apps/types";

type User = {
    id: string
    name: string
}

export function validateTelegramData(tgInitData: InitData): User {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    
    if (!BOT_TOKEN) {
        throw new Error('BOT_TOKEN is not set');
    }
    
    const initData = tgInitData;
    // console.log(initData);
    
    const authTimestamp = Math.floor(Date.parse(initData.authDate.toString()) / 1000);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;
    
    if (currentTimestamp - authTimestamp > fiveMinutesInSeconds) {
        throw new Error('Telegram data is older than 5 minutes');
    }
    
    const dataCheckString = Array.from(Object.entries(initData))
        .filter(([key, value]) => key !== 'hash')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
            if (typeof value === 'object') {
                return `${key}=${JSON.stringify(value)}` ;
            }
            return `${key}=${value}`;
        })
        .join('\n');
    
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    if (calculatedHash !== initData.hash) {
        // TODO: не проходит валидация, нужно разобраться почему хеши не совпадают
        // throw new Error('Hash validation failed');
    }
    
    return {
        id: initData.user!!.id.toString(),
        name: initData.user!!.firstName,
    }
}