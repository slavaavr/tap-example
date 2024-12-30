import {Session} from "~/server/utils/session";

export default defineEventHandler(async (event) => {
    if (event.path === '/' || event.path === '/api/auth') {
        return
    }

    let session = getCookie(event, 'session');
    if (!session) {
        throw new Error('session is empty');
    }

    let payload = await Session.decrypt(session);
    event.context.userId = payload.userId;
})
