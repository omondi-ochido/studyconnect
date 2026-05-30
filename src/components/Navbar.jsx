import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
    setIsMenuOpen(false)
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-sky-600 to-emerald-600 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white" onClick={closeMenu}>
          StudyConnect
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          {user ? (
            <>
              <Link to="/home" className="hover:text-emerald-100 transition">
                Home
              </Link>
              <Link to="/create" className="hover:text-emerald-100 transition">
                Create Group
              </Link>
              <Link to="/my-groups" className="hover:text-emerald-100 transition">
                My Groups
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-emerald-100 transition font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-emerald-100 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-emerald-100 transition">
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
              <Link
                to="/home"
                onClick={closeMenu}
                className="block hover:text-emerald-100 transition py-2"
              >
                Home
              </Link>
              <Link
                to="/create"
                onClick={closeMenu}
                className="block hover:text-emerald-100 transition py-2"
              >
                Create Group
              </Link>
              <Link
                to="/my-groups"
                onClick={closeMenu}
                className="block hover:text-emerald-100 transition py-2"
              >
                My Groups
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:text-emerald-100 transition py-2 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block hover:text-emerald-100 transition py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block hover:text-emerald-100 transition py-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
