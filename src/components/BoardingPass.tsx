import React from 'react';
import { Users, Star, GitFork, BookMarked, GitCommit, Code, MapPin, Building2, Github } from 'lucide-react';
import type { GithubStats } from '../types';

interface BoardingPassProps {
  stats: GithubStats;
}

const BoardingPass: React.FC<BoardingPassProps> = ({ stats }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const generateBarcodeId = () => {
    const timestamp = stats.joinDate.getTime().toString(36);
    const userHash = stats.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(36);
    return `GH${userHash}${timestamp}`.toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300 boarding-pass">
      <div className="flex">
        {/* Main Boarding Pass */}
        <div className="flex-[3] bg-white text-gray-900 rounded-l-lg overflow-hidden shadow-2xl">
          {/* Airline Header */}
          <div className="bg-[#0D1E47] text-white px-3 py-2 flex justify-between items-center border-b-4 border-[#C4002B]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Github className="w-5 h-5 text-[#0D1E47]" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider">GITHUB AIRWAYS</h1>
                <p className="text-[10px] tracking-widest opacity-75">DEVELOPER CLASS</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm tracking-wider font-bold">BOARDING PASS</p>
              <p className="text-[10px] tracking-widest opacity-75">{generateBarcodeId()}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4">
            {/* Passenger Info */}
            <div className="flex gap-3 mb-4 border-b border-gray-200 pb-4">
              <img
                src={stats.avatarUrl}
                alt={stats.username}
                className="w-14 h-14 rounded-full border-2 border-[#0D1E47]"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-[#0D1E47]">PASSENGER NAME / NOMBRE DEL PASAJERO</p>
                    <h2 className="text-lg font-bold text-[#0D1E47] mt-0.5">{stats.name}</h2>
                    <p className="text-sm text-[#C4002B] font-medium">@{stats.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#0D1E47]">JOINED / FECHA DE INGRESO</p>
                    <p className="text-sm mt-0.5">{formatDate(stats.joinDate)}</p>
                  </div>
                </div>
                
                <div className="mt-1 flex gap-4">
                  {stats.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C4002B]" />
                      <span className="text-xs font-medium">{stats.location}</span>
                    </div>
                  )}
                  {stats.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#C4002B]" />
                      <span className="text-xs font-medium">{stats.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Flight Info (Stats) */}
            <div className="grid grid-cols-4 gap-3 mb-4 border-b border-gray-200 pb-4">
              <div>
                <p className="text-[10px] font-bold text-[#0D1E47]">REPOSITORIES</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <BookMarked className="w-3.5 h-3.5 text-[#C4002B]" />
                  <span className="text-sm">{stats.publicRepos}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0D1E47]">COMMITS</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#C4002B]" />
                  <span className="text-sm">{stats.totalCommits.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0D1E47]">STARS</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-[#C4002B]" />
                  <span className="text-sm">{stats.stars.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#0D1E47]">SIZE</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Code className="w-3.5 h-3.5 text-[#C4002B]" />
                  <span className="text-sm">{stats.totalSize}MB</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="text-[10px] font-bold text-[#0D1E47] mb-1">TOP LANGUAGES / LENGUAJES PRINCIPALES</p>
              <div className="flex gap-2">
                {stats.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-0.5 bg-[#0D1E47] text-white rounded text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Barcode */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold text-[#0D1E47]">FLIGHT / VUELO</p>
                  <p className="text-sm">GH-{stats.publicRepos}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#0D1E47]">SEAT / ASIENTO</p>
                  <p className="text-sm">DEV-{stats.followers}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#0D1E47]">GROUP / GRUPO</p>
                  <p className="text-sm">1</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#0D1E47]">BOARDING TIME / HORA DE EMBARQUE</p>
                <p className="text-sm">{formatDate(stats.joinDate)}</p>
              </div>
            </div>
            
            {/* Barcode */}
            <div className="flex flex-col items-center">
              <div className="w-full h-10 bg-[linear-gradient(90deg,#000_2px,transparent_2px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[length:6px_100%,3px_100%] border border-gray-200"></div>
              <p className="text-xs mt-0.5">{generateBarcodeId()}</p>
            </div>
          </div>
        </div>

        {/* Detachable Stub */}
        <div className="flex-1 bg-[#0D1E47] text-white rounded-r-lg shadow-2xl relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-gray-300 before:content-[''] before:[border-left:3px_dashed_#e5e7eb] flex flex-col">
          <div className="p-4 flex-1">
            {/* Stub Header */}
            <div className="border-b border-gray-500 pb-3 mb-3">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mb-2">
                <Github className="w-4 h-4 text-[#0D1E47]" />
              </div>
              <p className="text-[10px] text-gray-300">PASSENGER / PASAJERO</p>
              <p className="text-sm font-bold truncate mt-0.5">{stats.name}</p>
              <p className="text-xs text-gray-300 truncate">@{stats.username}</p>
            </div>

            {/* Stub Stats */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#C4002B]" />
                  <span className="text-[10px]">STARS</span>
                </div>
                <span className="text-xs">{stats.stars.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <GitFork className="w-3 h-3 text-[#C4002B]" />
                  <span className="text-[10px]">FORKS</span>
                </div>
                <span className="text-xs">{stats.forks.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#C4002B]" />
                  <span className="text-[10px]">FOLLOWERS</span>
                </div>
                <span className="text-xs">{stats.followers.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <GitCommit className="w-3 h-3 text-[#C4002B]" />
                  <span className="text-[10px]">COMMITS</span>
                </div>
                <span className="text-xs">{stats.totalCommits.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Stub Footer */}
          <div className="p-4 pt-0">
            <div className="border-t border-gray-500 pt-3">
              <p className="text-[10px] text-gray-300">FLIGHT NO. / NO. DE VUELO</p>
              <p className="text-sm">GH-{stats.publicRepos}</p>
              <p className="text-[10px] text-gray-300 mt-2">BOARDING / EMBARQUE</p>
              <p className="text-sm">{formatDate(stats.joinDate)}</p>
            </div>

            <div className="mt-3">
              <a
                href={`https://github.com/${stats.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-1.5 px-4 bg-[#C4002B] text-white rounded hover:bg-red-800 transition-colors text-xs font-medium"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardingPass;