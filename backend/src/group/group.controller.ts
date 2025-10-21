import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateGroupDto, AddMemberDto } from './dto';
import { GroupsService } from './group.service';

@Controller('group')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class GroupController {
  constructor(private readonly svc: GroupsService) {}

  /** Create a group: POST /groups
   *  body: { id: string, depth?: number }
   *  returns: { id, depth, root, size }
   */
  @Post()
  create(@Body() dto: CreateGroupDto) {
    try {
      const depth = dto.depth ?? 20;
      return this.svc.createGroup(dto.id, depth);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot create group',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /** Add member: POST /groups/:id/members
   *  body: { commitment: 0x... }
   *  returns: { index, root }
   */
  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    try {
      return this.svc.addMember(id, dto.commitment);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot add member',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /** Get group data: GET /groups/:id
   *  returns: { id, depth, root, size, commitments }
   */
  @Get(':id')
  getGroupData(@Param('id') id: string) {
    try {
      return this.svc.getGroupData(id);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'group not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
