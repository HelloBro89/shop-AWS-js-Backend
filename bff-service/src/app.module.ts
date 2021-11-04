import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorHandlerController } from './error-handler/error-handler.controller';

@Module({
  imports: [],
  controllers: [AppController, ErrorHandlerController],
  providers: [AppService],
})
export class AppModule {}
