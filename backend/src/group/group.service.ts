import { Injectable } from '@nestjs/common';
import { GroupsStore } from './group.state';
import { MerkleProof } from '@semaphore-protocol/group';

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
    const result = this.store.addMember(id, commitment);
    console.log('addMember result:', result);
    return result;
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

  getGroupRoot(id: string) {
    const state = this.store.get(id);
    if (!state) throw new Error('group not found');

    return {
      root: state.group.root.toString(),
    };
  }

  getWitness(id: string, memberIndex: number) {
    console.log('getWitness', id, memberIndex);

    const state = this.store.get(id);
    if (!state) throw new Error('group not found');

    if (memberIndex >= state.commitments.length) {
      return { error: 'member index out of bounds' };
    }

    try {
      const witness: MerkleProof = state.group.generateMerkleProof(memberIndex);
      // Return the raw witness object to see what the frontend actually expects
      return {
        root: witness.root.toString(),
        leaf: witness.leaf.toString(),
        index: witness.index,
        siblings: witness.siblings.map((s) => s.toString()),
      };
    } catch (error) {
      return { error: 'failed to generate witness' };
    }
  }
}
