import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import MeasurementCalculator from '../components/MeasurementCalculator.jsx'
import { categories } from '../data/units.js'

function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('temperature')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getCategoryIcon = (iconName) => {
    const icons = {
      thermometer: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      ruler: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      scale: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      beaker: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    }
    return icons[iconName] || icons.thermometer
  }

  return (
    <div className="min-h-screen bg-grid relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-radial pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 glass border-b border-dark-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl glass glow-sm flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">QuantiMeasure</span>
                <p className="text-xs text-gray-500 hidden sm:block">Precision Calculations</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 glass-light rounded-xl px-4 py-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-teal flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 glass-light hover:bg-red-500/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 px-4 py-2.5 rounded-xl transition-all duration-300 border border-transparent"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-gray-400">Select a measurement category to get started with your calculations.</p>
        </div>

        {/* Category Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Measurement Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative group p-5 rounded-2xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'glass glow-md border-primary-500/50'
                    : 'glass-light hover:bg-white/5 border border-transparent hover:border-dark-400'
                }`}
              >
                {/* Active indicator */}
                {activeCategory === category.id && (
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'bg-dark-600/50 text-gray-400 group-hover:bg-dark-500/50 group-hover:text-gray-300'
                }`}>
                  {getCategoryIcon(category.icon)}
                </div>
                <h3 className={`font-semibold transition-colors ${
                  activeCategory === category.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{category.units} units</p>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <MeasurementCalculator category={activeCategory} />

        {/* Quick Tips */}
        <div className="mt-8 glass-light rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-primary-400 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-primary-400">1.</span>
              <span>Select a measurement category from the cards above</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-400">2.</span>
              <span>Choose an operation: Convert, Add, Subtract, Divide, or Compare</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary-400">3.</span>
              <span>Enter your values and click Calculate to see results</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-dark-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            QuantiMeasure - Precision Measurement Calculator
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage
