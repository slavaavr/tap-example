import {storage} from "~/server/storage";

export default defineEventHandler((event) => {
    let userId = event.context.userId;
    return storage.get(userId) || 0;
});