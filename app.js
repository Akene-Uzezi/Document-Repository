const express = require("express");
const db = require("./database/documentRepository.db");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

db.connect()
  .then(() => {
    app.listen(3000, () => {
      console.log("connected to database and started the server");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
  });
