import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrorHandlerController } from './pathHandler/error-handler.controller';
import { CartController } from './cart/cart.controller';

@Module({
  imports: [],
  controllers: [AppController, CartController, ErrorHandlerController],
  providers: [AppService],
})
export class AppModule {}
