import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubmitMoodDto } from './dto';
import { MoodService } from './mood.service';

@Controller('mood')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  /** Submit mood signal: POST /mood
   *  body: { proof, publicSignals, rawMessage }
   *  returns: { success, signal, aggregates }
   */
  @Post()
  async submitMood(@Body() dto: SubmitMoodDto) {
    try {
      return await this.moodService.submitMood(dto);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot submit mood',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /** Get mood data: GET /mood?scope=2025-01-18
   *  returns: { signals, aggregates }
   */
  @Get()
  getMoodData(@Query('scope') scope?: string) {
    try {
      return this.moodService.getMoodData(scope);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot get mood data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** Check if nullifier is used: GET /mood/nullifier/:nullifier
   *  returns: { used: boolean }
   */
  @Get('nullifier/:nullifier')
  checkNullifier(@Param('nullifier') nullifier: string) {
    try {
      return { used: this.moodService.isNullifierUsed(nullifier) };
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot check nullifier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** Get signals count: GET /mood/count?scope=2025-01-18
   *  returns: { signalsCount: number, uniqueMembersCount: number }
   */
  @Get('count')
  getSignalsCount(@Query('scope') scope?: string) {
    try {
      return {
        signalsCount: this.moodService.getSignalsCount(scope),
        uniqueMembersCount: this.moodService.getUniqueMembersCount(scope),
      };
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot get signals count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
