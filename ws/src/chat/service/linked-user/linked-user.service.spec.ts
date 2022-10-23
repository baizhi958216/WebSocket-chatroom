import { Test, TestingModule } from '@nestjs/testing';
import { LinkedUserService } from './linked-user.service';

describe('LinkedUserService', () => {
  let service: LinkedUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkedUserService],
    }).compile();

    service = module.get<LinkedUserService>(LinkedUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
