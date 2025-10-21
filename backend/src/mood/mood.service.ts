import { Injectable } from '@nestjs/common';
import { MoodStore } from './mood.state';
import { SubmitMoodDto } from './dto';

@Injectable()
export class MoodService {
  private store = new MoodStore();

  async submitMood(dto: SubmitMoodDto) {
    // TODO: Add proof verification logic here
    // For now, we'll just store the signal

    const signal = this.store.addSignal({
      scope: dto.publicSignals.scope,
      mood: dto.rawMessage,
      nullifier: dto.publicSignals.nullifier,
    });

    return {
      success: true,
      signal,
      aggregates: this.store.getAggregates(dto.publicSignals.scope),
    };
  }

  getMoodData(scope?: string) {
    return {
      signals: this.store.getSignals(scope),
      aggregates: this.store.getAggregates(scope),
      signalsCount: this.store.getSignalsCount(scope),
      uniqueMembersCount: this.store.getUniqueMembersCount(scope),
    };
  }

  getSignalsCount(scope?: string): number {
    return this.store.getSignalsCount(scope);
  }

  getUniqueMembersCount(scope?: string): number {
    return this.store.getUniqueMembersCount(scope);
  }

  isNullifierUsed(nullifier: string): boolean {
    return this.store.isNullifierUsed(nullifier);
  }
}
