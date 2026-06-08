import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar'
import NotificationBell from './NotificationBell'

export function Navbar() {
  const { user, darkMode, toggleDarkMode } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ddRef = useRef()

  useEffect(() => {
    const onClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDropdownOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
    setIsMenuOpen(false)
    setDropdownOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 navbar bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-slate-800 dark:to-slate-900 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white" onClick={closeMenu}>
          StudyConnect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {user ? (
            <>
              <Link to="/home" className="hover:text-emerald-300 dark:hover:text-emerald-400 transition">
                Home
              </Link>
              <Link to="/create" className="hover:text-emerald-300 dark:hover:text-emerald-400 transition">
                Create Group
              </Link>
              <Link to="/my-groups" className="hover:text-emerald-300 dark:hover:text-emerald-400 transition">
                My Groups
              </Link>

              <NotificationBell />

              <button onClick={toggleDarkMode} className="p-2">
                {darkMode ? (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 5.22a1 1 0 011.415 0l.707.707a1 1 0 11-1.414 1.414l-.708-.707a1 1 0 010-1.414zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm8 6a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM15.778 5.22a1 1 0 010 1.414l-.708.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.415 0zM17 9a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293a8 8 0 11-10.586-10.586 7 7 0 0010.586 10.586z" />
                  </svg>
                )}
              </button>

              <div className="relative" ref={ddRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                  <Avatar name={user?.user_metadata?.full_name || user?.email} size="sm" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 z-50">
                    <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 rounded">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-emerald-300 dark:hover:text-emerald-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-emerald-300 dark:hover:text-emerald-400 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white border-opacity-20 pt-4">
          {user ? (
            <>
              <div className="px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.user_metadata?.full_name || user?.email} size="md" />
                    <div>
                      <div className="font-semibold text-white">{user?.user_metadata?.full_name || user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <button onClick={toggleDarkMode} className="p-2">
                      {darkMode ? '🌞' : '🌙'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Link to="/home" onClick={closeMenu} className="block py-2">Home</Link>
                  <Link to="/create" onClick={closeMenu} className="block py-2">Create Group</Link>
                  <Link to="/my-groups" onClick={closeMenu} className="block py-2">My Groups</Link>
                  <Link to="/profile" onClick={closeMenu} className="block py-2">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 font-semibold">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="block hover:text-emerald-100 transition py-2">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="block hover:text-emerald-100 transition py-2">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
