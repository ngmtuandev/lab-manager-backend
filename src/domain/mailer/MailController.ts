import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './MailService';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    try {
      return this.mailService.sendMail(to, subject, text);
    } catch (error) {
      console.log('error send mail : ', error);
    }
  }
}
