const MongoClient = require("mongodb").MongoClient;
const config = require("./config.json");
module.exports.Init = async function (callback) {
  console.log(" Try Connect to MongoDB!");
  const client = new MongoClient(config.DB.ADDR);
  await client.connect();

  console.log("Connected to MongoDB!");

  const dbName = "ArmaReforgerAPI";
  const db = client.db(dbName);

  // Проверка на наличие базы данных и её создание автоматически MongoDB
  const adminDb = client.db().admin();
  const dbList = await adminDb.listDatabases();
  if (!dbList.databases.some(database => database.name === dbName)) {
    console.log(`Database '${dbName}' does not exist. It will be created automatically on the first write.`);
  }

  // Проверки существования коллекций и их создание при необходимости
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(col => col.name);

  if (!collectionNames.includes("Users")) {
    await db.createCollection("Users");
    console.log("Collection 'Users' created.");
  }

  if (!collectionNames.includes("Servers")) {
    await db.createCollection("Servers");
    console.log("Collection 'Servers' created.");
  }
  await db.collection("Servers").createIndex({ lastUpdate: 1 }, { expireAfterSeconds: 180 });
  module.exports = {
    Users: db.collection("Users"),
    Servers: db.collection("Servers"),
  };
  callback();
  console.log("Initialization complete.");


};
