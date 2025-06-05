import { Controller, Get } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }
}
