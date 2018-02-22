let redis = require("redis"),
  client = redis.createClient();

const {promisify} = require('util');
client.getAsync = promisify(client.get).bind(client);

module.exports = client;
