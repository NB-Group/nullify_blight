import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await this.transporter.sendMail({
      from: `"学术监督网" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '请验证您的邮箱地址',
      html: `
        <h1>欢迎注册学术监督网!</h1>
        <p>请点击下面的链接来验证您的邮箱地址:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>此链接将在1小时后失效。</p>
      `,
    });
  }
}
