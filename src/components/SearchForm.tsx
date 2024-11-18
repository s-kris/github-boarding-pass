import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import BoardingPass from './BoardingPass';
import type { GithubStats } from '../types';

export default function SearchForm() {
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
      const response = await fetch(`/api/github?username=${encodeURIComponent(username.trim())}`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const data = await response.json();
      // Convert joinDate string to Date object
      data.joinDate = new Date(data.joinDate);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., octocat or https://github.com/octocat"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-white"
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
    </>
  );
}