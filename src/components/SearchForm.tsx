import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Download, Share2, Check } from 'lucide-react';
import BoardingPass from './BoardingPass';
import type { GithubStats } from '../types';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';

export default function SearchForm() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [urlLoading, setUrlLoading] = useState(true);
  const [error, setError] = useState('');
  const boardingPassRef = useRef<HTMLDivElement>(null);
  const [hasSearchParams, setHasSearchParams] = useState(false);

  useEffect(() => {
    // Check URL parameters on mount
    const urlParams = new URLSearchParams(window.location.search);
    const urlStats = urlParams.get('stats');
    setHasSearchParams(urlStats !== null);
    
    if (!urlStats) {
      setUrlLoading(false);
      return;
    }

    try {
      const decodedStats = JSON.parse(atob(urlStats));
      decodedStats.joinDate = new Date(decodedStats.joinDate);
      setStats(decodedStats);
      setUsername(decodedStats.username);
    } catch (err) {
      setError('Invalid share URL');
    }
    // Move setUrlLoading(false) to after stats are set
    setTimeout(() => setUrlLoading(false), 100); // Small delay to ensure boarding pass renders
  }, []);

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
      // Update URL with encoded stats
      const encodedStats = btoa(JSON.stringify(data));
      window.history.pushState({}, '', `?stats=${encodedStats}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub stats');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!boardingPassRef.current || !stats) return;
    
    const canvas = await html2canvas(boardingPassRef.current);
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${stats.username}-github-boarding-pass.png`;
    link.href = url;
    link.click();
  };

  const handleShare = async () => {
    if (!stats) return;
    
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-[#C4002B] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 pt-0.5">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Share URL copied to clipboard!
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-opacity-20 border-white">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toast.remove(t.id);
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (err) {
      toast.error('Failed to copy URL to clipboard');
    }
  };

  return (
    <>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 2000,
        }}
      />
      
      {(urlLoading && hasSearchParams) ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#C4002B]" />
            <p className="text-gray-400">Loading boarding pass...</p>
          </div>
        </div>
      ) : (
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

          {stats && (
            <>
              <div ref={boardingPassRef}>
                <BoardingPass stats={stats} />
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2 text-white"
                >
                  <Download className="w-4 h-4" />
                  Download Pass
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition flex items-center gap-2 text-white"
                >
                  <Share2 className="w-4 h-4" />
                  Share Pass
                </button>
              </div>
            </>
          )}

          {!stats && !loading && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg mb-4">Enter a GitHub username to view their developer boarding pass</p>
              <p className="text-sm">Includes repository stats, commit history, and more!</p>
            </div>
          )}
        </>
      )}
    </>
  );
}