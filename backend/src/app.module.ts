import { Module } from '@nestjs/common';
import { GroupController } from './group/group.controller';
import { GroupsService } from './group/group.service';
import { HealthController } from './health/health.controller';
import { MoodController } from './mood/mood.controller';
import { MoodService } from './mood/mood.service';

@Module({
  controllers: [GroupController, HealthController, MoodController],
  providers: [GroupsService, MoodService],
})
export class AppModule {}
