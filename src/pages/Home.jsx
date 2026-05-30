import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = groups.filter(
      (group) =>
        group.title.toLowerCase().includes(term) ||
        group.course.toLowerCase().includes(term)
    )
    setFilteredGroups(filtered)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Find a Study Group</h1>
          <Link
            to="/create"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Create a Group
          </Link>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by course or title..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No study groups found. {searchTerm === '' && 'Create one to get started!'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.title}</h3>
                <p className="text-primary font-semibold mb-4">{group.course}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
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

                <Link
                  to={`/group/${group.id}`}
                  className="block w-full bg-accent text-white text-center py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  View Group
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
