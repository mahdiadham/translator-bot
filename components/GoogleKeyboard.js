const GoogleKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "فارسی 🇮🇷", "callback_data": "fa"},
                {text: "انگلیسی 🇺🇸", "callback_data": "en"}
            ],
            [
                {text: "آلمانی 🇩🇪", "callback_data": "de"},
                {text: "روسی 🇷🇺", "callback_data": "ru"}
            ],
            [
                {text: "اسپانیایی 🇪🇸", "callback_data": "es"}
            ]
        ]
    }
}

export default GoogleKeyboard;