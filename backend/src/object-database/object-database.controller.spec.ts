import { Test, TestingModule } from '@nestjs/testing';
import { ObjectDatabaseController } from './object-database.controller';

describe('ObjectDatabaseController', () => {
  let controller: ObjectDatabaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectDatabaseController],
    }).compile();

    controller = module.get<ObjectDatabaseController>(ObjectDatabaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
