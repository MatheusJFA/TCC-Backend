import nodemailer from "nodemailer";
import { t } from 'i18next';
import Logger from "../configuration/logger";
import { forgetPassword } from "../templates/forgetPassword";
import { verifyEmail } from "../templates/verifyEmail";
import path from "path";

const transport =  nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

transport.verify().then(() => {
    Logger.info("Email server is ready to take our messages");
  }).catch(() => {
    Logger.error("Unable to connect to email server");
  });

const imagePath = path.join(__dirname, '..', 'assets', 'images');

const sendEmail = (to: string, subject: string, text?: string, html?: string, attachments?: any, ) => {
  const message = {from: process.env.EMAIL_FROM, to, subject, text, html, attachments};
  transport.sendMail(message);
};

const resetPasswordEmail = (name: string, to: string, token: string) => {
  const subject = t("FIELDS.RESET_PASSWORD");
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const attachments =  [{
    filename: 'password.png',
    path: imagePath + '/password.png',
    cid: 'imagem'
  }];

  sendEmail(to, subject, "", forgetPassword(name, link), attachments);
}

const sendVerificationEmail = (name: string, to: string, token: string) => {
  const subject = t("FIELDS.VERIFICATION_EMAIL");
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const attachments =  [{
    filename: 'accountCreated.png',
    path: imagePath + '/accountCreated.png',
    cid: 'imagem'
  }];

  sendEmail(to, subject, "", verifyEmail(name, link), attachments);
}

export default {
  sendEmail,
  resetPasswordEmail,
  sendVerificationEmail
}