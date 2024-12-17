const {Servers} = require("../db");
const axios = require("axios");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const secretKey = 'my_secret_key';
async function routes(fastify) {

    fastify.post("/game-api/s2s-api/v1.0/lobby/dedicatedServers/registerUnmanagedServer", async (request, reply)=>{
        let body = request.body;
        let serverID;
        let jwtToken = body.accessToken;

        if(!jwtToken){
            const header = {
                "x-client-id": request.headers["x-client-id"],
                "x-client-secret": request.headers["x-client-secret"],
                "content-type": request.headers["content-type"]
            };

            let bohemiaRegister = await axios.post("https://api-ar-game.bistudio.com/game-api/s2s-api/v1.0/lobby/dedicatedServers/registerUnmanagedServer", body, { headers: header });
            jwtToken = bohemiaRegister.data.ownerToken;
        }
        const decoded = jwt.decode(jwtToken);

        serverID = decoded.serverId;
        let hostServerId = uuidv4();
        let data = {
            "dsConfig":{
                "providerServerId": serverID,
                "dedicatedServerId": hostServerId,
                "region": "",
                "game": {
                    "name": body["name"],
                    "scenarioId": body["scenarioId"],
                    "hostedScenarioModId": body["hostedScenarioModId"],
                    "playerCountLimit": body["playerCountLimit"],
                    "gameNumber": 0,
                    "autoJoinable": false,
                    "visible": true,
                    "supportedGameClientTypes": body["supportedGameClientTypes"],
                    "gameInstanceFiles": {
                        "fileReferences": []
                    },
                    "mods": body["mods"],
                    "tags": body["tags"],
                    "gameMode": body["gameMode"]
                }
            },
            "ownerToken":body.accessToken ? body.accessToken : jwtToken,
        }
        await Servers.updateOne(
            { serverID: hostServerId },
            {
                $set: { data: {}},
                $currentDate: { lastUpdate: true }
            },
            { upsert: true }
        );
        return reply.send(data);
    })
    fastify.post("/game-api/s2s-api/v1.0/lobby/rooms/register", async (request, reply)=>{
        let body = request.body;
        let serverID = body["dedicatedHostId"];

        const decoded = jwt.decode(body.accessToken);
        let hostServerID = decoded.serverId;

        // Проверяем наличие сервера в MongoDB
        let server = await Servers.findOne({ serverID: serverID });
        const currentDate = new Date();
        if (!server) {
            console.log("Create server in license");
            const header = {
                "x-client-id": request.headers["x-client-id"],
                "x-client-secret": request.headers["x-client-secret"],
                "content-type": request.headers["content-type"]
            };

            let bohemiaAuth = await axios.post("https://api-ar-game.bistudio.com/game-api/s2s-api/v1.0/lobby/rooms/register", body, { headers: header });

            bohemiaAuth.data["mpRoom"]["time"] = currentDate;
            bohemiaAuth.data["mpRoom"]["isLicense"] = true;
            bohemiaAuth.data["mpRoom"]["official"] = true;

            // Сохраняем сервер в MongoDB
            await Servers.updateOne(
                { serverID: serverID },
                {
                    $set: { data: bohemiaAuth.data["mpRoom"], password: body["password"]},
                    $currentDate: { lastUpdate: true }
                },
                { upsert: true }
            );

            return reply.send(bohemiaAuth.data);
        }
        let data = {
            "roomId": `${hostServerID}`,
            "mpRoom": {
                "id": `${hostServerID}`,
                "scenarioId": body["scenarioId"],
                "name": body["name"],
                "scenarioVersion": "",
                "scenarioName": body["scenarioName"],
                "region": "n/a",
                "gameVersion": body["gameVersion"],
                "hostType": "CommunityDs",
                "dedicated": true,
                "official": true,
                "joinable": true,
                "visible": true,
                "passwordProtected": (!!body["password"]) ,
                "created": 1712841158268,
                "updated": 1712841158268,
                "hostAddress": body["hostAddress"],
                "hostUserId": body["dedicatedHostId"],
                "playerCountLimit": body["playerCountLimit"],
                "playerCount": 0,
                "autoJoinable": body["autoJoinable"],
                "directJoinCode": "0622875052",
                "supportedGameClientTypes": ["PLATFORM_PC", "PLATFORM_XBL"],
                "dsLaunchTimestamp": 1712841157982,
                "dsProviderServerId": hostServerID,
                "mods": body["mods"],
                "battlEye": false,
                "favorite": false,
                "gameMode": "",
                "pingSiteId": "frankfurt",
                "platformName": "Windows",
                "runtimeStats": {
                    "needRestart": false
                },
                "sessionId": "20240411131235-0000207476a1"
            }
        }
        await Servers.updateOne(
            { serverID: serverID },
            {
                $set: { data: data["mpRoom"], password: body["password"] },
                $currentDate: { lastUpdate: true }
            },
            { upsert: true }
        );
        return reply.send(data);
    })
    fastify.post("/game-api/s2s-api/v1.0/lobby/rooms/remove", async (request, reply)=>{
        let body = request.body;
        let serverID = body["dedicatedServerId"];
        let server = await Servers.findOne({ serverID: serverID });
        if(!server){
            return reply.code(404).send({status: "server not found"});
        }
        await Servers.deleteOne({ serverID: serverID });
        return reply.send({status: "OK"});
    })
}
module.exports = routes;