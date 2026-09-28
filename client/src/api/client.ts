import type {
  ApiHealth,
  CareLog,
  FoodEntry,
  HealthRecord,
  MemoryEntry,
  Rabbit,
  WeightMeasurement,
} from '@bunny-log/shared';
import type { ApiClient } from './types';

const API_BASE = '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { message?: string } } | null;
    throw new Error(body?.error?.message ?? response.statusText);
  }
  return response.json() as Promise<T>;
}

function create<T>(path: string, input: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(input) });
}

export const liveClient: ApiClient = {
  health: () => request<ApiHealth>('/health'),
  listRabbits: () => request<Rabbit[]>('/rabbits'),
  createRabbit: (input) => create<Rabbit>('/rabbits', input),
  listCareLogs: () => request<CareLog[]>('/daily-logs'),
  createCareLog: (input) => create<CareLog>('/daily-logs', input),
  listFoodEntries: () => request<FoodEntry[]>('/food-entries'),
  createFoodEntry: (input) => create<FoodEntry>('/food-entries', input),
  listWeightMeasurements: () => request<WeightMeasurement[]>('/weight-measurements'),
  createWeightMeasurement: (input) => create<WeightMeasurement>('/weight-measurements', input),
  listHealthRecords: () => request<HealthRecord[]>('/health-records'),
  createHealthRecord: (input) => create<HealthRecord>('/health-records', input),
  listMemories: () => request<MemoryEntry[]>('/memories'),
  uploadMemory: (input) => request('/memories/upload', { method: 'POST', body: input }),
};

export const memoryContentUrl = (id: string): string => `${API_BASE}/memories/${encodeURIComponent(id)}/content`;