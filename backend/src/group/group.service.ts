import { Injectable } from '@nestjs/common';
import { GroupsStore } from './group.state';

@Injectable()
export class GroupsService {
  private store = new GroupsStore();

  createGroup(id: string, depth = 20) {
    const state = this.store.create(id, depth);
    return {
      id: state.id,
      depth: state.depth,
      root: state.group.root.toString(),
      size: state.commitments.length,
    };
  }

  addMember(id: string, commitment: string) {
    return this.store.addMember(id, commitment); // returns { index, root }
  }

  getGroupData(id: string) {
    const state = this.store.get(id);
    if (!state) throw new Error('group not found');

    return {
      id: state.id,
      depth: state.depth,
      root: state.group.root.toString(),
      size: state.commitments.length,
      commitments: state.commitments,
    };
  }
}
