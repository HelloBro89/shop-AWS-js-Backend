import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { config } from './common/config';
import { requestToEb } from './axi.requests';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class AppService {
  getAll(recipient: string, method: string): Promise<AxiosResponse<any, any>> {
    const recipientURL = config.PRODUCTS;
    console.log(method);
    if (recipientURL) {
      return requestToEb(recipientURL, recipient, method);
    }
  }

  addItem(
    recipient: string,
    method: string,
    createItemDto: CreateItemDto,
  ): Promise<AxiosResponse<any, any>> {
    const recipientURL = config.PRODUCTS;
    console.log(method);
    if (recipientURL) {
      console.log(createItemDto);
      return requestToEb(recipientURL, recipient, method, createItemDto);
    }
  }
}
