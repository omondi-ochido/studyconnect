import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function NotificationBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setNotifications(data)
        setUnreadCount(data.length)
      }
    }

    fetchNotifications()

    const channel = supabase.channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        if (payload.new.user_id === user.id) {
          setNotifications((prev) => [payload.new, ...prev])
          setUnreadCount((c) => c + 1)
        }
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const markAllRead = async () => {
    if (!user) return
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id)
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative p-2">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3 z-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm dark:text-gray-100">Notifications</h4>
            <button onClick={markAllRead} className="text-xs text-primary">Mark all as read</button>
          </div>

          <div className="max-h-64 overflow-auto space-y-2">
            {notifications.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-300">No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
                  <p className="text-sm dark:text-gray-100">{n.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
