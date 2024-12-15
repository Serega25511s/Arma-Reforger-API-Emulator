const {Servers} = require("../db");
async function routes(fastify) {
    fastify.post("/game-api/api/v1.0/lobby/rooms/getRoomsByIds", async (request, reply) => {
        try {
            const { roomIds } = request.body;

            if (!Array.isArray(roomIds)) {
                return reply.code(400).send({ error: "Invalid request format: roomIds must be an array." });
            }

            // Получаем комнаты по их идентификаторам
            const rooms = await Servers.find({ "data.id": { $in: roomIds } }).toArray();

            const data = {
                rooms: rooms.map(server => server.data),
                searchFrom: 0,
                totalCount: rooms.length
            };

            return reply.send(data);
        } catch (error) {
            console.error("Error fetching rooms by IDs from database:", error);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });
}
module.exports = routes;