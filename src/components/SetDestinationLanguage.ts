import type TelegramBot from "node-telegram-bot-api";
import type { ResultSetHeader } from "mysql2";
import db from "../configs/database.js";
import type { Message } from "../types/index.js";
import type { DestinationLanguage } from "../types/index.js";

const SetDestinationLanguage = async (
    chatID: number,
    messageID: number,
    command: DestinationLanguage,
    messages: Message,
    bot: TelegramBot
): Promise<void> => {
    const sendDestLangQuery =
        "UPDATE users_data SET dest_lang = ? WHERE chat_id = ? ORDER BY id DESC LIMIT 1";

    try {
        await db.query<ResultSetHeader>(sendDestLangQuery, [command, chatID]);

        await bot.editMessageText(messages.textForTranslate, {
            chat_id: chatID,
            message_id: messageID
        });
    } catch (error) {
        console.error(error);
    }
};

export default SetDestinationLanguage;