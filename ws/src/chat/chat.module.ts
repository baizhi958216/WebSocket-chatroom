import { Module } from '@nestjs/common';
import { LinkedUserService } from './service/linked-user/linked-user.service';

@Module({
  providers: [LinkedUserService]
})
export class ChatModule {}
