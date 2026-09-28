import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { Pool } from 'pg';
import type { ErrorRequestHandler, Request, RequestHandler, Response } from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/bunnylog',
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const validDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

const validationError = (res: Response, message: string) =>
  res.status(400).json({ error: { code: 'VALIDATION_ERROR', message } });

app.get('/api/health', asyncHandler(async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'degraded', services: { database: 'ok', storage: 'down' } });
  } catch {
    return res.status(503).json({ status: 'degraded', services: { database: 'down', storage: 'down' } });
  }
}));

app.get('/api/rabbits', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, name, breed, dob::text AS dob, notes FROM rabbits ORDER BY name');
  res.json(result.rows);
}));

app.post('/api/rabbits', asyncHandler(async (req, res) => {
  const { name, breed, dob, notes } = req.body as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim() || typeof breed !== 'string' || !breed.trim() || !validDate(dob)) {
    validationError(res, 'Name, breed, and a valid date of birth are required');
    return;
  }
  const result = await pool.query(
    'INSERT INTO rabbits (id, name, breed, dob, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, breed, dob::text AS dob, notes',
    [randomUUID(), name.trim(), breed.trim(), dob, typeof notes === 'string' ? notes : ''],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/daily-logs', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, rabbit_id AS "rabbitId", date::text AS date, check_ins AS "checkIns", notes FROM care_logs ORDER BY date DESC, created_at DESC');
  res.json(result.rows);
}));

app.post('/api/daily-logs', asyncHandler(async (req, res) => {
  const { rabbitId, date, checkIns, notes } = req.body as Record<string, unknown>;
  if (typeof rabbitId !== 'string' || !validDate(date) || !Array.isArray(checkIns) || !checkIns.every((item) => typeof item === 'string')) {
    validationError(res, 'Rabbit, valid date, and string check-ins are required');
    return;
  }
  const result = await pool.query(
    'INSERT INTO care_logs (id, rabbit_id, date, check_ins, notes) VALUES ($1, $2, $3, $4, $5) RETURNING id, rabbit_id AS "rabbitId", date::text AS date, check_ins AS "checkIns", notes',
    [randomUUID(), rabbitId, date, JSON.stringify(checkIns), typeof notes === 'string' ? notes : ''],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/food-entries', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, rabbit_id AS "rabbitId", date::text AS date, food_name AS "foodName", quantity::float8 AS quantity, favorite FROM food_entries ORDER BY date DESC, created_at DESC');
  res.json(result.rows);
}));

app.post('/api/food-entries', asyncHandler(async (req, res) => {
  const { rabbitId, date, foodName, quantity, favorite } = req.body as Record<string, unknown>;
  if (typeof rabbitId !== 'string' || !validDate(date) || typeof foodName !== 'string' || !foodName.trim() || typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 0 || (favorite !== undefined && typeof favorite !== 'boolean')) {
    validationError(res, 'Rabbit, valid date, food name, non-negative quantity, and optional favorite flag are required');
    return;
  }
  const result = await pool.query(
    'INSERT INTO food_entries (id, rabbit_id, date, food_name, quantity, favorite) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, rabbit_id AS "rabbitId", date::text AS date, food_name AS "foodName", quantity::float8 AS quantity, favorite',
    [randomUUID(), rabbitId, date, foodName.trim(), quantity, favorite ?? false],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/weight-measurements', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, rabbit_id AS "rabbitId", date::text AS date, value::float8 AS value, unit FROM weight_measurements ORDER BY date DESC, created_at DESC');
  res.json(result.rows);
}));

app.post('/api/weight-measurements', asyncHandler(async (req, res) => {
  const { rabbitId, date, value, unit } = req.body as Record<string, unknown>;
  if (typeof rabbitId !== 'string' || !validDate(date) || typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || unit !== 'kg') {
    validationError(res, 'Rabbit, valid date, positive weight, and kg unit are required');
    return;
  }
  const result = await pool.query(
    'INSERT INTO weight_measurements (id, rabbit_id, date, value, unit) VALUES ($1, $2, $3, $4, $5) RETURNING id, rabbit_id AS "rabbitId", date::text AS date, value::float8 AS value, unit',
    [randomUUID(), rabbitId, date, value, unit],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/health-records', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, rabbit_id AS "rabbitId", date::text AS date, category, summary, reminder_date::text AS "reminderDate" FROM health_records ORDER BY date DESC, created_at DESC');
  res.json(result.rows);
}));

app.post('/api/health-records', asyncHandler(async (req, res) => {
  const { rabbitId, date, category, summary, reminderDate } = req.body as Record<string, unknown>;
  if (typeof rabbitId !== 'string' || !validDate(date) || typeof category !== 'string' || !category.trim() || typeof summary !== 'string' || !summary.trim() || (reminderDate !== undefined && reminderDate !== null && !validDate(reminderDate))) {
    validationError(res, 'Rabbit, valid date, category, summary, and optional valid reminder date are required');
    return;
  }
  const result = await pool.query(
    'INSERT INTO health_records (id, rabbit_id, date, category, summary, reminder_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, rabbit_id AS "rabbitId", date::text AS date, category, summary, reminder_date::text AS "reminderDate"',
    [randomUUID(), rabbitId, date, category.trim(), summary.trim(), reminderDate ?? null],
  );
  res.status(201).json(result.rows[0]);
}));

app.get('/api/memories', asyncHandler(async (_req, res) => {
  const result = await pool.query('SELECT id, rabbit_id AS "rabbitId", caption, captured_at AS "capturedAt", blob_key AS "blobKey" FROM memories ORDER BY captured_at DESC');
  res.json(result.rows);
}));

app.get('/api/memories/:id/content', asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT image_data, content_type FROM memories WHERE id = $1', [req.params.id]);
  if (!result.rowCount || !result.rows[0].image_data) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Memory image not found' } });
    return;
  }
  res.type(result.rows[0].content_type ?? 'application/octet-stream').send(result.rows[0].image_data);
}));

app.post('/api/memories/upload', upload.single('photo'), asyncHandler(async (req: Request, res: Response) => {
  const { rabbitId, caption } = req.body as Record<string, unknown>;
  const file = req.file;
  if (typeof rabbitId !== 'string' || typeof caption !== 'string' || !caption.trim() || !file || !file.mimetype.startsWith('image/')) {
    validationError(res, 'Rabbit, caption, and an image file named photo are required');
    return;
  }
  const id = randomUUID();
  const blobKey = `memories/${id}`;
  const result = await pool.query(
    'INSERT INTO memories (id, rabbit_id, caption, blob_key, image_data, content_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, caption',
    [id, rabbitId, caption.trim(), blobKey, file.buffer, file.mimetype],
  );
  res.status(201).json({ id: result.rows[0].id, caption: result.rows[0].caption, blobUrl: `/api/memories/${id}/content` });
}));

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    res.status(status).json({ error: { code: error.code, message: error.message } });
    return;
  }
  const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined;
  if (code === '23503' || code === '23514' || code === '22P02' || code === '22007') {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'The request references invalid data' } });
    return;
  }
  console.error(error);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed' } });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Bunny Log API running on http://localhost:${port}`);
});
