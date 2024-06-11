import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('webhook')
export class WebhookController {
  @Get()
  verify(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Query('source') source: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

    switch (source) {
      case 'facebook':
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          console.log('FACEBOOK VERIFY WEBHOOK');
          return res.status(HttpStatus.OK).send(challenge);
        } else {
          return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
        }
      case 'tiktok':
        console.log('TIKTOK VERIFY WEBHOOK');
        return res.status(HttpStatus.OK).send(challenge);
    }
  }

  @Post()
  handleMessage(
    @Body() body: any,
    @Query('source') source: string,
    @Res() res: Response,
  ) {
    console.log(
      `Webhook event from : ${source}`,
      JSON.stringify(body, null, 2),
    );

    res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }
}
