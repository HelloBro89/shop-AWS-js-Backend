import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { requestToEb } from './axi.requests';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class AppService {
  async getAll(
    recipient: string,
    method: string,
    createItemDto?: CreateItemDto,
    productId?: string,
  ): Promise<AxiosResponse<any, any>> {
    const recipientURL = process.env[recipient];
    if (recipientURL) {
      const pathToReq = productId
        ? `${recipientURL}/${recipient}/${productId}`
        : `${recipientURL}/${recipient}`;
      const res = await requestToEb(pathToReq, method, createItemDto);
      // console.log(res.data);
      // const test = await res;
      // console.log(test);
      return res;
    }
  }

  sendToCart(
    recipient: string,
    method: string,
  ): Promise<AxiosResponse<any, any>> {
    const recipientURL = process.env[recipient];
    if (recipientURL) {
      return requestToEb(recipientURL, method);
    }
  }
}
