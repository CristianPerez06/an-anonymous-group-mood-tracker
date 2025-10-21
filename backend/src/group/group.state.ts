import { Group } from '@semaphore-protocol/group';

export type GroupId = string;

export interface GroupState {
  id: GroupId;
  depth: number;
  group: Group;
  commitments: string[]; // hex strings (leaves)
}

export class GroupsStore {
  // In-memory registry of groups by id
  private groups = new Map<GroupId, GroupState>();

  get(id: GroupId) {
    return this.groups.get(id);
  }

  has(id: GroupId) {
    return this.groups.has(id);
  }

  create(id: GroupId, depth: number) {
    if (this.groups.has(id)) throw new Error('group already exists');
    const group = new Group([BigInt(depth)]);
    const state: GroupState = { id, depth, group, commitments: [] };
    this.groups.set(id, state);
    return state;
  }

  addMember(id: GroupId, commitment: string) {
    const state = this.get(id);
    if (!state) throw new Error('group not found');
    state.group.addMember(commitment);
    state.commitments.push(commitment);
    return {
      index: state.commitments.length - 1,
      root: state.group.root.toString(),
    };
  }
}
