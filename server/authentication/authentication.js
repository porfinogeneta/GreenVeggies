import mysql from 'mysql2'
import {Connector} from '@google-cloud/cloud-sql-connector';
import admin from '../config/firebase-config.js'
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

async function addUser(uid){
  const [result] = await pool.query(`
  INSERT INTO users (UID)
  VALUES (?)
  `, [uid])

  return result.insertId;
}


// authorize function checks if given user has a proper role
// authentication + authorization
async function authorize(uid, role,decodedValue, res, next) {
  try {
    // const uid = req.headers.uid.split(" ")[1];
    // const role = req.headers.role.split(" ")[1];
    // const decodedValue = await admin.auth().verifyIdToken(token);
    // check if it's a logged-in user
    if (decodedValue) {
      // check if role fits
      const user = await getUserByUID(uid);
      // console.log(user.role);
      if (user != undefined){
        // admin can do everything
        if (user.role === 'ADMIN') {
          next();
        }
        // farmer can do farmer stuff as well as user stuff, we check database status as well as header provided status
        else if ((user.role === 'FARMER' && role.toUpperCase() === 'USER') || role.toUpperCase() === 'FARMER') {
          next();
        }
        else if (user.role === 'USER' && role.toUpperCase() === 'USER') {
          next();
        }
        else {
          res.status(401).send("Unauthorized");
        }
      }else {
        const id = await addUser(uid);
        // grant access to user pages if the user stuff was requested
        if (role == 'USER'){
          next()
        }else {
          res.status(401).send("Unauthorized");
        }
      }
    }
    else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error("Error in checkStatus:", error);
    res.status(500).send("Internal Server Error");
  }
}

// authenticate function checks if it's a logged in user
// bare authentication
export async function authenticate(req, res, next) {
  try {
    // frontend przekazuje w headers swój klucz JWT
    const token = req.headers.authorization.split(" ")[1]; // pobieramy tylko token, bez Bearer
    const role = req.headers.role.split(" ")[1];
    const uid = req.headers.uid.split(" ")[1];
    const decodedValue = await admin.auth().verifyIdToken(token);
    await authorize(uid, role,decodedValue, res, next)
  } catch (error) {
    console.error("Error in authorize:", error);
    res.status(401).send("Unauthorized");
  }
}