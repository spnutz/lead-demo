import * as utils from 'util';
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
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(HttpStatus.OK).send(challenge);
    } else {
      return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
    }
  }

  @Post()
  handleMessage(@Body() body: any, @Res() res: Response) {
    console.log(`Webhook event: ${utils.inspect(body)}`);

    res.status(HttpStatus.OK).send('EVENT_RECEIVED');
  }
}
