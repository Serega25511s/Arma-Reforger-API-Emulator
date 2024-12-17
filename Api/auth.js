const axios = require("axios");
const {Users, Servers} = require("../db");
const {getToken} = require("../ticketManager");
const { v4: uuidv4 } = require('uuid');
const { promisify } = require('util');
const fs = require('fs');


function makeid(length, onlyNumbers) {
    let result           = '';
    let characters = ""
    if (onlyNumbers === true)
    {
        characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    }else{
        characters = '0123456789';
    }

    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

async function routes(fastify) {


    fastify.post("/game-api/s2s-api/v1.0/lobby/rooms/acceptPlayer", async (request, reply) => {
        try {
            let body = request.body;

            // Проверяем наличие пользователя в MongoDB по sessionTicket
            const user = await Users.findOne({ "ticket": body["sessionTicket"] });
            if (!user) {
                const header = {
                    "x-client-id": request.headers["x-client-id"],
                    "x-client-secret": request.headers["x-client-secret"],
                    "content-type": request.headers["content-type"]
                };
                let bohemiaAcceptPlayer = await axios.post("https://api-ar-game.bistudio.com/game-api/s2s-api/v1.0/lobby/rooms/acceptPlayer", body, { headers: header });
                return reply.send(bohemiaAcceptPlayer.data);
            }

            let data = {
                "userProfile": {
                    "userId": user.userID,
                    "username": user.username || "",
                    "renameCount": -1,
                    "currencies": {
                        "HardCurrency": 0,
                        "SoftCurrency": 0
                    },
                    "countryCode": "UA",
                    "overallPlayTime": 66230,
                    "tester": false,
                    "isDeveloperAccount": false,
                    "rentedServers": {
                        "entries": [],
                        "visitedGames": []
                    }
                },
                "character": {
                    "id": user.userID,
                    "name": user.username,
                    "version": 1711140949069791232,
                    "data": "{\"m_aStats\":[0.0,53337.69140625,43835.9453125,131749.46875,98400.2734375,14878.484375,0.0,50760.828125,14.0,106.0,3366.0,78.0,7.0,2.0,66.0,31465.36328125,19135.662109375,0.0,0.0,2.0,2.0,0.0,27604.794921875,19.0,13.0,4.0,0.0,0.0,0.0,2.0,0.0,6520919040.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0]}"
                },
                "sessionTicket": body["sessionTicket"],
                "secret": "8f5e73fcdfead3b2e79bae2fef52ed2b19ffa0272ba76459cbd534937bb497d09e5145e85ae93009689a9e4946d3af4f548d8830b93c24dc891519017875a954a53e46d2fee91952",
                "platformIdentities": {
                    "biAccountId": "51dcf826-17db-4f87-91d5-4e95cdb853cf",
                    "steamId": user.steamid
                },
                "gameClientType": "PLATFORM_PC",
                "platformUsername": user.username
            };

            return reply.send(data);
        } catch (error) {
            console.error("Error processing acceptPlayer:", error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });

    fastify.post("/game-identity/api/v1.1/identities/reforger/auth", async (request, reply) => {
        try {
            let body = request.body;
            const bufferFromBase64 = Buffer.from(body["token"], 'base64');
            const hexString = bufferFromBase64.toString('hex');

            // Получение данных билета Steam
            let ticketData = await axios.get("https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/", {
                params: {
                    key: "D1BAB58EDEBE08D06ABAF7CE57F6268C",
                    appid: "480",
                    ticket: hexString
                },
            });

            let steamid = ticketData.data["response"]["params"]["steamid"];

            // Получение информации о пользователе Steam
            let steamUserInfo = await axios.get("https://community.steam-api.com/ISteamUser/GetPlayerSummaries/v2/", {
                params: {
                    key: "D1BAB58EDEBE08D06ABAF7CE57F6268C",
                    steamids: steamid
                }
            });

            let steamUsername = steamUserInfo.data["response"]["players"][0]["personaname"];

            let userID = uuidv4();
            let accessToken = "eyJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE3MjM5NDA3NDUsImV4cCI6MTcyMzk0NDM0NSwiaXNzIjoiZ2kiLCJhdWQiOiJnaSwgY2xpZW50LCBiaS1hY2NvdW50IiwiZ2lkIjoiYmNkM2NkMDctZjg3ZC00YzUwLTk3ZmItMzcyNWU5NGUzYTcxIiwiZ21lIjoicmVmb3JnZXIiLCJwbHQiOiJzdGVhbSJ9.INGYyPfKS2bkGk1nWLnydzczwHtHCycAUE5QRMHrL0f3nAIA3cv6uXVwHOUpqdEgDqdqo49YCTBE6BHam8MbWHQysilTX04e-Z2XXWX6YePIukQ6fjyH0xw1C_KKXzTOekbmlU-KCZ9dLi3D8vVC-4fkWwrL3czxpCclbwRxYQPOTmoTy5G-Fv3-U4edKET3a5-RyVMRsD5p0K_6wba3l6j8cET0SXH-5P46yxxyp1mUu76SdLT2nDDmEYdIgNWkWpXO-ONyxd0CJr_M3RQaTSIMF2r5A4gyMMpzlvF5kmnhOkiO0p1i1-1WAG21yrMrz6xM0DjAPLJF" + makeid(10, true);

            // Обновление или создание пользователя в базе данных
            await Users.updateOne(
                { steamid: steamid },
                {
                    $set: {


                        accessToken: accessToken,
                        updatedAt: new Date()
                    },
                    $setOnInsert: {
                        username: steamUsername,
                        userID: userID,
                        steamid: steamid,
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );
            const userFromDb = await Users.findOne({ steamid: steamid });
            let data = {
                identityId: userFromDb.userID,
                accessToken: userFromDb.accessToken,
                accessTokenExp: 1912663541,
                identity: {
                    id: userFromDb.userID,
                    game: "reforger",
                    links: [
                        {
                            platform: "steam",
                            platformId: steamid,
                            createdAt: new Date().toISOString()
                        },
                        {
                            platform: "bi-account",
                            platformId: "51dcf826-17db-4f87-91d5-4e95cdb853cf",
                            createdAt: "2024-03-18T09:18:12"
                        }
                    ],
                    linkHistory: [],
                    createdAt: "2024-01-02T20:05:43",
                    updatedAt: "2024-03-18T08:18:12"
                }
            };

            return reply.send(data);
        } catch (error) {
            console.error("Error authenticating user:", error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });


    fastify.post("/game-api/api/v1.0/lobby/rooms/join", async (request, reply) => {
        try {
            const rawData = Object.keys(request.body)[0];
            const jsonData = JSON.parse(rawData);

            let roomID = jsonData["roomId"];

            // Получаем информацию о сервере из MongoDB
            const server = await Servers.findOne({ "data.id": roomID });
            if (!server) {
                return reply.code(404).send({ error: "Room not found" });
            }

            let serverAddress = server.data.hostAddress;
            let sessionTicket = makeid(64, false);

            // Обновляем пользователя в базе данных с новым sessionTicket
            const user = await Users.findOneAndUpdate(
                { "accessToken": jsonData["accessToken"] },
                { $set: { ticket: sessionTicket } },
                { returnDocument: "after" }
            );

            if (!user.value) {
                return reply.code(404).send({ error: "User not found" });
            }

            let data = {
                "sessionTicket": sessionTicket,
                "secret": "8f5e73fcdfead3b2e79bae2fef52ed2b19ffa0272ba76459cbd534937bb497d09e5145e85ae93009689a9e4946d3af4f548d8830b93c24dc891519017875a954a53e46d2fee91952",
                "address": serverAddress,
                "inviteToken": "dVABIFt7UE1lX2hQEUwQWEZVUgocJzECXmZcfnBCUBR/Y2IpAnNWIV9FMA==",
                "joinResult": "Join"
            };

            return reply.send(data);
        } catch (error) {
            console.error("Error processing join room:", error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });


}

module.exports = routes;