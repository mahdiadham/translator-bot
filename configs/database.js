import mysql from "mysql2";

const databaseConfig = {
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
}

const db = mysql.createConnection(databaseConfig);

db.connect(error => {
    if (error) console.error(`Database Error => ${error}`);
    else console.log("Database connected successfully !");
});

export default db;