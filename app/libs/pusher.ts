'use client';
import PusherServer from "pusher";
import PusherClient from "pusher-js";
let app_id = "1892829"
let key = "7ce91fec47e645948c24"
let secret = "97979b7f52e4f045d353"
let cluster = "mt1"
export const pusherServer = new PusherServer({
    appId: app_id,
    key: key,
    secret: secret,
    cluster: "mt1"
    useTLS: true,
});

export const pusherClient = new PusherClient(
    key,
    {
        channelAuthorization: {
            endpoint: "/api/pusher/auth",
            transport: "ajax",
        },
        cluster: "mt1",
    }
);
