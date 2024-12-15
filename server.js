const config = require('./config.json');

const fs = require("fs");
const {startPeriodicTask} = require("./ticketManager");
const fastify = require('fastify')({
    logger:true
})


module.exports.Init = function (callback) {
    fastify.register(require("@fastify/cors"), {
        origin: "*",
        methods: ["GET"]
    });
    fastify.register(require('@fastify/formbody'));

    fs.readdirSync("./Api").forEach(file => {
        fastify.register(require("./Api/" + file));
    })

    fastify.listen({ host: "0.0.0.0", port: config.API.PORT}).then(() => {
        callback();
    });
    startPeriodicTask();

}