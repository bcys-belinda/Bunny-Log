exports.up = async function up(knex) {
  await knex.raw(`
    CREATE TABLE rabbits (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL CHECK (length(trim(name)) > 0),
      breed TEXT NOT NULL,
      dob DATE NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE care_logs (
      id UUID PRIMARY KEY,
      rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      check_ins JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(check_ins) = 'array'),
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX care_logs_rabbit_date_idx ON care_logs (rabbit_id, date DESC);

    CREATE TABLE food_entries (
      id UUID PRIMARY KEY,
      rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      food_name TEXT NOT NULL CHECK (length(trim(food_name)) > 0),
      quantity NUMERIC(10, 3) NOT NULL CHECK (quantity >= 0),
      favorite BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX food_entries_rabbit_date_idx ON food_entries (rabbit_id, date DESC);

    CREATE TABLE weight_measurements (
      id UUID PRIMARY KEY,
      rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      value NUMERIC(8, 3) NOT NULL CHECK (value > 0),
      unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit = 'kg'),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX weight_measurements_rabbit_date_idx ON weight_measurements (rabbit_id, date DESC);

    CREATE TABLE health_records (
      id UUID PRIMARY KEY,
      rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      category TEXT NOT NULL CHECK (length(trim(category)) > 0),
      summary TEXT NOT NULL CHECK (length(trim(summary)) > 0),
      reminder_date DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX health_records_rabbit_date_idx ON health_records (rabbit_id, date DESC);
    CREATE INDEX health_records_reminder_date_idx ON health_records (reminder_date) WHERE reminder_date IS NOT NULL;

    CREATE TABLE memories (
      id UUID PRIMARY KEY,
      rabbit_id UUID NOT NULL REFERENCES rabbits(id) ON DELETE CASCADE,
      caption TEXT NOT NULL CHECK (length(trim(caption)) > 0),
      captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      blob_key TEXT NOT NULL UNIQUE
    );
    CREATE INDEX memories_rabbit_captured_at_idx ON memories (rabbit_id, captured_at DESC);
  `);
};

exports.down = async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS memories;
    DROP TABLE IF EXISTS health_records;
    DROP TABLE IF EXISTS weight_measurements;
    DROP TABLE IF EXISTS food_entries;
    DROP TABLE IF EXISTS care_logs;
    DROP TABLE IF EXISTS rabbits;
  `);
};