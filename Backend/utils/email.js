const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");
const { google } = require("googleapis");

dotenv.config({ path: "./config.env" });

const { GCP_CLIENT_ID, GCP_CLIENT_SECRET, GCP_REDIRECT_URI, GCP_REFRESH_TOKEN } =
  process.env;

class Email {
  constructor(email, link) {
    this.email = email;
    this.link = link;
    this.from = `Fashion Hunter <${process.env.GOOGLE_ACCOUNT}>`;
  }

  newTransport() {
    const oAuth2Client = new google.auth.OAuth2(
      GCP_CLIENT_ID,
      GCP_CLIENT_SECRET,
      GCP_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: GCP_REFRESH_TOKEN });

    const accessToken = oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_ACCOUNT,
        clientId: GCP_CLIENT_ID,
        clientSecret: GCP_CLIENT_SECRET,
        refreshToken: GCP_REFRESH_TOKEN,
        accessToken
      }
    });
  }

  async send(emailData) {
    const html = pug.renderFile(`${__dirname}/../emails/resetPassword.pug`, emailData);

    const text = htmlToText(html);

    await this.newTransport().sendMail({
      from: this.from,
      to: this.email,
      subject: "Reset Password",
      text,
      html
    });
  }

  async sendWelcome(token) {
    await this.send({ token });
  }
}

module.exports = { Email };
