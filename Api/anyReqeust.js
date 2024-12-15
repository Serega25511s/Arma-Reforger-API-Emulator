const axios = require("axios");
const {getToken} = require("../ticketManager");

async function routes(fastify) {
    fastify.post("/game-api/api/v1.0/session/login", async (request, reply)=>{
        const data = {"userProfile":{"userId":"1bde4705-34fd-489d-a7fe-93f3a2f5aefc","username":"","renameCount":-1,"currencies":{"HardCurrency":0,"SoftCurrency":0},"countryCode":"UA","overallPlayTime":66230,"tester":false,"isDeveloperAccount":false,"rentedServers":{"entries":[],"visitedGames":[]}},"worldVersion":"BanSettings","ipAddress":"91.219.235.155","pendingMicroTransactions":[],"compatibleGameVersions":["1.1.0.42"],"notifications":[],"sessionId":"4105b12d-6873-4f8e-9dd3-36d638fdc455"}

        return reply.send(data);

    })
    fastify.post("/ping", async (request, reply)=>{
        return reply.send({status: "pong"});
    })
    fastify.post("/game-api/api/v1.0/blockList/listBlocked", async (request, reply)=>{
        return reply.send({
            "status": "OK",
            "blockList": {
                "entries": [],
                "totalCount": 0,
                "page": {
                    "offset": 0,
                    "limit": 16
                }
            }
        });
    })
    fastify.post("/game-api/api/v1.0/lobby/rooms/listPlayers", async (request, reply)=>{
        return reply.send({
            "connectedPlayers": [],
            "queuePlayers": []
        });
    })
    fastify.get("/api/news", async (request, reply)=>{
        const data = {
            "items": [{
                "date": "08 Августа 2024",
                "excerpt": "Начало тестирования нового API",
                "category": "Development",
                "slug": "update-august-08-2024",
                "title": "1.2.0.102 Update",
                "coverImage": {
                    "src": "https://cms-cdn.bistudio.com/cms-static--reforger/images/08f81027-c102-4a4f-b9e7-fe12e8e6e8c2-NEWS%201280x720.jpg"
                },
                "fullUrl": "https://youtu.be/dQw4w9WgXcQ?si=zY34xDJ__8psHZ3i"
            }]
        }
        return reply.send(data);
    });

    fastify.post("/GetWorkshopToken", async (request, reply)=>{
        let authToken = getToken();
        let data = {"token": authToken}
        return reply.send(data);
    });
    fastify.post("/game-api/s2s-api/v1.0/sendTdEvents", async (request, reply)=>{
        const data = {"status":"OK"}
        return reply.send(data);

    })
    fastify.post("/game-api/api/v1.0/sendTdEvents", async (request, reply)=>{
        const data = {"status":"OK"}
        return reply.send(data);

    })
    fastify.post("/workshop-api/api/v3.0/assets/list", async (request, reply)=>{

        const url = 'https://api-ar-workshop.bistudio.com/workshop-api/api/v3.0/assets/list';
        const headers = {
            'Content-Type': 'application/json',
            'user-agent': "Arma Reforger/1.1.0.42 (Client; Windows)",
            'x-client-id': "$5d81ca9bbdd80f837dfe6380f436013"
        }
        let JsonData = JSON.stringify(request.body)
        const response = await axios.post(url, JsonData, { headers });
        return reply.send(response.data);

    })
    fastify.post("/game-api/api/v1.0/lobby/getPingSites", async (request, reply) => {
        const data = {"pingSites":[{"id":"frankfurt","address":"ping-location-de.nitrado.net","ipAddress":"31.214.130.69","location":{"latitude":51.29930114746094,"longitude":9.491000175476074},"mappedRegions":["eu-ffm"]},{"id":"london","address":"ping-location-ukln.nitrado.net","ipAddress":"46.251.234.83","location":{"latitude":51.50640106201172,"longitude":-0.019999999552965164}},{"id":"los_angeles","address":"ping-location-usla.nitrado.net","ipAddress":"37.10.127.60","location":{"latitude":34.05440139770508,"longitude":-118.24400329589844},"mappedRegions":["us-la"]},{"id":"miami","address":"ping-location-usmi.nitrado.net","ipAddress":"109.230.214.92","location":{"latitude":25.774099349975586,"longitude":-80.18170166015625},"mappedRegions":["us-mi"]},{"id":"new_york","address":"ping-location-usny.nitrado.net","ipAddress":"134.255.251.148","location":{"latitude":40.71229934692383,"longitude":-74.00679779052734},"mappedRegions":["us-ny"]},{"id":"singapore","address":"ping-location-sg.nitrado.net","ipAddress":"128.0.112.235","location":{"latitude":1.298200011253357,"longitude":103.78399658203125},"mappedRegions":["ap-sg"]},{"id":"sydney","address":"ping-location-ausy.nitrado.net","ipAddress":"128.0.115.134","location":{"latitude":-33.94300079345703,"longitude":151.18099975585938},"mappedRegions":["ap-sy"]},{"id":"tokyo","address":"ping-location-jpto.nitrado.net","ipAddress":"31.214.142.8","location":{"latitude":35.67190170288086,"longitude":139.68499755859375},"mappedRegions":["ap-to"]}]}
        return reply.send(data);
    });
    fastify.post("/getLobby", async (request, reply) => {
        const data = {"rooms": []}
        return reply.send(data);
    });
    fastify.get("/game-api/api/v1.0/world", async (request, reply) => {
        const data = {
            "version": "BanSettings",
            "gameData": {
                "BanSettings": {
                    "m_sDesc": "Ban Logic Cleansweep",
                    "m_BanSettings": {
                        "m_fScoreThreshold": 10.0,
                        "m_fScoreDecreasePerMinute": 0.2,
                        "m_fScoreMultiplier": 0.2,
                        "m_fAccelerationMin": 1.0,
                        "m_fAccelerationMax": 6.0,
                        "m_fBanEvaluationLight": 0.8,
                        "m_fBanEvaluationHeavy": 1.0,
                        "m_fCrimePtFriendKill": 1.0,
                        "m_fCrimePtTeamKill": 0.7,
                        "m_fQualityTimeTemp": 1.0,
                        "m_bVotingSuggestionEnabled": 0
                    }
                }
            }
        }
        return reply.send(data);
    });
    fastify.get("/game-api/api/v1.0/dummy", async (request, reply) => {
        const data = {}
        return reply.send(data);
    });
}
module.exports = routes;