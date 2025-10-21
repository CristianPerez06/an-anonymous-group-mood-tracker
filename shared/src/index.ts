export type Scope = string; // e.g., "2025-10-18"
export type CommitmentHex = `0x${string}`;

export interface PublicSignals {
  merkleRoot: string;
  nullifier: string;
  message: string; // hashed by SDK
  scope: Scope;
}

export interface SubmitPayload {
  proof: unknown;
  publicSignals: PublicSignals;
  rawMessage: string; // optional: what user picked ("happy")
}

// API Response Types
export interface RootResponse {
  root: string;
}

export interface WitnessResponse {
  error?: string;
  pathIndices?: number[];
  siblings?: string[];
}

export interface JoinResponse {
  index: number;
  root: string;
  error?: string;
}

export interface MoodResponse {
  error?: string;
}

export interface GroupDataResponse {
  id: string;
  depth: number;
  root: string;
  size: number;
  commitments: string[];
}

// Mood-related types
export interface MoodSignal {
  scope: string;
  mood: string;
  nullifier: string;
  timestamp: number;
}

export interface SubmitMoodResponse {
  success: boolean;
  signal: MoodSignal;
  aggregates: Record<string, number>;
}

export interface MoodDataResponse {
  signals: MoodSignal[];
  aggregates: Record<string, number>;
  signalsCount: number;
  uniqueMembersCount: number;
}

export interface NullifierCheckResponse {
  used: boolean;
}

export interface SignalsCountResponse {
  signalsCount: number;
  uniqueMembersCount: number;
}
