import type TelegramBot from "node-telegram-bot-api";
import type { ResultSetHeader } from "mysql2";
import db from "../configs/database.js";
import restartKeyboard from "./RestartKeyboard.js";
import type {
    TranslateEngine,
    DestinationLanguage,
    UserTranslateSettingsRow,
    TranslateApiResponse,
    Message
} from "../types/index.js";

const fetchTranslation = async (
    apiURL: string,
    apiToken: string,
    translateEngine: TranslateEngine,
    destLang: DestinationLanguage,
    text: string
): Promise<string> => {
    const response = await fetch(`${apiURL}/${translateEngine}/`, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "one-api-token": apiToken
        },
        body: JSON.stringify({ target: destLang, text })
    });

    if (!response.ok) {
        throw new Error(`Request Error : ${response.status} - ${response.statusText}`);
    }

    const data = (await response.json()) as TranslateApiResponse;
    
    return data.result;
}

const HandleTranslate = async (
    apiURL: string,
    apiToken: string,
    chatID: number,
    first_name: string | undefined,
    username: string | undefined,
    text: string,
    messageID: number,
    bot: TelegramBot,
    messages: Message
): Promise<void> => {
    try {
        const getTranslateEngineQuery = "SELECT translate_engine, dest_lang FROM users_data WHERE chat_id = ? ORDER BY id DESC LIMIT 1";

        const [rows] = await db.query<UserTranslateSettingsRow[]>(getTranslateEngineQuery, [chatID]);

        const settings = rows[0];
        if (!settings) {
            await bot.sendMessage(chatID, messages.searchEngineError, restartKeyboard);
            return;
        }

        const translatedText = await fetchTranslation(
            apiURL,
            apiToken,
            settings.translate_engine,
            settings.dest_lang,
            text
        );

        if (!translatedText) {
            throw new Error("Translation API returned an empty result");
        }

        const updateUserDataQuery: string = "UPDATE users_data SET name = ?, username = ?, message_id = ?, text = ?, translated_text = ? WHERE chat_id = ? ORDER BY id DESC LIMIT 1";
        const queryValues = [first_name ?? "", username ?? "", messageID, text, translatedText, chatID];

        await db.query<ResultSetHeader>(updateUserDataQuery, queryValues);
        await bot.sendMessage(chatID, translatedText, restartKeyboard);
    }
    catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Request Error !";
        console.error(`Request Error => ${errorMessage}`);
        bot.sendMessage(chatID, messages.serviceError, restartKeyboard);
    }
};

export default HandleTranslate;