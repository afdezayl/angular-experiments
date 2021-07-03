import { Message } from '@angular-experiments/api-interfaces';
import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(@Query('name') name = ''): Message {
    return this.appService.getData(name);
  }
}
