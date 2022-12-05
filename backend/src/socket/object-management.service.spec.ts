import { Test, TestingModule } from '@nestjs/testing';
import { ObjectManagementService } from './object-management.service';

describe('ObjectManagementService', () => {
  let service: ObjectManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ObjectManagementService],
    }).compile();

    service = module.get<ObjectManagementService>(ObjectManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
