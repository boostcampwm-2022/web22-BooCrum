import { Test, TestingModule } from '@nestjs/testing';
import { MongooseObjectHandlerService } from './mongoose-object-handler.service';

describe('MongooseObjectHandlerService', () => {
  let service: MongooseObjectHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongooseObjectHandlerService],
    }).compile();

    service = module.get<MongooseObjectHandlerService>(MongooseObjectHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
