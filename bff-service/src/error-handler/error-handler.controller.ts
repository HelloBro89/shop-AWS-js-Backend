/* eslint-disable prettier/prettier */
import { Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';

@Controller('*')
export class ErrorHandlerController {
  @Get()
  getHandler(): string {
    throw new HttpException(
      'Cannot process request!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  @Post()
  posthandler(): string {
    throw new HttpException(
      'Cannot process request!',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
