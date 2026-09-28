export type Rabbit = {
  id: string;
  name: string;
  breed: string;
  dob: string;
  notes: string;
};

export type CareLog = {
  id: string;
  rabbitId: string;
  date: string;
  checkIns: string[];
  notes: string;
};

export type FoodEntry = {
  id: string;
  rabbitId: string;
  date: string;
  foodName: string;
  quantity: number;
  quantityUnit: 'kg' | 'tablespoon' | 'pill' | 'tablet' | 'handful' | 'serving';
  favorite: boolean;
};

export type WeightMeasurement = {
  id: string;
  rabbitId: string;
  date: string;
  value: number;
  unit: 'kg';
};

export type HealthRecord = {
  id: string;
  rabbitId: string;
  date: string;
  category: string;
  summary: string;
  reminderDate?: string;
};

export type MemoryEntry = {
  id: string;
  rabbitId: string;
  caption: string;
  capturedAt: string;
  blobKey: string;
};

export type ApiHealth = {
  status: 'ok' | 'degraded';
  services: {
    database: 'ok' | 'down';
    storage: 'ok' | 'down';
  };
};
