import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/Avatar'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [createdCount, setCreatedCount] = useState(0)
  const [joinedCount, setJoinedCount] = useState(0)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    if (user) fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error) throw error
      setProfile(data)
      setEditingName(data.full_name)

      const { count: created } = await supabase
        .from('study_groups')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', user.id)

      setCreatedCount(created || 0)

      const { count: joined } = await supabase
        .from('memberships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setJoinedCount(joined || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaveStatus('saving')
    try {
      const { error } = await supabase.from('profiles').update({ full_name: editingName }).eq('id', user.id)
      if (error) throw error
      setSaveStatus('success')
      fetchProfile()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error(err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Avatar name={profile.full_name} size="lg" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{profile.full_name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Member since {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-300">Groups Created</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{createdCount}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded">
            <p className="text-sm text-gray-500 dark:text-gray-300">Groups Joined</p>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{joinedCount}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" />
          </div>

          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save Changes</button>
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-2 text-sky-600 text-sm mt-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          )}
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully!
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Failed to save. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
