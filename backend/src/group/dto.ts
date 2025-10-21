import {
  IsHexadecimal,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateGroupDto {
  @IsString()
  id!: string; // your chosen group id (e.g., "default" or uuid)

  @IsInt()
  @IsPositive()
  @IsOptional()
  depth?: number; // default 20
}

export class AddMemberDto {
  @IsString()
  @IsHexadecimal()
  @Length(2) // "0x..." allowed; we accept hex without enforcing length here
  commitment!: string;
}
