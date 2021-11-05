import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerController } from './error-handler.controller';

describe('ErrorHandlerController', () => {
  let controller: ErrorHandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorHandlerController],
    }).compile();

    controller = module.get<ErrorHandlerController>(ErrorHandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
