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

  /** Add member: POST /group/:id/members
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

  /** Get group data: GET /group/:id
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

  /** Get group root: GET /group/:id/root
   *  returns: { root }
   */
  @Get(':id/root')
  getGroupRoot(@Param('id') id: string) {
    try {
      return this.svc.getGroupRoot(id);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'group not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** Get all groups: GET /group
   *  returns: [{ id, depth, root, size }]
   */
  @Get()
  getAllGroups() {
    try {
      return this.svc.getAllGroups();
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'failed to get groups',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /** Get witness for member: GET /group/:id/witness/:index
   *  returns: { pathIndices, siblings } or { error }
   */
  @Get(':id/witness/:index')
  getWitness(@Param('id') id: string, @Param('index') index: string) {
    try {
      const memberIndex = parseInt(index, 10);
      if (isNaN(memberIndex) || memberIndex < 0) {
        throw new Error('invalid member index');
      }
      return this.svc.getWitness(id, memberIndex);
    } catch (e: any) {
      throw new HttpException(
        e.message ?? 'cannot get witness',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
