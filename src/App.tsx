import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        {/* Logos */}
        <div className="flex justify-center items-center gap-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
            <img src={viteLogo} className="h-20 w-20 drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
          </a>
          <span className="text-4xl text-slate-500 font-light">+</span>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
            <img src={reactLogo} className="h-20 w-20 animate-[spin_20s_linear_infinite] drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
          </a>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gate-Calc Project
          </h1>
          <p className="text-lg text-slate-400">
            React + Vite + Tailwind CSS is ready to go!
          </p>
        </div>

        {/* Interactive Card */}
        <div className="p-6 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
          <p className="text-slate-300">
            Edit <code className="px-2 py-1 bg-slate-900 rounded font-mono text-sm text-pink-400">src/App.tsx</code> and save to test Hot Module Replacement (HMR).
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Count is: {count}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-500 flex justify-center gap-6">
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
            Tailwind Docs
          </a>
          <span>•</span>
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
            Vite Docs
          </a>
          <span>•</span>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
            React Docs
          </a>
        </div>
      </div>
    </div>
  )
}

export default App
