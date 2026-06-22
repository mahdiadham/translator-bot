import db from "../configs/database.js";
import googleKeyboard from "../components/GoogleKeyboard.js";
import microsoftKeyboard from "../components/MicrosoftKeyboard.js";

const SetTranslateEngine = (chatID, messageID, command, messages, bot) => {
    const languagesKeyboard = {
        googleKeyboard,
        microsoftKeyboard
    };
    const sendTranslateEngineQuery = "INSERT INTO user_data (chat_id, translate_engine) VALUES (?, ?)";

    db.query(sendTranslateEngineQuery, [chatID, command], (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        bot.editMessageText(messages.selectTranslateEngine, {
            chat_id: chatID,
            message_id: messageID,
            reply_markup: languagesKeyboard[`${command}Keyboard`].reply_markup
        });
    });
}

export default SetTranslateEngine;