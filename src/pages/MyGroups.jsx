import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MyGroups() {
  const { user } = useAuth()
  const [createdGroups, setCreatedGroups] = useState([])
  const [joinedGroups, setJoinedGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyGroups()
  }, [user])

  const fetchMyGroups = async () => {
    try {
      setLoading(true)

      // Fetch groups created by user
      const { data: created, error: createdError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (createdError) throw createdError

      // Fetch groups user has joined
      const { data: memberships, error: memberError } = await supabase
        .from('memberships')
        .select('group_id')
        .eq('user_id', user.id)

      if (memberError) throw memberError

      const groupIds = memberships.map((m) => m.group_id)

      let joined = []
      if (groupIds.length > 0) {
        const { data: joinedData, error: joinedError } = await supabase
          .from('study_groups')
          .select('*')
          .in('id', groupIds)
          .order('created_at', { ascending: false })

        if (joinedError) throw joinedError
        joined = joinedData
      }

      // Fetch member counts
      const createdWithMembers = await Promise.all(
        created.map(async (group) => {
          const { count } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
          return { ...group, memberCount: count || 0 }
        })
      )

      const joinedWithMembers = await Promise.all(
        joined.map(async (group) => {
          const { count } = await supabase
            .from('memberships')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
          return { ...group, memberCount: count || 0 }
        })
      )

      setCreatedGroups(createdWithMembers)
      setJoinedGroups(joinedWithMembers)
    } catch (error) {
      console.error('Error fetching my groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const GroupCard = ({ group }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{group.title}</h3>
      <p className="text-primary font-semibold text-sm mb-3">{group.course}</p>

      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p>
          <span className="font-semibold">When:</span>{' '}
          {new Date(group.date_time).toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">Members:</span> {group.memberCount}
        </p>
      </div>

      <Link
        to={`/group/${group.id}`}
        className="block text-center bg-accent text-white py-2 rounded-lg hover:bg-opacity-90 transition text-sm"
      >
        View Details
      </Link>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">My Study Groups</h1>

        {/* Groups I Created */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Groups I Created</h2>
          {createdGroups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600 mb-4">You haven't created any groups yet</p>
              <Link
                to="/create"
                className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Create Your First Group
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>

        {/* Groups I Joined */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Groups I Joined</h2>
          {joinedGroups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-600 mb-4">
                You haven't joined any groups yet
              </p>
              <Link
                to="/home"
                className="inline-block bg-accent text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                Browse Groups
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
