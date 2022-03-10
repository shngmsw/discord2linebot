// Response for GAS
const http = require("http");
require("dotenv").config();
const querystring = require("query-string");
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  partials: ["MESSAGE", "CHANNEL"],
});

http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function (chunk) {
        data += chunk;
      });
      req.on("end", function () {
        if (!data) {
          console.log("No post data");
          res.end();
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(process.env.PORT || 3000);

// Discord bot implements
client.on("ready", (message) => {
  // botのステータス表示
  client.user.setPresence({ game: { name: "with discord.js" } });
  console.log("bot is ready!");
});

client.on("messageCreate", (message) => {
  // DMには応答しない
  if (message.channel.type == "dm") {
    return;
  }

  var msg = message;

  // botへのリプライは無視
  if (msg.mentions.has(client.user)) {
    return;
  } else {
    if (msg.channel.id === process.env.CHANNELID_DAYCORD) {
      //GASにメッセージを送信
      sendGAS(msg);
      return;
    }
  }

  function sendGAS(msg) {
    var jsonData = {
      events: [
        {
          type: "discord",
          name: msg.author.username,
          message: msg.content,
        },
      ],
    };
    //GAS URLに送る
    console.log(msg.author.username);
    console.log(msg.content);
    post(process.env.GAS_URL, jsonData);
  }

  function post(url, data) {
    //requestモジュールを使う
    var request = require("request");
    var options = {
      uri: url,
      headers: { "Content-type": "application/json" },
      json: data,
      followAllRedirects: true,
    };
    // postする
    request.post(options, function (error, response, body) {
      if (error != null) {
        msg.reply("更新に失敗しました");
        console.log("更新に失敗しました");
        return;
      }
    });
  }
});

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("please set ENV: DISCORD_BOT_TOKEN");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
