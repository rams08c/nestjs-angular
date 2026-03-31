import { Body, Controller, Get, Put } from '@nestjs/common';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  get(@CurrentUserId() userId: string) {
    return this.settingsService.get(userId);
  }

  @Put()
  update(@CurrentUserId() userId: string, @Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(userId, dto);
  }
}
