import crypto from 'crypto'

type User = {
    id: string
    username: string
}

export function validateTelegramData(tgInitData: string): User {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    
    if (!BOT_TOKEN) {
        throw new Error('BOT_TOKEN is not set');
    }
    
    const initData = new URLSearchParams(tgInitData)
    const providedHash = initData.get('hash')
    
    if (!providedHash) {
        throw new Error('Hash is missing from initData');
    }
    
    const authDate = initData.get('auth_date')
    if (!authDate) {
        throw new Error('auth_date is missing from initData');
    }
    
    const authTimestamp = parseInt(authDate, 10)
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const fiveMinutesInSeconds = 5 * 60
    
    if (currentTimestamp - authTimestamp > fiveMinutesInSeconds) {
        throw new Error('Telegram data is older than 5 minutes');
    }
    
    const dataCheckString = Array.from(initData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n')
    
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest()
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
    
    if (calculatedHash !== providedHash) {
        throw new Error('Hash validation failed');
    }
    
    let user = JSON.parse(initData.get('user') || '');
    
    return {
        id: user.id,
        username: user.username,
    }
}