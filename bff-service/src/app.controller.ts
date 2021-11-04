import { Controller, Get, Post, Req, Body } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Request } from 'express';
import { AppService } from './app.service';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAll(@Req() req: Request): Promise<AxiosResponse<any, any>> {
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    // const productId = req.query.productId;
    const method = req.method;
    const allUsers = await this.appService.getAll(recipient, method);
    return allUsers;
  }

  @Post()
  async addItem(
    @Body() createItemDto: CreateItemDto,
    @Req() req: Request,
  ): Promise<AxiosResponse<any, any>> {
    const recipient = req.originalUrl.split('/')[1].split('?')[0];
    const method = req.method;
    const addedItem = await this.appService.addItem(
      recipient,
      method,
      createItemDto,
    );
    return addedItem;
  }
}
