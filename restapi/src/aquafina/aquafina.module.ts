import { Module } from '@nestjs/common';
import { AquafinaService } from './aquafina.service';
import { AquafinaController } from './aquafina.controller';

@Module({
  controllers: [AquafinaController],
  providers: [AquafinaService]
})
export class AquafinaModule {}
