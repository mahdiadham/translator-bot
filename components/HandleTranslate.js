import db from "../configs/database.js";
import restartKeyboard from "../components/RestartKeyboard.js";

const HandleTranslate = (chatID, first_name, username, text, messageID, bot) => {
    const fetchData = async (url, destLang) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                    "one-api-token": process.env.API_TOKEN
                },
                body: JSON.stringify({
                    target: destLang,
                    text
                })
            });

            if (!response.ok) throw new Error(`Request Error : ${response.status} - ${response.statusText}`);

            const data = await response.json();

            const updateUserDataQuery = "UPDATE user_data SET name = ?, username = ?, message_id = ?, text = ?, translated_text = ? WHERE chat_id = ? ORDER BY id DESC LIMIT 1";
            const queryValues = [first_name || "", username || "", messageID || "", text || "", data.result || "", chatID || ""];

            db.query(updateUserDataQuery, queryValues, (error, result) => {
                if (error) {
                    console.error(error);
                    bot.sendMessage(chatID, "Request Error !");
                    return;
                }
                bot.sendMessage(chatID, data.result, restartKeyboard);
            });
        }
        catch (error) {
            console.log(error);
            bot.sendMessage(chatID, error);
        }
    }

    const getTranslateEngine = "SELECT translate_engine, dest_lang FROM user_data WHERE chat_id = ? ORDER BY id DESC LIMIT 1";

    db.query(getTranslateEngine, [chatID], (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        
        const translateEngine = result[0].translate_engine;
        const destLang = result[0].dest_lang;

        fetchData(`${process.env.API_URL}/${translateEngine}/`, destLang);
    });
}

export default HandleTranslate;