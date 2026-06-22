const RestartKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {text: "Restart 🔄", "callback_data": "/start"},
            ]
        ]
    }
}

export default RestartKeyboard;