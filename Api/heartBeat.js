const axios = require("axios");
const {Servers} = require("../db");
async function routes(fastify) {
    fastify.post("/game-api/s2s-api/v1.0/lobby/dedicatedServers/heartBeat", async (request, reply) => {
        let body = request.body;
        let data;
        let serverID = request.body["id"];

        // Проверяем наличие сервера в MongoDB
        let server = await Servers.findOne({ "data.id": serverID });
        if (!server) {
            return reply.send({ status: "NotFound Server" });
        }

        if (server.data.isLicense) {
            const header = {
                "x-client-id": request.headers["x-client-id"],
                "x-client-secret": request.headers["x-client-secret"],
                "content-type": request.headers["content-type"]
            };
            let bohemiaPing = await axios.post("https://api-ar-game.bistudio.com/game-api/s2s-api/v1.0/lobby/dedicatedServers/heartBeat", body, { headers: header });
            data = bohemiaPing.data;
        }

        let players = request.body["players"];
        await Servers.updateOne(
            { "data.id": serverID },
            {
                $set: {
                    "data.playerCount": players.length
                },
                $currentDate: { lastUpdate: true }
            }
        );

        if (!data) {
            data = {
                "currentWorldVersion": "BanSettings",
                "gameEvents": [],
                "status": "OK"
            };
        }

        return reply.send(data);
    });
}
module.exports = routes;