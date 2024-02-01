"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const line = require("@line/bot-sdk");
const PORT = 3000;
const config = {
  channelSecret: process.env.CHANNEL_SECRET, 
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN, 
};

app.get("/", (_, res) => {
  res.send("Hello LINE BOT!!");
});

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text", 
    text: event.message.text
  });
}

app.listen(PORT, () => {
  console.log(`Server is running! http://localhost:${PORT}`);
});
