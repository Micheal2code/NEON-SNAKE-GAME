/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 animate-gradient-x drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] uppercase tracking-tighter" style={{ backgroundSize: '200% auto' }}>
            Neon Snake
          </h1>
          <p className="text-cyan-400/80 tracking-[0.3em] uppercase text-sm mt-2 font-mono">
            Synthwave Edition
          </p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center max-w-6xl mx-auto w-full">
          <div className="w-full lg:w-2/3 flex justify-center">
            <SnakeGame />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <MusicPlayer />
            
            {/* Instructions / Decorative Panel */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 p-6 rounded-2xl text-sm font-mono text-gray-400">
              <h3 className="text-cyan-400 font-bold mb-3 uppercase tracking-wider border-b border-gray-800 pb-2">System Status</h3>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Audio Subsystem:</span> <span className="text-fuchsia-400">ONLINE</span></li>
                <li className="flex justify-between"><span>Game Engine:</span> <span className="text-cyan-400">READY</span></li>
                <li className="flex justify-between"><span>Neon Grid:</span> <span className="text-cyan-400">ACTIVE</span></li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

