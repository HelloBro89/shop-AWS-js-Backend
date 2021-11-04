import axios, { AxiosResponse, Method } from 'axios';
import { CreateItemDto } from './dto/create-item.dto';

export const requestToEb = (
  recipientURL: string,
  recipient: string,
  method: string,
  createItemDto?: CreateItemDto,
): Promise<AxiosResponse<any, any>> => {
  return axios({
    method: method as Method,
    url: `${recipientURL}/${recipient}`,
    ...(Object.keys(createItemDto || {}).length > 0 && { data: createItemDto }),
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(`ERROR MESSAGE: ${JSON.stringify(error)}`);
      if (error.response) {
        return error.response;
      }
    });
};
