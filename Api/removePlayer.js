async function routes(fastify) {
    fastify.post("/game-api/s2s-api/v1.0/lobby/rooms/removePlayer", async (request, reply)=>{
        let data = {
            "status": "OK"
        }
        return reply.send(data);//Заглушка
    })
}module.exports = routes;