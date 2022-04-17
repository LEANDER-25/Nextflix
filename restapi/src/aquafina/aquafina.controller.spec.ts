import { Test, TestingModule } from '@nestjs/testing';
import { AquafinaController } from './aquafina.controller';
import { AquafinaService } from './aquafina.service';

describe('AquafinaController', () => {
  let controller: AquafinaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AquafinaController],
      providers: [AquafinaService],
    }).compile();

    controller = module.get<AquafinaController>(AquafinaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
