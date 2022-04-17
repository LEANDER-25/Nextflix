import { Injectable } from '@nestjs/common';
import { CreateAquafinaDto } from './dto/create-aquafina.dto';
import { UpdateAquafinaDto } from './dto/update-aquafina.dto';

@Injectable()
export class AquafinaService {
  create(createAquafinaDto: CreateAquafinaDto) {
    return 'This action adds a new aquafina';
  }

  findAll() {
    return `This action returns all aquafina`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aquafina`;
  }

  update(id: number, updateAquafinaDto: UpdateAquafinaDto) {
    return `This action updates a #${id} aquafina`;
  }

  remove(id: number) {
    return `This action removes a #${id} aquafina`;
  }
}
