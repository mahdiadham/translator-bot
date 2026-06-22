import db from "../configs/database.js";

const SetDestinationLanguage = (chatID, messageID, command, messages, bot) => {
    const sendDestLangQuery = "UPDATE user_data SET dest_lang = ? WHERE chat_id = ? ORDER BY id DESC LIMIT 1";

    db.query(sendDestLangQuery, [command, chatID], (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        bot.editMessageText(messages.textForTranslate, {
            chat_id: chatID,
            message_id: messageID,
        });
    });
}

export default SetDestinationLanguage;