import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [memberships, setMemberships] = useState([])

  const CATEGORIES = [
    'All',
    'Computer Science',
    'Mathematics',
    'Engineering',
    'Business',
    'Medicine',
    'Law',
    'Education',
    'Arts',
    'Sciences',
  ]

  useEffect(() => {
    fetchGroups()
    if (user) fetchMemberships()
  }, [user])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch membership count for each group
      const groupsWithMembers = await Promise.all(
        data.map(async (group) => {
          const { count } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
          return { ...group, memberCount: count || 0 }
        })
      )

      setGroups(groupsWithMembers)
      setFilteredGroups(groupsWithMembers)
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMemberships = async () => {
    try {
      const { data } = await supabase.from('memberships').select('*').eq('user_id', user.id)
      setMemberships(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    filterGroups(term, selectedCategory)
  }

  const filterGroups = (term, category) => {
    const filtered = groups.filter((group) => {
      const matchesTerm =
        group.title.toLowerCase().includes(term) || group.course.toLowerCase().includes(term)
      const matchesCategory = category === 'All' || group.course === category
      return matchesTerm && matchesCategory
    })
    setFilteredGroups(filtered)
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    filterGroups(searchTerm, cat)
  }

  const joinGroupFromCard = async (group) => {
    try {
      await supabase.from('memberships').insert([{ group_id: group.id, user_id: user.id }])
      // insert notification
      await supabase.from('notifications').insert([
        {
          user_id: group.creator_id,
          message: `${user?.user_metadata?.full_name || user.email} joined your group ${group.title}`,
          group_id: group.id,
        },
      ])
      fetchGroups()
      fetchMemberships()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Find a Study Group</h1>
          <Link
            to="/create"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition w-auto md:w-auto"
          >
            Create a Group
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by course or title..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-6 overflow-x-auto flex gap-2 py-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            No study groups found. {searchTerm === '' && 'Create one to get started!'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const isMember = memberships.some((m) => m.group_id === group.id)
              const isFull = group.memberCount >= group.max_members
              return (
                <div
                  key={group.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-200 dark:border-slate-700"
                >
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{group.title}</h3>
                  <p className="text-sky-700 dark:text-sky-300 font-semibold mb-4">{group.course}</p>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <p>
                      <span className="font-semibold">Topic:</span> {group.topic}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {group.location}
                    </p>
                    <p>
                      <span className="font-semibold">When:</span>{' '}
                      {new Date(group.date_time).toLocaleString()}
                    </p>
                    <p>
                      <span className="font-semibold">Members:</span> {group.memberCount}/
                      {group.max_members}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/group/${group.id}`}
                      className="flex-1 block bg-accent text-white text-center py-2 rounded-lg hover:bg-opacity-90 transition"
                    >
                      View Group
                    </Link>

                    {!isMember && !isFull && (
                      <button
                        onClick={() => joinGroupFromCard(group)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
                      >
                        Join
                      </button>
                    )}

                    {isMember && (
                      <div className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-semibold">Joined</div>
                    )}

                    {isFull && !isMember && (
                      <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Full</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
