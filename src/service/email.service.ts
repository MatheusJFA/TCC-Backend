import nodemailer from "nodemailer";
import { t } from 'i18next';
import Logger from "@configuration/logger";
import { forgetPassword } from "@templates/forgetPassword";
import { verifyEmail } from "@templates/verifyEmail";
import path from "path";
import enviroment from "@/configuration/enviroment";

class EmailService {
  private imagePath = path.join(__dirname, '..', 'assets', 'images');


    private transport = nodemailer.createTransport({
    service: enviroment.smtp.host,
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: enviroment.smtp.email,
      pass: enviroment.smtp.secret
    },
  });

  public initialize = async () => {
    this.transport.verify().then(() => {
      Logger.info("Email server is ready to take our messages");
    }).catch(() => {
      Logger.error("Unable to connect to email server");
    });
  }


  private sendEmail = (to: string, subject: string, text?: string, html?: string, attachments?: any,) => {
    const message = { from: enviroment.smtp.from, to, subject, text, html, attachments };
    this.transport.sendMail(message);
  };

  public sendForgotPasswordEmail = (name: string, to: string, token: string) => {
    const subject = t("EMAIL.RESET_PASSWORD.TITLE");
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const attachments = [{
      filename: 'password.png',
      path: this.imagePath + '/password.png',
      cid: 'imagem'
    }];

    this.sendEmail(to, subject, "", forgetPassword(name, link), attachments);
  }

  public sendVerificationEmail = (name: string, to: string, token: string) => {
    const subject = t("EMAIL.VERIFY_EMAIL.TITLE");
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const attachments = [{
      filename: 'accountCreated.png',
      path: this.imagePath + '/accountCreated.png',
      cid: 'imagem'
    }];

    this.sendEmail(to, subject, "", verifyEmail(name, link), attachments);
  }

  public sendContactEmail = (name: string, email: string, message: string) => {
    let contactInfo = `${name} - ${email}`
    const subject = t("EMAIL.CONTACT_EMAIL", { name: contactInfo });

    const to = enviroment.smtp.email as string;

    this.sendEmail(to, subject, message);
  }
}

export default new EmailService();