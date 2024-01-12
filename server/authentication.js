import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// }).promise()

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: process.env.GOOGLE_INSTANCE_CONNECTION_NAME,
  ipType: 'PUBLIC',
});

const pool = await mysql.createPool({
    ...clientOpts,
    user: process.env.GOOGLE_USERNAME,
    password: process.env.GOOGLE_DATABASE_PASSWORD,
    database: process.env.GOOGLE_DATABASE_NAME,
  }).promise()

export async function getUserByUID(uid){
    const [rows] = await pool.query("SELECT * FROM users WHERE UID = ?", [uid])
    return rows[0]
}

export async function addUser(uid){
  const [result] = await pool.query(`
  INSERT INTO users (UID)
  VALUES (?)
  `, [uid])

  return result.insertId;
}
