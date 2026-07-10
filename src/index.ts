import TelegramBot from "node-telegram-bot-api";
import { readFileSync } from "fs";
import { join } from "path";
import { appendFile } from "fs/promises";

import translateEngineKeyboard from "./components/TranslateEngineKeyboard.js";
import handleTranslate from "./components/HandleTranslate.js";
import setTranslateEngine from "./components/SetTranslateEngine.js";
import setDestinationLanguage from "./components/SetDestinationLanguage.js";

import type { Message } from "./types/index.js";

const messagesPath = join(import.meta.dirname, "../messages/messages.json");
const messages: Message = JSON.parse(readFileSync(messagesPath, "utf8"));

const token = process.env.BOT_TOKEN;
const apiURL = process.env.API_URL;
const apiToken = process.env.API_TOKEN;

if (!token || !apiURL || !apiToken) {
  console.error("Bot token or API url must be set !");
  process.exit(1);
}

const bot = new TelegramBot(token, {
  polling: true
});

const TRANSLATE_ENGINES = ["google", "microsoft"] as const;
const DESTINATION_LANGUAGES = ["en", "fa", "ch", "de", "es", "ru"] as const;

type TranslateEngine = (typeof TRANSLATE_ENGINES)[number];
type DestinationLanguage = (typeof DESTINATION_LANGUAGES)[number];

function isTranslateEngine(value: string): value is TranslateEngine {
  return (TRANSLATE_ENGINES as readonly string[]).includes(value);
}

function isDestinationLanguage(value: string): value is DestinationLanguage {
  return (DESTINATION_LANGUAGES as readonly string[]).includes(value);
}

async function logError(fileName: string, label: string, error: Error): Promise<void> {
  console.error(`${label} => ${error}`);
  try {
    await appendFile(
      `./logs/${fileName}`,
      `[${new Date().toISOString()}]\n${error.stack ?? error.message}\n\n`
    );
    console.log("Log Saved!");
  } catch (err) {
    console.error("Failed to save log:", err);
  }
}

bot.onText(/\/start/, msg => bot.sendMessage(msg.chat.id, messages.sayHello, translateEngineKeyboard));

bot.on("callback_query", query => {
  const message = query.message;
  const command = query.data;

  if (!message || !command) return;

  const chatID = message.chat.id;
  const messageID = message.message_id;

  if (/\/start/.test(command)) {
    void bot.sendMessage(chatID, messages.restartText, translateEngineKeyboard);
    return;
  }

  if (isTranslateEngine(command)) {
    setTranslateEngine(chatID, messageID, command, messages, bot);
    return;
  }

  if (isDestinationLanguage(command)) {
    setDestinationLanguage(chatID, messageID, command, messages, bot);
    return;
  }
});

bot.on("message", msg => {
  const { id: chatID, first_name, username } = msg.chat;
  const text = msg.text;
  const messageID = msg.message_id;

  if (!text || text.startsWith("/")) return;

  handleTranslate(apiURL, apiToken, chatID, first_name, username, text, messageID, bot, messages);
});

bot.on("error", error => {
  void logError("generalErrors.log", "Error", error);
});

bot.on("polling_error", error => {
  void logError("pollingErrors.log", "Polling Error", error);
});

bot.on("webhook_error", error => {
  void logError("webhookErrors.log", "Webhook Error", error);
});