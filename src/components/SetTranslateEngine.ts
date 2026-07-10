import type TelegramBot from "node-telegram-bot-api";
import type { ResultSetHeader } from "mysql2";
import db from "../configs/database.js";
import googleKeyboard from "./GoogleKeyboard.js";
import microsoftKeyboard from "./MicrosoftKeyboard.js";
import type { Message } from "../types/index.js";
import type { TranslateEngine } from "../types/index.js";

const SetTranslateEngine = async (
    chatID: number,
    messageID: number,
    command: TranslateEngine,
    messages: Message,
    bot: TelegramBot
): Promise<void> => {
    const languageKeyboards: Record<TranslateEngine, typeof googleKeyboard> = {
        google: googleKeyboard,
        microsoft: microsoftKeyboard
    };

    const sendTranslateEngineQuery =
        "INSERT INTO users_data (chat_id, translate_engine) VALUES (?, ?)";

    try {
        await db.query<ResultSetHeader>(sendTranslateEngineQuery, [chatID, command]);

        await bot.editMessageText(messages.selectTranslateEngine, {
            chat_id: chatID,
            message_id: messageID,
            reply_markup: languageKeyboards[command].reply_markup
        });
    } catch (error) {
        console.error(error);
    }
};

export default SetTranslateEngine;