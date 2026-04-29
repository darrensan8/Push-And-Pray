import { useState } from 'react';
import { AuthCard } from './components/AuthCard';
import { Dashboard } from './components/Dashboard';
import { tokenStore } from './lib/api';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(Boolean(tokenStore.get()));

  return (
    <div className="min-h-screen bg-obsidian text-soft">
      {isAuthed ? (
        <Dashboard onLogout={() => setIsAuthed(false)} />
      ) : (
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <AuthCard onAuthenticated={() => setIsAuthed(true)} />
        </div>
      )}
    </div>
  );
}
