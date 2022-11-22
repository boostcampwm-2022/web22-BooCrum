import { Test, TestingModule } from '@nestjs/testing';
import { ObjectDatabaseService } from './object-database.service';

describe('ObjectDatabaseService', () => {
  let service: ObjectDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectDatabaseService],
    }).compile();

    service = module.get<ObjectDatabaseService>(ObjectDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
