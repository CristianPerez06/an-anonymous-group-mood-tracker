import {
  IsArray,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PublicSignalsDto {
  @IsString()
  @IsHexadecimal()
  merkleRoot!: string;

  @IsString()
  @IsHexadecimal()
  nullifier!: string;

  @IsString()
  @IsHexadecimal()
  message!: string;

  @IsString()
  @IsNotEmpty()
  scope!: string;
}

export class SubmitMoodDto {
  @IsArray()
  proof!: any[]; // Semaphore proof array

  @ValidateNested()
  @Type(() => PublicSignalsDto)
  publicSignals!: PublicSignalsDto;

  @IsString()
  @IsNotEmpty()
  rawMessage!: string; // e.g., "happy", "neutral", "sad"
}
