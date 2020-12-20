require('dotenv').config();

const fs = require('fs');

const express = require('express');
const Vonage = require('@vonage/server-sdk');

const PORT = process.env.PORT || 3000;
const {
  VONAGE_NUMBER,
  VONAGE_API_KEY,
  VONAGE_API_SECRET,
  VONAGE_APPLICATION_ID,
  VONAGE_PRIVATE_KEY_PATH
} = process.env;

const app = express();
const client = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
  applicationId: VONAGE_APPLICATION_ID,
  privateKey: fs.readFileSync(VONAGE_PRIVATE_KEY_PATH)
});

app.use(express.json());

app
  .post('/insights', (req, res) => {
    client.numberInsight.get({
      level: 'standard',
      number: req.body.number
    }, (error, response) => {
      if (error)
        console.error(error);
      if (response)
        console.log(response);
    });
    res.sendStatus(204);
  })
  .post('/sms', (req, res) => {
    client
      .message
      .sendSms(
        VONAGE_NUMBER,
        req.body.to,
        req.body.text,
        {},
        (error, response) => {
          if (error)
            console.error(error);
          if (response)
            console.log(response);
        });
    res.sendStatus(204);
  })
  .post('/voice', (req, res) => {
    client.calls.create({
      to: [{
        type: 'phone',
        number: req.body.to
      }],
      from: {
        type: 'phone',
        number: VONAGE_NUMBER
      },
      ncco: [{
        action: 'talk',
        text: 'This is a text to speech call from Vonage.'
      }]
    }, (error, response) => {
      if (error)
        console.error(error);
      if (response)
        console.log(response);
    });
    res.sendStatus(204);
  });

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
