const {Servers} = require("../db");

async function routes(fastify) {
    fastify.post("/game-api/api/v1.0/lobby/rooms/verifyPassword", async (request, reply) => {
        let nonBody = request.body;
        const keys = Object.keys(nonBody);
        let body = JSON.parse(keys[0]);

        let roomid = body["roomId"];
        let password = body["password"];

        // Проверяем пароль из MongoDB
        let server = await Servers.findOne({ "data.id": roomid });
        if (!server || server.password !== password) {
            let errorResponse = {
                "code": 403,
                "errorType": "PasswordMismatch",
                "apiCode": "PasswordMismatch",
                "message": "Password mismatch",
                "uid": "0ec0a582-46bc-4748-9743-585f757e06d0"
            };
            return reply.code(403).send(errorResponse);
        }

        let data = {
            "status": "OK"
        };
        return reply.send(data);
    });
}module.exports = routes;