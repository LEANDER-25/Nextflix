import { Test, TestingModule } from '@nestjs/testing';
import { AquafinaService } from './aquafina.service';

describe('AquafinaService', () => {
  let service: AquafinaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AquafinaService],
    }).compile();

    service = module.get<AquafinaService>(AquafinaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
