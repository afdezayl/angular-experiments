import { Injectable } from '@nestjs/common';
import { Message } from '@angular-experiments/api-interfaces';

@Injectable()
export class AppService {
  getData(name: string): Message {
    return { message: `Hello ${name}!` };
  }
}
