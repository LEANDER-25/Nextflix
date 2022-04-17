import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AquafinaService } from './aquafina.service';
import { CreateAquafinaDto } from './dto/create-aquafina.dto';
import { UpdateAquafinaDto } from './dto/update-aquafina.dto';

@Controller('aquafina')
export class AquafinaController {
  constructor(private readonly aquafinaService: AquafinaService) {}

  @Post()
  create(@Body() createAquafinaDto: CreateAquafinaDto) {
    return this.aquafinaService.create(createAquafinaDto);
  }

  @Get()
  findAll() {
    return this.aquafinaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aquafinaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAquafinaDto: UpdateAquafinaDto) {
    return this.aquafinaService.update(+id, updateAquafinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aquafinaService.remove(+id);
  }
}
