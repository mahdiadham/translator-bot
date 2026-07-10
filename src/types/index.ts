import * as TelegramBot from "node-telegram-bot-api";
import type { RowDataPacket } from "mysql2";

export type DestinationLanguage = "en" | "fa" | "ch" | "de" | "es" | "ru";

export type TranslateEngine = "google" | "microsoft";

export interface LanguageKeyboard {
    reply_markup: TelegramBot.InlineKeyboardMarkup;
}

export interface Message {
    sayHello: string;
    restartText: string;
    selectTranslateEngine: string;
    textForTranslate: string;
    searchEngineError: string;
    serviceError: string;
}

export interface UserTranslateSettingsRow extends RowDataPacket {
    translate_engine: TranslateEngine;
    dest_lang: DestinationLanguage;
}

export interface TranslateApiResponse {
    result: string;
}