import React, { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import BoardingPass from './components/BoardingPass';
import { fetchGithubStats } from './services/github';
import type { GithubStats } from './types';

function App() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const data = await fetchGithubStats(username.trim());
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Github className="w-8 h-8" />
            <h1 className="text-3xl font-bold">GitHub Boarding Pass</h1>
          </div>
          <p className="text-gray-400">Enter a GitHub username or profile URL to generate their boarding pass</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., octocat or https://github.com/octocat"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={loading || !username.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Generate Pass'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-red-400 text-sm">{error}</p>
          )}
        </form>

        {stats && <BoardingPass stats={stats} />}

        {!stats && !loading && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg mb-4">Enter a GitHub username to view their developer boarding pass</p>
            <p className="text-sm">Includes repository stats, commit history, and more!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;