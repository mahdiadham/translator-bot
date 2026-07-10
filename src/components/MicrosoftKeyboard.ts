import type { LanguageKeyboard } from "../types/index.js";

const MicrosoftKeyboard: LanguageKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: "فارسی 🇮🇷", callback_data: "fa" },
                { text: "انگلیسی 🇺🇸", callback_data: "en" }
            ],
            [
                { text: "روسی 🇷🇺", callback_data: "ru" },
                { text: "اسپانیایی 🇪🇸", callback_data: "es" }
            ]
        ]
    }
};

export default MicrosoftKeyboard;