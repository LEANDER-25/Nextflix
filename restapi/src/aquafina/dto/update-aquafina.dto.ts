import { PartialType } from '@nestjs/mapped-types';
import { CreateAquafinaDto } from './create-aquafina.dto';

export class UpdateAquafinaDto extends PartialType(CreateAquafinaDto) {}
