import {storage} from "~/server/storage";

export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    if (!body.taps) {
        return
    }
    
    let userId = event.context.userId;
    let balance = storage.get(userId) || 0;
    
    if (body.taps > 1000) {
        return balance;
    }
    
    let bonus = 0;
    if (balance % 10 === 7) {
        bonus = 100;
    }
    
    balance += body.taps + bonus;
    storage.set(userId, balance);
    return balance;
});