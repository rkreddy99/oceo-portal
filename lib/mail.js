const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// example of msg
// const msg = {
//   to: process.env.EMAIL_FROM,
//   from: process.env.EMAIL_FROM,
//   subject: "",
//   html: `html`
// };

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLEINT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function mailing(msg) {
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

  const result = await transport.sendMail(msg);

  return result;
}

export async function sendEmail(msg) {
  try {
    const result = await mailing(msg);
  } catch (error) {
    throw new Error(`Could not send email: ${error.message}`);
  }
}
