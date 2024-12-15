async function routes(fastify){
    fastify.post("/game-api/s2s-api/v1.0/lobby/rooms/listActiveBans", async (request, reply)=>{
        let data = {
            "status": "OK",
            "activeBans": {
                "entries": [],
                "totalCount": 0,
                "page": {
                    "offset": 0,
                    "limit": 10
                }
            }
        }
        return reply.send(data);//Заглушка
    })
}
module.exports = routes;