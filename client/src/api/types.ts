import type {
  ApiHealth,
  CareLog,
  FoodEntry,
  HealthRecord,
  MemoryEntry,
  Rabbit,
  WeightMeasurement,
} from '@bunny-log/shared';

export interface ApiClient {
  health(): Promise<ApiHealth>;
  listRabbits(): Promise<Rabbit[]>;
  createRabbit(input: Omit<Rabbit, 'id'>): Promise<Rabbit>;
  listCareLogs(): Promise<CareLog[]>;
  createCareLog(input: Omit<CareLog, 'id'>): Promise<CareLog>;
  listFoodEntries(): Promise<FoodEntry[]>;
  createFoodEntry(input: Omit<FoodEntry, 'id'>): Promise<FoodEntry>;
  listWeightMeasurements(): Promise<WeightMeasurement[]>;
  createWeightMeasurement(input: Omit<WeightMeasurement, 'id'>): Promise<WeightMeasurement>;
  listHealthRecords(): Promise<HealthRecord[]>;
  createHealthRecord(input: Omit<HealthRecord, 'id'>): Promise<HealthRecord>;
  listMemories(): Promise<MemoryEntry[]>;
  uploadMemory(input: FormData): Promise<{ id: string; caption: string; blobUrl: string }>;
}