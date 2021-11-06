import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { requestToEb } from './axi.requests';
import { CreateItemDto } from './dto/create-item.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getAll(
    recipient: string,
    method: string,
    createItemDto?: CreateItemDto,
    productId?: string,
  ): Promise<any> {
    const value = await this.cacheManager.get(recipient);
    if (value !== undefined && method === 'GET' && !productId) {
      return value;
    }

    const recipientURL = process.env[recipient];
    if (recipientURL) {
      const pathToReq = productId
        ? `${recipientURL}/${recipient}/${productId}`
        : `${recipientURL}/${recipient}`;
      const res = await requestToEb(pathToReq, method, createItemDto);
      if (method === 'GET' && !productId) {
        await this.cacheManager.set(recipient, res);
        console.log('Cashed!');
      }
      return res;
    } else {
      throw new HttpException(
        `Environment ${recipient} not found!`,
        HttpStatus.NOT_FOUND,
      );
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
