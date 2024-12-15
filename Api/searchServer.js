const {Servers} = require("../db");
async function routes(fastify) {
    fastify.post("/game-api/api/v1.0/lobby/rooms/search", async (request, reply) => {

        try {
            // Получаем все серверы из MongoDB
            const servers = await Servers.find({}).toArray();

            // Извлекаем данные о комнатах
            const rooms = servers.map(server => server.data);
            const totalCount = rooms.length;

            const data = {
                rooms: rooms,
                searchFrom: 0,
                totalCount: totalCount
            };

            return reply.send(data);
        } catch (error) {
            console.error("Error fetching rooms from database:", error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });

}module.exports = routes;