import React from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect, useState } from 'react';
import { FluentProvider, webLightTheme, Text, Button, Card, Title3, Subtitle2, Avatar, Badge, Field, Input, Textarea } from '@fluentui/react-components';
import { Home24Regular, CalendarToday24Regular, Food24Regular, DataTrending24Regular, HeartPulse24Regular, Image24Regular, Settings24Regular, ArrowRight24Regular, Star24Regular, Clock24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';
import type { CareLog, FoodEntry, HealthRecord, MemoryEntry, Rabbit, WeightMeasurement } from '@bunny-log/shared';
import { api, memoryContentUrl } from './api';
import './nav.css';

const navItems: Array<{ label: string; icon: React.ReactNode }> = [
  { label: 'Home', icon: <Home24Regular /> },
  { label: 'Daily Log', icon: <CalendarToday24Regular /> },
  { label: 'Food', icon: <Food24Regular /> },
  { label: 'Weight', icon: <DataTrending24Regular /> },
  { label: 'Health', icon: <HeartPulse24Regular /> },
  { label: 'Memories', icon: <Image24Regular /> },
  { label: 'Settings', icon: <Settings24Regular /> },
];

const routineItems = [
  '1 pill · Brytin Therabiotic 2x Probiotic',
  '1 tablespoon · Oxy-Gen Immunize for Rabbits & Cavies',
  '1 tablet · Natural Nibbles ProCare+ Digestion',
  '2 tablespoons · Sherwood Pet Health Adult Rabbit Food',
  '1 handful · Medium Timothy Hay (Rabbit Hole Hay)',
  'Clean left pee tray',
  'Clean right pee tray',
  'Wash potty tray',
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
  app: { display: 'flex', minHeight: '100vh', background: '#FFF7FA', color: '#402F36', fontFamily: 'Inter, system-ui, sans-serif' },
  sidebar: { width: '260px', background: '#FFF0F5', borderRight: '1px solid #F3D6E0', padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '18px' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '24px', color: '#402F36' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', background: 'transparent', color: '#402F36', fontWeight: 600, cursor: 'pointer', border: '1px solid transparent', fontFamily: 'inherit', fontSize: '14px', textAlign: 'left' },
  activeNav: { background: '#D98CA8', color: '#fff', borderColor: '#D98CA8' },
  main: { flex: 1, padding: '28px 30px 40px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' },
  hero: { background: 'linear-gradient(135deg, #FBE3EC 0%, #FFF7FA 100%)', border: '1px solid #F3D6E0', borderRadius: '22px', padding: '28px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heroText: { display: 'flex', flexDirection: 'column', gap: '8px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { padding: '18px 20px', borderRadius: '16px', background: '#fff', border: '1px solid #F3D6E0', boxShadow: '0 2px 6px rgba(64,47,54,0.06)' },
  section: { display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px', marginBottom: '24px' },
  listCard: { padding: '18px', borderRadius: '16px', background: '#fff', border: '1px solid #F3D6E0' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F0E7DA' },
  tinyLabel: { color: '#9D6075', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  gallery: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' },
  photoCard: { padding: 0, overflow: 'hidden', borderRadius: '18px', border: '1px solid #F3D6E0', background: '#fff' },
  photo: { width: '100%', height: '150px', objectFit: 'cover', display: 'block', background: 'linear-gradient(135deg, #F7C9D8, #FBE3EC)' },
  formCard: { maxWidth: '720px', padding: '24px', borderRadius: '18px', background: '#fff', border: '1px solid #F3D6E0', boxShadow: '0 4px 12px rgba(64,47,54,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' },
  select: { width: '100%', minHeight: '32px', padding: '0 8px', border: '1px solid #D1C3C8', borderRadius: '4px', background: '#fff', color: '#402F36', font: 'inherit' },
  formHeader: { display: 'flex', flexDirection: 'column', gap: '6px' },
};

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingLog, setSavingLog] = useState(false);
  const [savingRabbit, setSavingRabbit] = useState(false);
  const [editingRabbitId, setEditingRabbitId] = useState<string | null>(null);
  const [savingEntry, setSavingEntry] = useState(false);
  const [rabbitForm, setRabbitForm] = useState({ name: '', breed: '', dob: '', notes: '' });
  const [careForm, setCareForm] = useState({ rabbitId: '', date: today, notes: '' });
  const [routineChecks, setRoutineChecks] = useState<string[]>([]);
  const [foodForm, setFoodForm] = useState({ rabbitId: '', date: today, foodName: '', quantity: '', quantityUnit: 'kg' as FoodEntry['quantityUnit'], favorite: false });
  const [weightForm, setWeightForm] = useState({ rabbitId: '', date: today, value: '' });
  const [healthForm, setHealthForm] = useState({ rabbitId: '', date: today, category: '', summary: '', reminderDate: '' });
  const [memoryForm, setMemoryForm] = useState<{ rabbitId: string; caption: string; photo: File | null }>({ rabbitId: '', caption: '', photo: null });
  const [error, setError] = useState('');
  const [activeNav, setActiveNav] = useState('Home');

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

  async function submitRabbit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingRabbit(true);
    setError('');
    try {
      if (editingRabbitId) {
        await api.updateRabbit(editingRabbitId, rabbitForm);
      } else {
        await api.createRabbit(rabbitForm);
      }
      setRabbitForm({ name: '', breed: '', dob: '', notes: '' });
      setEditingRabbitId(null);
      await loadDashboard();
      setActiveNav('Home');
    } catch {
      setError('The rabbit profile could not be saved. Check the API connection and try again.');
    } finally {
      setSavingRabbit(false);
    }
  }

  function editRabbit(rabbit: Rabbit) {
    setEditingRabbitId(rabbit.id);
    setRabbitForm({ name: rabbit.name, breed: rabbit.breed, dob: rabbit.dob, notes: rabbit.notes });
    setActiveNav('Settings');
  }

  async function editMemory(entry: MemoryEntry) {
    const caption = window.prompt('Update memory caption', entry.caption);
    if (!caption || caption.trim() === entry.caption) return;
    try {
      await api.updateMemory(entry.id, { caption: caption.trim() });
      await loadDashboard();
    } catch { setError('The memory caption could not be updated.'); }
  }

  async function deleteMemory(entry: MemoryEntry) {
    if (!window.confirm(`Delete ${entry.caption}?`)) return;
    try {
      await api.deleteMemory(entry.id);
      await loadDashboard();
    } catch { setError('The memory could not be deleted.'); }
  }

  function selectedRabbitId(value: string): string {
    return value || focusRabbit?.id || '';
  }

  async function submitCareLog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEntry(true);
    try {
      await api.createCareLog({ rabbitId: selectedRabbitId(careForm.rabbitId), date: careForm.date, checkIns: routineChecks, notes: careForm.notes });
      await loadDashboard();
      setActiveNav('Home');
    } catch { setError('The daily log could not be saved. Check the API connection and try again.'); } finally { setSavingEntry(false); }
  }

  async function submitFood(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEntry(true);
    try {
      await api.createFoodEntry({ rabbitId: selectedRabbitId(foodForm.rabbitId), date: foodForm.date, foodName: foodForm.foodName, quantity: Number(foodForm.quantity), quantityUnit: foodForm.quantityUnit, favorite: foodForm.favorite });
      await loadDashboard();
      setActiveNav('Home');
    } catch { setError('The food entry could not be saved. Check the API connection and try again.'); } finally { setSavingEntry(false); }
  }

  async function submitWeight(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEntry(true);
    try {
      await api.createWeightMeasurement({ rabbitId: selectedRabbitId(weightForm.rabbitId), date: weightForm.date, value: Number(weightForm.value), unit: 'kg' });
      await loadDashboard();
      setActiveNav('Home');
    } catch { setError('The weight entry could not be saved. Check the API connection and try again.'); } finally { setSavingEntry(false); }
  }

  async function submitHealth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEntry(true);
    try {
      await api.createHealthRecord({ rabbitId: selectedRabbitId(healthForm.rabbitId), date: healthForm.date, category: healthForm.category, summary: healthForm.summary, reminderDate: healthForm.reminderDate || undefined });
      await loadDashboard();
      setActiveNav('Home');
    } catch { setError('The health record could not be saved. Check the API connection and try again.'); } finally { setSavingEntry(false); }
  }

  async function submitMemory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memoryForm.photo) { setError('Choose an image before saving the memory.'); return; }
    setSavingEntry(true);
    try {
      const formData = new FormData();
      formData.append('rabbitId', selectedRabbitId(memoryForm.rabbitId));
      formData.append('caption', memoryForm.caption);
      formData.append('photo', memoryForm.photo);
      await api.uploadMemory(formData);
      await loadDashboard();
      setActiveNav('Home');
    } catch { setError('The memory could not be saved. Check the API connection and try again.'); } finally { setSavingEntry(false); }
  }

  const rabbitPicker = (value: string, onChange: (value: string) => void) => (
    <Field label="Rabbit" required>
      <select style={styles.select} value={value || focusRabbit?.id || ''} onChange={(event) => onChange(event.target.value)} required>
        <option value="" disabled>Select a rabbit</option>
        {rabbits.map((rabbit) => <option key={rabbit.id} value={rabbit.id}>{rabbit.name}</option>)}
      </select>
    </Field>
  );

  const dateField = (label: string, value: string, onChange: (value: string) => void, required = true) => (
    <Field label={label} required={required}>
      <Input type="date" value={value} onChange={(_, data) => onChange(data.value)} required={required} />
    </Field>
  );

  const entryActions = (label: string) => (
    <div className="form-actions" style={styles.formActions}>
      <Button type="button" appearance="subtle" onClick={() => setActiveNav('Home')}>Cancel</Button>
      <Button type="submit" appearance="primary" disabled={savingEntry || !focusRabbit}>{savingEntry ? 'Saving...' : label}</Button>
    </div>
  );

  return (
    <FluentProvider theme={webLightTheme}>
      <div className="app-shell" style={styles.app}>
        <aside className="sidebar-shell" style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#D98CA8', display: 'grid', placeItems: 'center', color: '#fff', fontSize: '22px' }}>🐇</div>
            Bunny Log
          </div>

          <nav className="nav-shell" style={styles.nav}>
            {navItems.map((item, index) => (
              <button className="nav-button" type="button" key={item.label} style={{ ...styles.navItem, ...(activeNav === item.label ? styles.activeNav : {}) }} onClick={() => setActiveNav(item.label)} aria-current={activeNav === item.label ? 'page' : undefined}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <Card style={{ padding: '18px', borderRadius: '18px', background: '#fff' }}>
            <div style={styles.tinyLabel}>Today</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
              <Avatar size={48} name={focusRabbit?.name ?? ''} color="colorful" />
              <div>
                <Text weight="semibold">{focusRabbit?.name ?? 'No profiles yet'}</Text>
                  <div style={{ color: '#6F645C', fontSize: '12px' }}>{focusRabbit?.breed ?? 'Add a rabbit profile to begin'}</div>
              </div>
            </div>
          </Card>
        </aside>

        <main className="main-shell" style={styles.main}>
          <div className="top-bar" style={styles.topBar}>
            <div>
              <div style={styles.tinyLabel}>Good morning</div>
              <Title3 as="h1" style={{ margin: 0 }}>Bunny care dashboard</Title3>
            </div>
            <Button appearance="primary" icon={<ArrowRight24Regular />} disabled={!focusRabbit || savingLog} onClick={() => void logToday()}>
              {savingLog ? 'Saving...' : 'Log today'}
            </Button>
          </div>

          {error && <Text role="alert" style={{ display: 'block', color: '#B54768', marginBottom: '16px' }}>{error}</Text>}

          {activeNav === 'Daily Log' && (
            <section style={styles.formCard}>
              <div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Daily care</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>Log today’s routine</Title3><Text style={{ color: '#8B6572' }}>Tick off food, supplements, and cage care as you go.</Text></div>
              <form onSubmit={(event) => void submitCareLog(event)}><div style={styles.formGrid}>{rabbitPicker(careForm.rabbitId, (value) => setCareForm((current) => ({ ...current, rabbitId: value })))}{dateField('Date', careForm.date, (value) => setCareForm((current) => ({ ...current, date: value })))} </div><Field label="Routine checklist" required><div style={{ display: 'grid', gap: '10px' }}>{routineItems.map((item) => <label key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}><input type="checkbox" checked={routineChecks.includes(item)} onChange={(event) => setRoutineChecks((current) => event.target.checked ? [...current, item] : current.filter((selected) => selected !== item))} />{item}</label>)}</div></Field><Field label="Notes" style={{ marginTop: '16px' }}><Textarea value={careForm.notes} onChange={(_, data) => setCareForm((current) => ({ ...current, notes: data.value }))} placeholder="Anything unusual or worth remembering" /></Field>{entryActions('Save routine')}</form>
            </section>
          )}

          {activeNav === 'Food' && (
            <section style={styles.formCard}><div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Nutrition</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>Add food entry</Title3><Text style={{ color: '#8B6572' }}>Track portions in the units you actually use.</Text></div><form onSubmit={(event) => void submitFood(event)}><div style={styles.formGrid}>{rabbitPicker(foodForm.rabbitId, (value) => setFoodForm((current) => ({ ...current, rabbitId: value })))}{dateField('Date', foodForm.date, (value) => setFoodForm((current) => ({ ...current, date: value })))}</div><div style={styles.formGrid}><Field label="Food or supplement" required><Input value={foodForm.foodName} onChange={(_, data) => setFoodForm((current) => ({ ...current, foodName: data.value }))} placeholder="Timothy hay or probiotic" required /></Field><Field label="Quantity and unit" required><div style={{ display: 'flex', gap: '8px' }}><Input type="number" min="0" step="0.1" value={foodForm.quantity} onChange={(_, data) => setFoodForm((current) => ({ ...current, quantity: data.value }))} required /><select style={{ ...styles.select, width: '150px' }} value={foodForm.quantityUnit} onChange={(event) => setFoodForm((current) => ({ ...current, quantityUnit: event.target.value as FoodEntry['quantityUnit'] }))}><option value="kg">kg</option><option value="tablespoon">tablespoon</option><option value="pill">pill</option><option value="tablet">tablet</option><option value="handful">handful</option><option value="serving">serving</option></select></div></Field></div><label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}><input type="checkbox" checked={foodForm.favorite} onChange={(event) => setFoodForm((current) => ({ ...current, favorite: event.target.checked }))} /> Favorite food</label>{entryActions('Save food')}</form></section>
          )}

          {activeNav === 'Weight' && (
            <section style={styles.formCard}><div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Wellbeing</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>Add weight entry</Title3><Text style={{ color: '#8B6572' }}>Track changes over time in kilograms.</Text></div><form onSubmit={(event) => void submitWeight(event)}><div style={styles.formGrid}>{rabbitPicker(weightForm.rabbitId, (value) => setWeightForm((current) => ({ ...current, rabbitId: value })))}{dateField('Date', weightForm.date, (value) => setWeightForm((current) => ({ ...current, date: value })))}</div><Field label="Weight (kg)" required><Input type="number" min="0" step="0.01" value={weightForm.value} onChange={(_, data) => setWeightForm((current) => ({ ...current, value: data.value }))} placeholder="1.80" required /></Field>{entryActions('Save weight')}</form></section>
          )}

          {activeNav === 'Health' && (
            <section style={styles.formCard}><div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Health</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>Add health record</Title3><Text style={{ color: '#8B6572' }}>Keep checkups, treatments, and reminders together.</Text></div><form onSubmit={(event) => void submitHealth(event)}><div style={styles.formGrid}>{rabbitPicker(healthForm.rabbitId, (value) => setHealthForm((current) => ({ ...current, rabbitId: value })))}{dateField('Date', healthForm.date, (value) => setHealthForm((current) => ({ ...current, date: value })))}</div><Field label="Category" required><Input value={healthForm.category} onChange={(_, data) => setHealthForm((current) => ({ ...current, category: data.value }))} placeholder="Checkup" required /></Field><Field label="Summary" required style={{ marginTop: '16px' }}><Textarea value={healthForm.summary} onChange={(_, data) => setHealthForm((current) => ({ ...current, summary: data.value }))} placeholder="What happened?" required /></Field><div style={{ marginTop: '16px' }}>{dateField('Reminder date', healthForm.reminderDate, (value) => setHealthForm((current) => ({ ...current, reminderDate: value })), false)}</div>{entryActions('Save health record')}</form></section>
          )}

          {activeNav === 'Memories' && (
            <section style={styles.formCard}><div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Memories</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>Add a memory</Title3><Text style={{ color: '#8B6572' }}>Save a photo and a caption for your rabbit.</Text></div><form onSubmit={(event) => void submitMemory(event)}><div style={styles.formGrid}>{rabbitPicker(memoryForm.rabbitId, (value) => setMemoryForm((current) => ({ ...current, rabbitId: value })))}<Field label="Photo" required><input type="file" accept="image/*" onChange={(event) => setMemoryForm((current) => ({ ...current, photo: event.target.files?.[0] ?? null }))} required /></Field></div><Field label="Caption" required style={{ marginTop: '16px' }}><Input value={memoryForm.caption} onChange={(_, data) => setMemoryForm((current) => ({ ...current, caption: data.value }))} placeholder="Sunny afternoon" required /></Field>{entryActions('Save memory')}</form></section>
          )}

          {activeNav === 'Settings' && (
            <section style={styles.formCard}>
              <div style={styles.formHeader}><Subtitle2 style={{ color: '#B35E7B' }}>Rabbit profile</Subtitle2><Title3 as="h2" style={{ margin: 0 }}>{editingRabbitId ? 'Edit rabbit profile' : 'Add a rabbit'}</Title3><Text style={{ color: '#8B6572' }}>Save the basics once, then use the other sections to track care.</Text></div>
              <form onSubmit={(event) => void submitRabbit(event)}>
                <div className="form-grid" style={styles.formGrid}>
                  <Field label="Name" required>
                    <Input value={rabbitForm.name} onChange={(_, data) => setRabbitForm((current) => ({ ...current, name: data.value }))} placeholder="e.g. Fei Fei" required />
                  </Field>
                  <Field label="Breed" required>
                    <Input value={rabbitForm.breed} onChange={(_, data) => setRabbitForm((current) => ({ ...current, breed: data.value }))} placeholder="e.g. Netherland Dwarf" required />
                  </Field>
                  <Field label="Date of birth" required>
                    <Input type="date" value={rabbitForm.dob} onChange={(_, data) => setRabbitForm((current) => ({ ...current, dob: data.value }))} required />
                  </Field>
                </div>
                <Field label="Notes" style={{ marginTop: '16px' }}>
                  <Textarea value={rabbitForm.notes} onChange={(_, data) => setRabbitForm((current) => ({ ...current, notes: data.value }))} placeholder="Temperament, routines, or anything helpful" resize="vertical" />
                </Field>
                <div className="form-actions" style={styles.formActions}>
                  <Button type="button" appearance="subtle" onClick={() => { setRabbitForm({ name: '', breed: '', dob: '', notes: '' }); setEditingRabbitId(null); }}>Clear</Button>
                  <Button type="submit" appearance="primary" disabled={savingRabbit}>{savingRabbit ? 'Saving...' : editingRabbitId ? 'Update profile' : 'Save profile'}</Button>
                </div>
              </form>
            </section>
          )}

          {activeNav === 'Home' && <>
          {loading && <Text role="status">Loading care data...</Text>}

          <section style={styles.hero}>
            <div style={styles.heroText}>
              <Subtitle2 style={{ color: '#B35E7B' }}>Rabbit profile</Subtitle2>
              <Text style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700 }}>{focusRabbit ? `${focusRabbit.name}'s care overview` : 'No rabbit profiles yet'}</Text>
              <Text style={{ color: '#6F645C' }}>{focusRabbit ? `${focusRabbit.breed} · ${focusRabbit.notes || 'No profile notes'}` : 'Rabbit care records will appear here when available.'}</Text>
              {focusRabbit && <Button appearance="subtle" onClick={() => editRabbit(focusRabbit)}>Edit profile</Button>}
            </div>
            <Badge appearance="tint" color={focusRabbit ? 'success' : 'warning'} style={{ padding: '10px 16px', fontSize: '16px' }}>
              {focusRabbit ? 'Profile active' : 'No profile'}
            </Badge>
          </section>

          <section className="summary-grid" style={styles.summaryGrid}>
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

          <section className="content-section" style={styles.section}>
            <Card style={styles.listCard}>
              <div style={{ ...styles.row, borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Rabbit profiles</Text>
                <Button appearance="subtle" onClick={() => setActiveNav('Settings')}>{rabbits.length ? 'View all' : 'Add profile'}</Button>
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
                    <div style={{ color: '#B35E7B', fontSize: '12px' }}>{rabbit.notes || 'No notes'}</div>
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

          <section className="content-section" style={styles.section}>
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
                    <div style={{ color: '#B35E7B', fontWeight: 600 }}>{meal.quantity} {meal.quantityUnit}</div>
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
            <div className="gallery-grid" style={styles.gallery}>
              {memories.map((entry) => (
                <div key={entry.id} style={styles.photoCard}>
                  <img style={styles.photo} src={memoryContentUrl(entry.id)} alt={entry.caption} onError={(event) => { event.currentTarget.alt = 'Photo unavailable'; event.currentTarget.style.opacity = '0.35'; }} />
                  <div style={{ padding: '12px' }}>
                    <Text weight="semibold">{entry.caption}</Text>
                    <div style={{ color: '#6F645C', fontSize: '12px' }}>{formatDate(entry.capturedAt.slice(0, 10))}</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <Button size="small" appearance="subtle" onClick={() => void editMemory(entry)}>Edit caption</Button>
                      <Button size="small" appearance="subtle" onClick={() => void deleteMemory(entry)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && memories.length === 0 && <Text>No memories recorded.</Text>}
            </div>
          </Card>
          </>}
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
