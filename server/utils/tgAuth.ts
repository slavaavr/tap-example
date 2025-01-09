import crypto from 'crypto'

type User = {
    id: string
    name: string
}

export function validateTelegramData(tgInitDataRaw: string): User {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    
    if (!BOT_TOKEN) {
        throw new Error('BOT_TOKEN is not set');
    }
    
    const initData = new URLSearchParams(tgInitDataRaw);
    
    const hash = initData.get('hash')
    if (!hash) {
        throw Error('Hash is missing from initData');
    }
    
    initData.delete('hash')
    
    const authDate = initData.get('auth_date')
    if (!authDate) {
        throw Error('auth_date is missing from initData');
    }
    
    const authTimestamp = parseInt(authDate, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;
    
    if (currentTimestamp - authTimestamp > fiveMinutesInSeconds) {
        throw new Error('Telegram data is older than 5 minutes');
    }
    
    let dataCheckString = [...initData.entries()]
        .sort()
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    
    if (calculatedHash !== hash) {
        throw new Error('Hash validation failed');
    }
    
    let user = JSON.parse(initData.get('user')!!)
    
    return {
        id: user.id,
        name: user.firstName,
    }
}