const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Set up OAuth2 credentials
const oauth2Client = new OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: 'YOUR_REFRESH_TOKEN'
});

// Set up the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'YOUR_EMAIL_ADDRESS',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN',
    accessToken: oauth2Client.getAccessToken(),
  }
});

// Define the email criteria
const emailCriteria = {
  from: 'example@example.com',
  subject: 'Example Subject'
};

// Retrieve the relevant emails
transporter.search(emailCriteria, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    results.forEach(result => {
      transporter.fetch(result.uid, { markSeen: true }, (err, email) => {
        if (err) {
          console.error(err);
        } else {
          // Parse the email and extract the required information
          const extractedInfo = email.text;

          // Send an email to the desired recipient with the extracted information
          transporter.sendMail({
            from: 'YOUR_EMAIL_ADDRESS',
            to: 'RECIPIENT_EMAIL_ADDRESS',
            subject: 'Extracted Information',
            text: extractedInfo
          }, (err, info) => {
            if (err) {
              console.error(err);
            } else {
              console.log(info);
            }
          });
        }
      });
    });
  }
});
