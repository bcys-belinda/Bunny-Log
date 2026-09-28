import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, Text, Button, Card, Title3, Subtitle2, Avatar, Badge } from '@fluentui/react-components';
import { Home24Regular, CalendarToday24Regular, Food24Regular, DataTrending24Regular, HeartPulse24Regular, Image24Regular, Settings24Regular, ArrowRight24Regular, Star24Regular, Clock24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';
import type { CareLog, FoodEntry, HealthRecord, MemoryEntry, Rabbit, WeightMeasurement } from '@bunny-log/shared';
import { api, memoryContentUrl } from './api';

const navItems: Array<{ label: string; icon: React.ReactNode }> = [
  { label: 'Home', icon: <Home24Regular /> },
  { label: 'Daily Log', icon: <CalendarToday24Regular /> },
  { label: 'Food', icon: <Food24Regular /> },
  { label: 'Weight', icon: <DataTrending24Regular /> },
  { label: 'Health', icon: <HeartPulse24Regular /> },
  { label: 'Memories', icon: <Image24Regular /> },
  { label: 'Settings', icon: <Settings24Regular /> },
];

type DashboardData = {
  rabbits: Rabbit[];
  careLogs: CareLog[];
  foodEntries: FoodEntry[];
  weightMeasurements: WeightMeasurement[];
  healthRecords: HealthRecord[];
  memories: MemoryEntry[];
};

const today = new Date().toISOString().slice(0, 10);
const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString();

function reminderTiming(value: string): string {
  const days = Math.ceil((new Date(`${value}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86_400_000);
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

const styles: Record<string, React.CSSProperties> = {
  app: { display: 'flex', minHeight: '100vh', background: '#FBF8F1', color: '#2F2A27', fontFamily: 'Inter, system-ui, sans-serif' },
  sidebar: { width: '260px', background: '#F2EDE4', borderRight: '1px solid #E7DFD4', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '18px' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '24px', color: '#2F2A27' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'transparent', color: '#2F2A27', fontWeight: 600, cursor: 'pointer', border: '1px solid transparent' },
  activeNav: { background: '#7B8F73', color: '#fff', borderColor: '#7B8F73' },
  main: { flex: 1, padding: '28px 30px 40px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' },
  hero: { background: 'linear-gradient(135deg, #E6EFE2 0%, #FBF8F1 100%)', border: '1px solid #E7DFD4', borderRadius: '22px', padding: '28px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroText: { display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { padding: '18px 20px', borderRadius: '16px', background: '#fff', border: '1px solid #E7DFD4', boxShadow: '0 2px 6px rgba(47,42,39,0.04)' },
  section: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px', marginBottom: '24px' },
  listCard: { padding: '18px', borderRadius: '16px', background: '#fff', border: '1px solid #E7DFD4' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F0E7DA' },
  tinyLabel: { color: '#6F645C', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' },
  photoCard: { padding: 0, overflow: 'hidden', borderRadius: '18px', border: '1px solid #E7DFD4', background: '#fff' },
  photo: { width: '100%', height: '150px', objectFit: 'cover', display: 'block', background: 'linear-gradient(135deg, #DDD2C6, #C9D7C6)' },
};

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingLog, setSavingLog] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard() {
    try {
      const [rabbits, careLogs, foodEntries, weightMeasurements, healthRecords, memories] = await Promise.all([
        api.listRabbits(),
        api.listCareLogs(),
        api.listFoodEntries(),
        api.listWeightMeasurements(),
        api.listHealthRecords(),
        api.listMemories(),
      ]);
      setDashboard({ rabbits, careLogs, foodEntries, weightMeasurements, healthRecords, memories });
      setError('');
    } catch {
      setError('Care data could not be loaded. Check the API connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const rabbits = dashboard?.rabbits ?? [];
  const careLogs = dashboard?.careLogs ?? [];
  const foodEntries = dashboard?.foodEntries ?? [];
  const weightMeasurements = dashboard?.weightMeasurements ?? [];
  const healthRecords = dashboard?.healthRecords ?? [];
  const memories = dashboard?.memories ?? [];
  const focusRabbit = rabbits[0];
  const lastCareByRabbit = new Map<string, CareLog>();
  const lastWeightByRabbit = new Map<string, WeightMeasurement>();
  for (const log of careLogs) if (!lastCareByRabbit.has(log.rabbitId)) lastCareByRabbit.set(log.rabbitId, log);
  for (const measurement of weightMeasurements) if (!lastWeightByRabbit.has(measurement.rabbitId)) lastWeightByRabbit.set(measurement.rabbitId, measurement);
  const reminders = healthRecords
    .filter((record): record is HealthRecord & { reminderDate: string } => Boolean(record.reminderDate))
    .sort((left, right) => left.reminderDate.localeCompare(right.reminderDate))
    .slice(0, 3);
  const checkInsToday = careLogs.filter((log) => log.date === today).reduce((count, log) => count + log.checkIns.length, 0);
  const foodTotal = foodEntries.reduce((total, entry) => total + entry.quantity, 0);

  async function logToday() {
    if (!focusRabbit) return;
    setSavingLog(true);
    try {
      await api.createCareLog({ rabbitId: focusRabbit.id, date: today, checkIns: ['Daily care'], notes: '' });
      await loadDashboard();
    } catch {
      setError('The care check-in could not be saved.');
    } finally {
      setSavingLog(false);
    }
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={styles.app}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#7B8F73', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '22px' }}>🐇</div>
            Bunny Log
          </div>

          <nav style={styles.nav}>
            {navItems.map((item, index) => (
              <div key={item.label} style={{ ...styles.navItem, ...(index === 0 ? styles.activeNav : {}) }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          <Card style={{ padding: '18px', borderRadius: '18px', background: '#fff' }}>
            <div style={styles.tinyLabel}>Today</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <Avatar size={48} name="Clover" color="colorful" />
              <div>
                <Text weight="semibold">{focusRabbit?.name ?? 'No profiles yet'}</Text>
                  <div style={{ color: '#6F645C', fontSize: '12px' }}>{focusRabbit?.breed ?? 'Add a rabbit profile to begin'}</div>
              </div>
            </div>
          </Card>
        </aside>

        <main style={styles.main}>
          <div style={styles.topBar}>
            <div>
              <div style={styles.tinyLabel}>Good morning</div>
              <Title3 as="h1" style={{ margin: 0 }}>Bunny care dashboard</Title3>
            </div>
            <Button appearance="primary" icon={<ArrowRight24Regular />} disabled={!focusRabbit || savingLog} onClick={() => void logToday()}>
              {savingLog ? 'Saving...' : 'Log today'}
            </Button>
          </div>

          {loading && <Text role="status">Loading care data...</Text>}
          {error && <Text role="alert" style={{ display: 'block', color: '#A4262C', marginBottom: '16px' }}>{error}</Text>}

          <section style={styles.hero}>
            <div style={styles.heroText}>
              <Subtitle2 style={{ color: '#7B8F73' }}>Rabbit profile</Subtitle2>
              <Text style={{ fontSize: '32px', fontWeight: 700 }}>{focusRabbit ? `${focusRabbit.name}'s care overview` : 'No rabbit profiles yet'}</Text>
              <Text style={{ color: '#6F645C' }}>{focusRabbit ? `${focusRabbit.breed} · ${focusRabbit.notes || 'No profile notes'}` : 'Rabbit care records will appear here when available.'}</Text>
            </div>
            <Badge appearance="tint" color={focusRabbit ? 'success' : 'warning'} style={{ padding: '10px 16px', fontSize: '16px' }}>
              {focusRabbit ? 'Profile active' : 'No profile'}
            </Badge>
          </section>

          <section style={styles.summaryGrid}>
            {[
              ['Daily check-ins', String(checkInsToday), `Across ${rabbits.length} rabbits`],
              ['Food logged', `${foodTotal.toFixed(1)} kg`, `${foodEntries.length} entries`],
              ['Weight entries', String(weightMeasurements.length), weightMeasurements[0] ? `Latest: ${weightMeasurements[0].value} ${weightMeasurements[0].unit}` : 'No measurements'],
              ['Reminders', String(reminders.filter((record) => record.reminderDate <= today).length), `${reminders.length} scheduled`],
            ].map(([label, value, footer]) => (
              <Card key={String(label)} style={styles.statCard}>
                <div style={styles.tinyLabel}>{label}</div>
                <Title3 as="h3" style={{ marginTop: '10px', marginBottom: '6px' }}>{value}</Title3>
                <Text style={{ color: '#6F645C' }}>{footer}</Text>
              </Card>
            ))}
          </section>

          <section style={styles.section}>
            <Card style={styles.listCard}>
              <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Rabbit profiles</Text>
                <Button appearance="subtle">View all</Button>
              </div>
              {rabbits.map((rabbit) => {
                const log = lastCareByRabbit.get(rabbit.id);
                const weight = lastWeightByRabbit.get(rabbit.id);
                return <div key={rabbit.id} style={styles.row}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar size={36} name={rabbit.name} color="colorful" />
                    <div>
                      <Text weight="semibold">{rabbit.name}</Text>
                      <div style={{ color: '#6F645C', fontSize: '12px' }}>{log ? `Care log: ${formatDate(log.date)}` : 'No care logs'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text weight="semibold">{weight ? `${weight.value} ${weight.unit}` : 'No weight'}</Text>
                    <div style={{ color: '#7B8F73', fontSize: '12px' }}>{rabbit.notes || 'No notes'}</div>
                  </div>
                </div>;
              })}
              {!loading && rabbits.length === 0 && <Text>No rabbit profiles recorded.</Text>}
            </Card>

            <Card style={styles.listCard}>
              <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Care reminders</Text>
                <Star24Regular />
              </div>
              {reminders.map((record) => (
                <div key={record.id} style={styles.row}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckmarkCircle24Regular color="#7B8F73" />
                    <div>
                      <Text weight="semibold">{record.summary}</Text>
                      <div style={{ color: '#6F645C', fontSize: '12px' }}>{reminderTiming(record.reminderDate)}</div>
                    </div>
                  </div>
                  <Clock24Regular />
                </div>
              ))}
              {!loading && reminders.length === 0 && <Text>No reminders recorded.</Text>}
            </Card>
          </section>

          <section style={styles.section}>
            <Card style={styles.listCard}>
              <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Food tracking</Text>
                <Button appearance="subtle">Add meal</Button>
              </div>
              {foodEntries.slice(0, 3).map((meal) => (
                <div key={meal.id} style={styles.row}>
                  <div>
                    <Text weight="semibold">{meal.foodName}</Text>
                    <div style={{ color: '#6F645C', fontSize: '12px' }}>{meal.favorite ? 'Favorite' : formatDate(meal.date)}</div>
                  </div>
                  <div style={{ color: '#7B8F73', fontWeight: 600 }}>{meal.quantity} kg</div>
                </div>
              ))}
              {!loading && foodEntries.length === 0 && <Text>No food entries recorded.</Text>}
            </Card>

            <Card style={styles.listCard}>
              <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Recent care logs</Text>
                <Clock24Regular />
              </div>
              {careLogs.slice(0, 3).map((log) => (
                <div key={log.id} style={styles.row}>
                  <div>
                    <Text weight="semibold">{rabbits.find((rabbit) => rabbit.id === log.rabbitId)?.name ?? 'Rabbit'} · {formatDate(log.date)}</Text>
                    <div style={{ color: '#6F645C', fontSize: '12px' }}>{log.checkIns.join(', ') || log.notes || 'No check-in details'}</div>
                  </div>
                </div>
              ))}
              {!loading && careLogs.length === 0 && <Text>No care logs recorded.</Text>}
            </Card>
          </section>

          <Card style={{ ...styles.listCard, marginBottom: '24px' }}>
            <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
              <Text weight="semibold">Memories</Text>
              <Button appearance="subtle">View gallery</Button>
            </div>
            <div style={styles.gallery}>
              {memories.map((entry) => (
                <div key={entry.id} style={styles.photoCard}>
                  <img style={styles.photo} src={memoryContentUrl(entry.id)} alt={entry.caption} />
                  <div style={{ padding: '12px' }}>
                    <Text weight="semibold">{entry.caption}</Text>
                    <div style={{ color: '#6F645C', fontSize: '12px' }}>{formatDate(entry.capturedAt.slice(0, 10))}</div>
                  </div>
                </div>
              ))}
              {!loading && memories.length === 0 && <Text>No memories recorded.</Text>}
            </div>
          </Card>
        </main>
      </div>
    </FluentProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
