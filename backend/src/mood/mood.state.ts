export interface MoodSignal {
  scope: string; // e.g., "2025-01-18"
  mood: string; // e.g., "happy", "neutral", "sad"
  nullifier: string; // unique identifier for this signal
  timestamp: number;
}

export class MoodStore {
  private signals: MoodSignal[] = [];
  private usedNullifiers = new Set<string>();
  private aggregates = new Map<string, Record<string, number>>(); // scope -> {mood: count}

  addSignal(signal: Omit<MoodSignal, 'timestamp'>) {
    const timestamp = Date.now();
    const fullSignal: MoodSignal = { ...signal, timestamp };

    // Check for nullifier reuse
    if (this.usedNullifiers.has(signal.nullifier)) {
      throw new Error('nullifier already used');
    }

    this.signals.push(fullSignal);
    this.usedNullifiers.add(signal.nullifier);

    // Update aggregates
    this.updateAggregates(signal.scope, signal.mood);

    return fullSignal;
  }

  getSignals(scope?: string) {
    if (scope) {
      return this.signals.filter((s) => s.scope === scope);
    }
    return this.signals;
  }

  getAggregates(scope?: string) {
    if (scope) {
      return this.aggregates.get(scope) || {};
    }
    return Object.fromEntries(this.aggregates);
  }

  private updateAggregates(scope: string, mood: string) {
    const current = this.aggregates.get(scope) || {};
    current[mood] = (current[mood] || 0) + 1;
    this.aggregates.set(scope, current);
  }

  isNullifierUsed(nullifier: string): boolean {
    return this.usedNullifiers.has(nullifier);
  }

  getSignalsCount(scope?: string): number {
    if (scope) {
      return this.signals.filter((s) => s.scope === scope).length;
    }
    return this.signals.length;
  }

  getUniqueMembersCount(scope?: string): number {
    const signals = scope
      ? this.signals.filter((s) => s.scope === scope)
      : this.signals;
    // Extract member identifier from nullifier (assuming pattern like 0x1a2b3c000001)
    const memberIds = signals.map((s) => s.nullifier.slice(0, 8)); // Extract first 8 chars as member ID
    return new Set(memberIds).size;
  }
}
