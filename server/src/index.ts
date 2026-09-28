import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import type { Rabbit, CareLog, FoodEntry, WeightMeasurement, HealthRecord, MemoryEntry } from '@bunny-log/shared';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

const rabbits: Rabbit[] = [
  { id: 'rabbit-1', name: 'Clover', breed: 'Mini Lop', dob: '2022-04-01', notes: 'Loves hay and sun naps.' },
  { id: 'rabbit-2', name: 'Maple', breed: 'Netherland Dwarf', dob: '2023-02-14', notes: 'Needs occasional hydration check.' },
  { id: 'rabbit-3', name: 'Pippin', breed: 'Lionhead', dob: '2021-09-08', notes: 'Stable and energetic.' },
];

const careLogs: CareLog[] = [
  { id: 'log-1', rabbitId: 'rabbit-1', date: '2026-09-28', checkIns: ['Breakfast', 'Hydration'], notes: 'Alert and active.' },
  { id: 'log-2', rabbitId: 'rabbit-2', date: '2026-09-28', checkIns: ['Medication'], notes: 'Needs hydration check.' },
];

const foodEntries: FoodEntry[] = [
  { id: 'food-1', rabbitId: 'rabbit-1', date: '2026-09-28', foodName: 'Fresh greens', quantity: 1.2, favorite: true },
  { id: 'food-2', rabbitId: 'rabbit-2', date: '2026-09-28', foodName: 'Pellets', quantity: 0.8, favorite: true },
];

const weights: WeightMeasurement[] = [
  { id: 'weight-1', rabbitId: 'rabbit-1', date: '2026-09-28', value: 1.8, unit: 'kg' },
  { id: 'weight-2', rabbitId: 'rabbit-2', date: '2026-09-28', value: 1.6, unit: 'kg' },
];

const healthRecords: HealthRecord[] = [
  { id: 'health-1', rabbitId: 'rabbit-1', date: '2026-09-28', category: 'General', summary: 'Healthy and active', reminderDate: '2026-09-30' },
  { id: 'health-2', rabbitId: 'rabbit-2', date: '2026-09-27', category: 'Hydration', summary: 'Hydration needs attention', reminderDate: '2026-09-29' },
];

const memories: MemoryEntry[] = [
  { id: 'memory-1', rabbitId: 'rabbit-1', caption: 'Napping in the warm sun', capturedAt: '2026-09-12T10:00:00.000Z', blobKey: 'sunnap.jpg' },
  { id: 'memory-2', rabbitId: 'rabbit-2', caption: 'Snack time with fresh greens', capturedAt: '2026-09-15T15:30:00.000Z', blobKey: 'snacktime.jpg' },
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', services: { database: 'ok', storage: 'ok' } });
});

app.get('/api/rabbits', (_req, res) => {
  res.json(rabbits);
});

app.post('/api/rabbits', (req, res) => {
  const { name, breed, dob, notes } = req.body as Partial<Rabbit>;
  if (!name || !breed || !dob) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required rabbit fields' } });
  }
  const rabbit: Rabbit = {
    id: randomUUID(),
    name,
    breed,
    dob,
    notes: notes ?? '',
  };
  rabbits.push(rabbit);
  return res.status(201).json(rabbit);
});

app.get('/api/daily-logs', (_req, res) => {
  res.json(careLogs);
});

app.post('/api/daily-logs', (req, res) => {
  const { rabbitId, date, checkIns, notes } = req.body as Partial<CareLog>;
  if (!rabbitId || !date || !Array.isArray(checkIns)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid daily log payload' } });
  }
  const log: CareLog = { id: randomUUID(), rabbitId, date, checkIns, notes: notes ?? '' };
  careLogs.push(log);
  return res.status(201).json(log);
});

app.get('/api/food-entries', (_req, res) => {
  res.json(foodEntries);
});

app.post('/api/food-entries', (req, res) => {
  const { rabbitId, date, foodName, quantity, favorite } = req.body as Partial<FoodEntry>;
  if (!rabbitId || !date || !foodName || typeof quantity !== 'number') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid food entry payload' } });
  }
  const entry: FoodEntry = { id: randomUUID(), rabbitId, date, foodName, quantity, favorite: Boolean(favorite) };
  foodEntries.push(entry);
  return res.status(201).json(entry);
});

app.get('/api/weight-measurements', (_req, res) => {
  res.json(weights);
});

app.post('/api/weight-measurements', (req, res) => {
  const { rabbitId, date, value, unit } = req.body as Partial<WeightMeasurement>;
  if (!rabbitId || !date || typeof value !== 'number' || !unit) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid weight payload' } });
  }
  const record: WeightMeasurement = { id: randomUUID(), rabbitId, date, value, unit };
  weights.push(record);
  return res.status(201).json(record);
});

app.get('/api/health-records', (_req, res) => {
  res.json(healthRecords);
});

app.post('/api/health-records', (req, res) => {
  const { rabbitId, date, category, summary, reminderDate } = req.body as Partial<HealthRecord>;
  if (!rabbitId || !date || !category || !summary) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid health record payload' } });
  }
  const record: HealthRecord = { id: randomUUID(), rabbitId, date, category, summary, reminderDate };
  healthRecords.push(record);
  return res.status(201).json(record);
});

app.get('/api/memories', (_req, res) => {
  res.json(memories);
});

app.post('/api/memories/upload', (req, res) => {
  const { rabbitId, caption } = req.body as Partial<MemoryEntry>;
  if (!rabbitId || !caption) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid memory upload payload' } });
  }
  const entry: MemoryEntry = {
    id: randomUUID(),
    rabbitId,
    caption,
    capturedAt: new Date().toISOString(),
    blobKey: `upload-${randomUUID()}.jpg`,
  };
  memories.push(entry);
  return res.status(201).json({ id: entry.id, caption: entry.caption, blobUrl: `https://example.com/${entry.blobKey}` });
});

app.listen(port, () => {
  console.log(`Bunny Log API running on http://localhost:${port}`);
});
