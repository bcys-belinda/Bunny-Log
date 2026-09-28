import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider, webLightTheme, makeStyles, Text, Button, Card, Title3, Subtitle2, Avatar, Divider, Badge } from '@fluentui/react-components';
import { Home24Regular, CalendarToday24Regular, Food24Regular, DataTrending24Regular, HeartPulse24Regular, Image24Regular, Settings24Regular, ArrowRight24Regular, Star24Regular, Clock24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: '#FBF8F1',
    color: '#2F2A27',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  sidebar: {
    width: 260,
    background: '#F2EDE4',
    borderRight: '1px solid #E7DFD4',
    padding: '24px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontWeight: 700,
    fontSize: 24,
    color: '#2F2A27',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 12,
    background: 'transparent',
    color: '#2F2A27',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid transparent',
    selectors: {
      '&:hover': { background: '#E9E1D3' },
    },
  },
  activeNav: {
    background: '#7B8F73',
    color: '#fff',
    borderColor: '#7B8F73',
  },
  main: {
    flex: 1,
    padding: '28px 30px 40px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  hero: {
    background: 'linear-gradient(135deg, #E6EFE2 0%, #FBF8F1 100%)',
    border: '1px solid #E7DFD4',
    borderRadius: 22,
    padding: '28px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    padding: '18px 20px',
    borderRadius: 16,
    background: '#fff',
    border: '1px solid #E7DFD4',
    boxShadow: '0 2px 6px rgba(47,42,39,0.04)',
  },
  section: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: 18,
    marginBottom: 24,
  },
  listCard: {
    padding: 18,
    borderRadius: 16,
    background: '#fff',
    border: '1px solid #E7DFD4',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid #F0E7DA',
  },
  tinyLabel: {
    color: '#6F645C',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 16,
  },
  photoCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 18,
    border: '1px solid #E7DFD4',
    background: '#fff',
  },
  photo: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    display: 'block',
    background: 'linear-gradient(135deg, #DDD2C6, #C9D7C6)',
  },
});

const rabbits = [
  { name: 'Clover', lastCheckIn: 'Today, 8:15 AM', weight: '1.8 kg', status: 'Healthy' },
  { name: 'Maple', lastCheckIn: 'Today, 7:40 AM', weight: '1.6 kg', status: 'Needs hydration check' },
  { name: 'Pippin', lastCheckIn: 'Yesterday', weight: '2.1 kg', status: 'Stable' },
];

const mealRows = [
  { name: 'Fresh greens', note: 'Favorite: Yes', amount: '5.6 kg weekly total' },
  { name: 'Hay mix', note: 'Morning snack', amount: '2.1 kg' },
  { name: 'Pellets', note: 'Evening feed', amount: '1.8 kg' },
];

const memories = [
  { title: 'Napping in the warm sun', date: '2026-09-12', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80' },
  { title: 'Snack time with fresh greens', date: '2026-09-15', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80' },
  { title: 'A calm evening cuddle', date: '2026-09-18', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80' },
];

function App() {
  const styles = useStyles();

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.app}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#7B8F73', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 22 }}>🐇</div>
            Bunny Log
          </div>

          <nav className={styles.nav}>
            {[
              ['Home', <Home24Regular />],
              ['Daily Log', <CalendarToday24Regular />],
              ['Food', <Food24Regular />],
              ['Weight', <DataTrending24Regular />],
              ['Health', <HeartPulse24Regular />],
              ['Memories', <Image24Regular />],
              ['Settings', <Settings24Regular />],
            ].map(([label, icon], index) => (
              <div key={label} className={`${styles.navItem} ${index === 0 ? styles.activeNav : ''}`}>
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </nav>

          <Card style={{ padding: 18, borderRadius: 18, background: '#fff' }}>
            <div className={styles.tinyLabel}>Today</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <Avatar size={48} name="Clover" color="colorful" />
              <div>
                <Text weight="semibold">Clover</Text>
                <div style={{ color: '#6F645C', fontSize: 12 }}>Healthy & active</div>
              </div>
            </div>
          </Card>
        </aside>

        <main className={styles.main}>
          <div className={styles.topBar}>
            <div>
              <div className={styles.tinyLabel}>Good morning</div>
              <Title3 as="h1" style={{ margin: 0 }}>Bunny care dashboard</Title3>
            </div>
            <Button appearance="primary" icon={<ArrowRight24Regular />}>
              Log today
            </Button>
          </div>

          <section className={styles.hero}>
            <div className={styles.heroText}>
              <Subtitle2 style={{ color: '#7B8F73' }}>Rabbit profile</Subtitle2>
              <Text style={{ fontSize: 32, fontWeight: 700 }}>Clover is thriving</Text>
              <Text style={{ color: '#6F645C' }}>Last check-in: Today, 8:15 AM · Weight: 1.8 kg · Status: Healthy</Text>
            </div>
            <Badge appearance="tint" color="success" style={{ padding: '10px 16px', fontSize: 16 }}>
              Healthy
            </Badge>
          </section>

          <section className={styles.summaryGrid}>
            {[
              ['Daily check-ins', '6/8 complete', 'Healthy'],
              ['Food log', '5.6 kg', 'Fresh greens'],
              ['Weight trend', '+0.2 kg', 'This week'],
              ['Reminder', '3 due', 'Hydration'],
            ].map(([label, value, footer]) => (
              <Card key={label} className={styles.statCard}>
                <div className={styles.tinyLabel}>{label}</div>
                <Title3 as="h3" style={{ marginTop: 10, marginBottom: 6 }}>{value}</Title3>
                <Text style={{ color: '#6F645C' }}>{footer}</Text>
              </Card>
            ))}
          </section>

          <section className={styles.section}>
            <Card className={styles.listCard}>
              <div className={styles.row} style={{ borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Rabbit profiles</Text>
                <Button appearance="subtle">View all</Button>
              </div>
              {rabbits.map((rabbit) => (
                <div key={rabbit.name} className={styles.row}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar size={36} name={rabbit.name} color="colorful" />
                    <div>
                      <Text weight="semibold">{rabbit.name}</Text>
                      <div style={{ color: '#6F645C', fontSize: 12 }}>{rabbit.lastCheckIn}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text weight="semibold">{rabbit.weight}</Text>
                    <div style={{ color: '#7B8F73', fontSize: 12 }}>{rabbit.status}</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card className={styles.listCard}>
              <div className={styles.row} style={{ borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Care reminders</Text>
                <Star24Regular />
              </div>
              {[
                ['Trim nails on Friday', 'Due in 2 days'],
                ['Hydration check', 'Today'],
                ['Vet follow-up', 'Next Tuesday'],
              ].map(([label, info]) => (
                <div key={label} className={styles.row}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckmarkCircle24Regular color="#7B8F73" />
                    <div>
                      <Text weight="semibold">{label}</Text>
                      <div style={{ color: '#6F645C', fontSize: 12 }}>{info}</div>
                    </div>
                  </div>
                  <Clock24Regular />
                </div>
              ))}
            </Card>
          </section>

          <section className={styles.section}>
            <Card className={styles.listCard}>
              <div className={styles.row} style={{ borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Food tracking</Text>
                <Button appearance="subtle">Add meal</Button>
              </div>
              {mealRows.map((meal) => (
                <div key={meal.name} className={styles.row}>
                  <div>
                    <Text weight="semibold">{meal.name}</Text>
                    <div style={{ color: '#6F645C', fontSize: 12 }}>{meal.note}</div>
                  </div>
                  <div style={{ color: '#7B8F73', fontWeight: 600 }}>{meal.amount}</div>
                </div>
              ))}
            </Card>

            <Card className={styles.listCard}>
              <div className={styles.row} style={{ borderTop: 'none', paddingTop: 0 }}>
                <Text weight="semibold">Quick log</Text>
                <Button appearance="subtle">Open</Button>
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                {['Weight update', 'Meal entry', 'Health note', 'Memories photo'].map((item) => (
                  <Button key={item} appearance="secondary" style={{ justifyContent: 'space-between' }}>
                    {item}
                    <ArrowRight24Regular />
                  </Button>
                ))}
              </div>
            </Card>
          </section>

          <Card className={styles.listCard} style={{ marginBottom: 24 }}>
            <div className={styles.row} style={{ borderTop: 'none', paddingTop: 0 }}>
              <Text weight="semibold">Memories</Text>
              <Button appearance="subtle">View gallery</Button>
            </div>
            <div className={styles.gallery}>
              {memories.map((entry) => (
                <div key={entry.title} className={styles.photoCard}>
                  <img className={styles.photo} src={entry.image} alt={entry.title} />
                  <div style={{ padding: 12 }}>
                    <Text weight="semibold">{entry.title}</Text>
                    <div style={{ color: '#6F645C', fontSize: 12 }}>{entry.date}</div>
                  </div>
                </div>
              ))}
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
