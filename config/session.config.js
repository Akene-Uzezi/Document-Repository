const session = require("express-session");
const mongodbstore = require("connect-mongodb-session")(session);
require("dotenv").config();

const createSessionStore = () => {
  const store = new mongodbstore({
    uri: process.env.uri,
    databaseName: process.env.dbName,
    collection: "sessions",
  });
  return store;
};

const sessionConfig = {
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: createSessionStore(),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};

module.exports = sessionConfig;
