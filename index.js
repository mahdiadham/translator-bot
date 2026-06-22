import TelegramBot from "node-telegram-bot-api";
import { readFileSync } from "fs";
import { appendFile } from "fs/promises";

import translateEngineKeyboard from "./components/TranslateEngineKeyboard.js";

import handleTranslate from "./components/HandleTranslate.js";
import setTranslateEngine from "./components/SetTranslateEngine.js";
import setDestinationLanguage from "./components/SetDestinationLanguage.js";

const messages = JSON.parse(
  readFileSync(new URL('./utils/messages.json', import.meta.url))
);

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true
});

bot.onText(/\/start/, msg => bot.sendMessage(msg.chat.id, messages.sayHello, translateEngineKeyboard));

bot.on("callback_query", query => {
  const chatID = query.message.chat.id;
  const messageID = query.message.message_id;
  const command = query.data;

  const translateEngines = ["google", "microsoft"];
  const destinationLanguages = ["en", "fa", "ch", "de", "es", "ru"];

  if (translateEngines.includes(command)) setTranslateEngine(chatID, messageID, command, messages, bot);

  if (destinationLanguages.includes(command)) setDestinationLanguage(chatID, messageID, command, messages, bot);
});

bot.on("message", msg => {
  const { id: chatID, first_name, username } = msg.chat;
  const text = msg.text;
  const messageID = msg.message_id;

  if (!text.startsWith("/")) handleTranslate(chatID, first_name, username, text, messageID, bot);
});

bot.on("callback_query", query => {
  const chatID = query.message.chat.id;
  const command = query.data;

  if (/\/start/.test(command)) bot.sendMessage(chatID, messages.restartText, translateEngineKeyboard);
});

bot.on("error", async error => {
  console.error(`Error => ${error}`);
  try {
    await appendFile(
      "./logs/generalErrors.log",
      `[${new Date().toISOString()}]\n${error.stack}\n\n`
    );
    console.log("Log Saved!");
  } catch (err) {
    console.error("Failed to save log:", err);
  }
});

bot.on("polling_error", async error => {
  console.error(`Polling Error => ${error}`);
  try {
    await appendFile(
      "./logs/pollingErrors.log",
      `[${new Date().toISOString()}]\n${error.stack}\n\n`
    );
    console.log("Log Saved!");
  } catch (err) {
    console.error("Failed to save log:", err);
  }
});

bot.on("webhook_error", async error => {
  console.error(`Webhook Error => ${error}`);
  try {
    await appendFile(
      "./logs/webhookErrors.log",
      `[${new Date().toISOString()}]\n${error.stack}\n\n`
    );
    console.log("Log Saved!");
  } catch (err) {
    console.error("Failed to save log:", err);
  }
});