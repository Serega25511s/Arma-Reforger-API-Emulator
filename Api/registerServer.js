const {Servers} = require("../db");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
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
    fastify.post("/game-api/s2s-api/v1.0/lobby/dedicatedServers/registerUnmanagedServer", async (request, reply)=>{
        let body = request.body

        const decoded = jwt.decode(body.accessToken);
        let serverID = decoded.serverId;

        let data = {
            "dsConfig":{
                "providerServerId": serverID,
                "dedicatedServerId":serverID,
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
            "ownerToken":body["accessToken"]
        }
        await Servers.updateOne(
            { serverID: serverID },
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
            bohemiaAuth.data["mpRoom"]["id"] = serverID;
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
            "roomId": `${serverID}`,
            "mpRoom": {
                "id": `${serverID}`,
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
                "hostUserId": "817ecbf6-7b28-4465-a781-d56891862653",
                "playerCountLimit": body["playerCountLimit"],
                "playerCount": 0,
                "autoJoinable": body["autoJoinable"],
                "directJoinCode": "0622875052",
                "supportedGameClientTypes": ["PLATFORM_PC", "PLATFORM_XBL"],
                "dsLaunchTimestamp": 1712841157982,
                "dsProviderServerId": "2f211937-ed4e-4c5f-bbf1-e6451d736e38",
                "mods": body["mods"],
                "battlEye": false,
                "favorite": false,
                "gameMode": "",
                "pingSiteId": "frankfurt",
                "platformName": "Windows",
                "runtimeStats": {
                    "needRestart": false
                },
                "time": currentDate,
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
}
module.exports = routes;