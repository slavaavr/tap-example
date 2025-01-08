import {validateTelegramData} from "~/server/utils/tgAuth";

export default defineEventHandler(async (event) => {
    let {initData} = await readBody(event);
    let user = validateTelegramData(initData);
    
    // Create session
    const expires = new Date(Date.now() + Session.SESSION_DURATION)
    const session = await Session.encrypt({userId: user.id, expires})
    
    // Save the session in a cookie
    setCookie(event, 'session', session, {expires: expires, httpOnly: true})
});