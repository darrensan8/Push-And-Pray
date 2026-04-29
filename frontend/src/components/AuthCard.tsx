import { FormEvent, useState } from 'react';
import { api, tokenStore } from '../lib/api';

type Props = {
  onAuthenticated: () => void;
};

export function AuthCard({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        await api.register({ username, email, password });
      }

      const auth = await api.login({ username, password });
      tokenStore.set(auth.access_token);
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-amber/20 bg-slate p-8 shadow-[0_0_40px_rgba(245,166,35,0.08)] animate-fadeSlideIn">
      <h1 className="font-display text-3xl tracking-tight">PushAndPray</h1>
      <p className="mt-2 text-sm text-soft/70">Developer activity analytics, stripped to essentials.</p>

      <div className="mt-6 flex gap-2 rounded-lg bg-obsidian p-1">
        {(['login', 'register'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`flex-1 rounded-md px-3 py-2 text-sm capitalize transition ${
              mode === item ? 'bg-amber text-obsidian font-medium' : 'text-soft/75 hover:text-soft'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-lg border border-soft/10 bg-obsidian px-4 py-3 text-sm outline-none transition focus:border-amber/80"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {mode === 'register' && (
          <input
            className="w-full rounded-lg border border-soft/10 bg-obsidian px-4 py-3 text-sm outline-none transition focus:border-amber/80"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        <input
          className="w-full rounded-lg border border-soft/10 bg-obsidian px-4 py-3 text-sm outline-none transition focus:border-amber/80"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-xs text-red-300">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-amber px-4 py-3 text-sm font-medium text-obsidian transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
