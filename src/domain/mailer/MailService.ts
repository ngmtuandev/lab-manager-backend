import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nguyenmanhtuancomputer@gmail.com',
        pass: 'khxp bbpp frao ryqm',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: 'nguyenmanhtuancomputer@gmail.com',
      to,
      subject,
      text,
      html,
    };
    try {
      const infoMail = await this.transporter.sendMail(mailOptions);
      if (infoMail?.response?.includes('250 2.0.0 OK'))
        return {
          status: 200,
          isSuccess: true,
          message: 'Send mail successfully',
        };
      else
        return {
          status: 400,
          isSuccess: false,
          message: 'Send mail failure',
        };
    } catch (error) {
      return {
        status: 400,
        isSuccess: false,
        message: `Send mail failure ${error.message}`,
      };
    }
  }
}
