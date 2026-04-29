import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api, tokenStore } from '../lib/api';
import type { EventItem, StatsResponse } from '../types/api';

const AMBER_SHADES = ['#f5a623', '#d38d10', '#b6760e', '#8f5d0f', '#6d4812'];

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stats, setStats] = useState<StatsResponse>({});
  const [loading, setLoading] = useState(true);

  const [eventType, setEventType] = useState('push');
  const [repository, setRepository] = useState('');
  const [payload, setPayload] = useState('{}');

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsData, statsData] = await Promise.all([api.getEvents(), api.getStats()]);
      setEvents(eventsData);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData().catch(() => {
      tokenStore.clear();
      onLogout();
    });
  }, []);

  const barData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((event) => {
      const key = new Date(event.created_at).toLocaleDateString();
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map.entries()].map(([date, count]) => ({ date, count }));
  }, [events]);

  const donutData = Object.entries(stats).map(([name, value]) => ({ name, value }));

  const submitEvent = async () => {
    await api.createEvent({ event_type: eventType, repository, payload });
    setRepository('');
    setPayload('{}');
    await loadData();
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 animate-fadeSlideIn">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl">Activity Dashboard</h2>
          <p className="mt-1 text-sm text-soft/65">Track pushes, PRs, and coding momentum.</p>
        </div>
        <button
          className="rounded-lg border border-amber/40 px-4 py-2 text-sm text-amber hover:bg-amber hover:text-obsidian"
          onClick={() => {
            tokenStore.clear();
            onLogout();
          }}
        >
          Logout
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-slate p-6">
          <h3 className="mb-4 font-display text-lg">Events over time</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="date" stroke="#f0f0f0" tick={{ fill: '#f0f0f0', fontSize: 12 }} />
                <YAxis stroke="#f0f0f0" tick={{ fill: '#f0f0f0', fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #f5a62333' }} />
                <Bar dataKey="count" fill="#f5a623" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl bg-slate p-6">
          <h3 className="mb-4 font-display text-lg">Event type split</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95}>
                  {donutData.map((entry, index) => (
                    <Cell key={entry.name} fill={AMBER_SHADES[index % AMBER_SHADES.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #f5a62333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl bg-slate p-6">
          <h3 className="mb-4 font-display text-lg">Recent events</h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-soft/70">Loading...</p>
            ) : (
              events.slice(0, 12).map((event) => (
                <article key={event.id} className="rounded-lg border border-soft/10 bg-obsidian px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber">{event.event_type}</span>
                    <span className="text-xs text-soft/60">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-sm text-soft/80">{event.repository}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate p-6">
          <h3 className="mb-4 font-display text-lg">Log new event</h3>
          <div className="space-y-3">
            <input className="w-full rounded-lg bg-obsidian px-3 py-2 text-sm" value={eventType} onChange={(e) => setEventType(e.target.value)} placeholder="event_type" />
            <input className="w-full rounded-lg bg-obsidian px-3 py-2 text-sm" value={repository} onChange={(e) => setRepository(e.target.value)} placeholder="repository" />
            <textarea className="h-24 w-full rounded-lg bg-obsidian px-3 py-2 text-sm" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="payload" />
            <button className="w-full rounded-lg bg-amber px-3 py-2 text-sm font-semibold text-obsidian" onClick={submitEvent}>Submit event</button>
          </div>
        </div>
      </section>
    </main>
  );
}
