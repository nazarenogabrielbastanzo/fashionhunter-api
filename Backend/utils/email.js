const dotenv = require("dotenv");

const nodemailer = require("nodemailer");

const pug = require("pug");

const { htmlToText } = require("html-to-text");

dotenv.config({ path: "./config.env" });

// This class is used in the controller
class Email {
  constructor(email) {
    this.email = email;
    this.from = `Fashion Hunter <${process.env.GOOGLE_ACCOUNT}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: "SendGrid",
        port: 2525,
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS
        }
      });
    }

    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  // This is dynamic config for the send method that is call in the controller with the class
  async sendResetPassword() {
    await this.send("resetPassword", "Reset your Fashion Hunter password");
  }

  async send(template, subject, emailData) {
    const html = pug.renderFile(`${__dirname}/../emails/${template}.pug`);

    const text = htmlToText(html);

    await this.newTransport().sendMail({
      from: this.from,
      to: this.emails,
      html,
      text,
      subject
    });
  }
}

module.exports = { Email };
