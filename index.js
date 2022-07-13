const Discord = require("discord.js");
const client = new Discord.Client();
let initData = require("./data.json"); // inital data
let fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // allows access to .env
const TOKEN = process.env.TOKEN;
let nawafId = process.env.NAWAF_ID;
let botId = process.env.BOT_ID;
let emID = process.env.EM_ID;
const prefix = ".";
let i = 1;

let dataList = initData; // this will allow us to access the updated data when the json is re-written.

let currentAuthor = null;
let pastAuthor = null;

let random = 0;

client.once("ready", function () {
  console.log("ready to converse");
});

client.on("message", (message) => {
  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  let data = dataList;
  let cleanArr = message.content.split(" ");
  let msg = cleanArr[0];
  let addFlag = false;

  if (msg[0] === prefix) {
    // this makes sure that we dont have to check for command if the message doesnt start with the prefix
    switch (command) {
      case "زق":
        message.reply(message.author.displayAvatarURL());
        break;
      case "اضف":
        addToData(message);
        break;
      case "سب":
        insultInArabic(data, message);
        break;
      case "امدح":
        ComplementInArabic(data, message, true);
        break;
      case "مساعدة":
        message.reply(
          "هذولي الاشياء اللي اقدر اسويهن:\n.اضف (مدحة/سبة) (مدحة أو سبة)\n.سب (@ شخص او محد اذا تبينن بس اسب)\n.امدح (@ شخص او محد اذا كنت تبينن امدحك انت)"
        );
        break;
      case "insult":
        InsultInEnglish(data, message);
        break;
      case "compliment":
        ComplementInArabic(data, message, false);
        break;
      case "add":
        addToData(message);
        addFlag = true;
        break;
      case "help":
        console.log("here");
        message.reply(
          "List of commands:\n.add [insult or compliment] [your insult/compliment]\n.insult [either @ someone or leave it empty and i will scream into the void]\n.compliment [either @ someone or leave it empty if you want me to compliment you]"
        );
        break;
      default:
        message.react("❓");
        break;
    }
  }
  if (!addFlag) {
    frog(message, data);
  }
  addFlag = false;
});

function addToData(message) {
  // true and false in the params indicate whether its in Arabic or English
  let cleanMsg = message.content.split(" ");

  switch (cleanMsg[1]) {
    case "سبة":
      message.reply("لا مافيه كل زق");
      addInsult(cleanMsg, true);
      message.react("✅");
      break;
    case "مدحة":
      message.reply("ابشر يالبى");
      addComplement(cleanMsg, true);
      message.react("✅");
      break;
    case "insult":
      addInsult(cleanMsg, false);
      message.react("✅");
      break;
    case "compliment":
      addComplement(cleanMsg, false);
      message.react("✅");
      break;
    case "frog":
      if (message.author.id === emID || message.author.id === nawafId) {
        addFrog(message);
        // react with a frog emoji
        message.react("🐸");
      } else {
        message.reply("you are not a member of the Frog fan club");
        message.react("❌");
      }
      break;
    default:
      break;
  }

  return;
}

//  No longer needed, this bit has served me well. so long cowboy.
// client.on("message", (message) => {
//   pastAuthor = currentAuthor;
//   currentAuthor = message.author;

//   if (currentAuthor === pastAuthor && currentAuthor.id != botId) {
//     message.reply("تسولف انت؟ مسوي خوي؟");
//     pastAuthor = null;
//   }
// });

function addInsult(insult, mode) {
  let newInsult = "";
  for (i = 2; i < insult.length; i++) {
    // space after each word
    newInsult += insult[i];
    newInsult += " ";
  }
  // language is arabic
  if (mode) {
    // add it to the json file
    fs.readFile("./data.json", "utf-8", function (err, data) {
      if (err) throw err;

      let tempData = JSON.parse(data);
      tempData.Arabicinsults.push(newInsult);
      dataList = tempData;
      console.log(tempData);

      fs.writeFile(
        "./data.json",
        JSON.stringify(tempData),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
  } else {
    // add it to the json file
    fs.readFile("./data.json", "utf-8", function (err, data) {
      if (err) throw err;

      let tempData = JSON.parse(data);
      tempData.Insults.push(newInsult);
      dataList = tempData;
      console.log("tempdata insults", tempData);

      fs.writeFile(
        "./data.json",
        JSON.stringify(tempData),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
  }
}

function addComplement(complement, mode) {
  console.log("MODE COMPLEMENT == ", mode);
  let newComplement = "";
  for (i = 2; i < complement.length; i++) {
    newComplement += complement[i];
    newComplement += " ";
  }
  if (mode) {
    fs.readFile("./data.json", "utf-8", function (err, data) {
      if (err) throw err;

      let tempData = JSON.parse(data);
      tempData.ArabicComplements.push(newComplement);
      dataList = tempData;
      console.log("tempdata (arabic)==", tempData);

      fs.writeFile(
        "./data.json",
        JSON.stringify(tempData),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
  } else {
    fs.readFile("./data.json", "utf-8", function (err, data) {
      if (err) throw err;

      let tempData = JSON.parse(data);
      tempData.Complements.push(newComplement);
      dataList = tempData;
      console.log("tempdata==", tempData);

      fs.writeFile(
        "./data.json",
        JSON.stringify(tempData),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
  }
}

function insultInArabic(data, message) {
  const member = message.mentions.users.first();
  if (data.Arabicinsults.length === 0) {
    message.reply("ياكرهك, ياخي مالي خلق");
    return;
  }
  if (member) {
    // someone is @'d
    if (client.user.id == member.id) {
      message.reply("مسوي طقطوقي ؟ انقلع ولا يكثر");
      return;
    } else if (member.id == nawafId) {
      message.reply("ورع احترم نفسك");
      return;
    }
    console.log("Found the member");
    random = Math.floor(Math.random() * data.Arabicinsults.length);
    message.channel.send(data.Arabicinsults[random] + "<@" + member.id + ">");
  } else {
    random = Math.floor(Math.random() * data.Arabicinsults.length);
    message.channel.send(data.Arabicinsults[random]);
  }
}

function InsultInEnglish(data, message) {
  if (data.Insults.length === 0) {
    message.reply("cant really think of anything");
    return;
  }
  const member = message.mentions.users.first();
  if (member) {
    if (client.user.id == member.id) {
      message.reply("Not funny, didnt laugh");
      return;
    } else if (member.id == nawafId) {
      message.reply("why would I ever do that? are you stupid");
      return;
    }
    console.log("Found the member");
    random = Math.floor(Math.random() * data.Insults.length);
    message.channel.send(data.Insults[random] + "<@" + member.id + ">");
  } else {
    random = Math.floor(Math.random() * data.Insults.length);
    message.channel.send(data.Insults[random]);
  }
}

function ComplementInArabic(data, message, mode) {
  const member = message.mentions.users.first();
  if (mode) {
    if (data.ArabicComplements.length === 0) {
      message.reply("معليش ما اقدر");
      return;
    }
    if (member) {
      console.log("Found the member");
      random = Math.floor(Math.random() * data.ArabicComplements.length);
      message.channel.send(
        data.ArabicComplements[random] + "<@" + member.id + ">"
      );
    } else {
      random = Math.floor(Math.random() * data.ArabicComplements.length);
      message.reply(data.ArabicComplements[random]);
    }
  } else {
    if (data.Complements.length === 0) {
      message.reply("I got nothing, sorry");
      return;
    }
    if (member) {
      console.log("Found the member");
      random = Math.floor(Math.random() * data.Complements.length);
      message.channel.send(data.Complements[random] + "<@" + member.id + ">");
    } else {
      random = Math.floor(Math.random() * data.Complements.length);
      message.reply(data.Complements[random]);
    }
  }
}

function addFrog(message) {
  let newPic = "";
  let cleanMsg = message.content.split(" ");
  const attachment = message.attachments.first();
  const url = attachment ? attachment.url : null;
  if (cleanMsg.length == 3 || url) {
    fs.readFile("./data.json", "utf-8", function (err, data) {
      if (err) throw err;

      let tempData = JSON.parse(data);
      if (url) {
        tempData.FrogPics.push(url);
      } else {
        tempData.FrogPics.push(cleanMsg[2]);
      }
      dataList = tempData;
      console.log("frog pics == ", tempData);

      fs.writeFile(
        "./data.json",
        JSON.stringify(tempData),
        "utf-8",
        function (err) {
          if (err) throw err;
          console.log("Done!");
        }
      );
    });
  } else {
    console.log("formatting failed");
  }
}

// if the user message includes the word "frog" reply with a frog emoji
function frog(message, data) {
  console.log(message.author.id);
  if (message.content.includes("frog") && message.author.id != botId) {
    random = Math.floor(Math.random() * data.Complements.length);
    message.channel.send(data.FrogPics[random]);
  }
}

client.login(TOKEN);
