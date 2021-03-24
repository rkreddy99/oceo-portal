const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLEINT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function mailing(mailOptions) {
  const accessToken = await oAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_FROM,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLEINT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const result = await transport.sendMail(mailOptions);
  return result;
}

export async function sendEmail(mailOptions) {
  try {
    const result = await mailing(mailOptions);
    // console.log("Email sent", result);
  } catch (error) {
    throw new Error(`Could not send email: ${error.message}`);
  }
}
