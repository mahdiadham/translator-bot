import type { LanguageKeyboard } from "../types/index.js";

const RestartKeyboard: LanguageKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "Restart 🔄", "callback_data": "/start"},
            ]
        ]
    }
}

export default RestartKeyboard;