import { Test, TestingModule } from '@nestjs/testing';
import { ObjectHandlerService } from './object-handler.service';

describe('ObjectHandlerService', () => {
  let service: ObjectHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectHandlerService],
    }).compile();

    service = module.get<ObjectHandlerService>(ObjectHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
