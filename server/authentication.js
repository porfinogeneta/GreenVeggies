import express from 'express'
import http from 'http'
import fetch from 'node-fetch'
import OAuth2Client from 'google-auth-library'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

var app = express()
app.use(cors())

/* GET users listing. */
app.post('/request', async function(req, res, next) {
  // dzielenie zasobów z frtontendem, ten localhost to nasz frontend
  app.header("Access-Control-Allow-Origin", 'http://localhost:3008/');
  app.header("Access-Control-Allow-Credentials", 'true'); // uzywamy tylko http
  app.header("Referrer-Policy","no-referrer-when-downgrade");
  const redirectURL = 'http://127.0.0.1:8001/oauth';

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
      redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    // to jest URL do tego okienka
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // do testów to jes ustawione
      scope: 'https://www.googleapis.com/auth/userinfo.profile  openid ',
      prompt: 'consent'
    });

    res.json({url:authorizeUrl})

});


// odpowiedź od google'a
// traktujemy acccess token jako osobę a nie email  
async function getUserData(access_token) {

    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    
    //console.log('response',response);
    const data = await response.json();
    console.log('data',data);
  }
  
  
  
  /* GET home page. */
  app.get('/oauth', async function(req, res, next) {
  
      const code = req.query.code;
  
      console.log(code);
      try {
          const redirectURL = "http://127.0.0.1:8001/oauth"
          const oAuth2Client = new OAuth2Client(
              process.env.CLIENT_ID,
              process.env.CLIENT_SECRET,
              redirectURL
            );
          const r =  await oAuth2Client.getToken(code);
          // Make sure to set the credentials on the OAuth2 client.
          await oAuth2Client.setCredentials(r.tokens);
          console.info('Tokens acquired.');
          const user = oAuth2Client.credentials;
          console.log('credentials',user);
          await getUserData(oAuth2Client.credentials.access_token);
  
        } catch (err) {
          console.log('Error logging in with OAuth2 user', err);
      }
  
  
      res.redirect(303, 'http://localhost:3008/');
    
  
  
  });
  

const port = 8001
http.createServer(app).listen(port);
console.log(`serwer działa, nawiguj do http://localhost:${port}`);