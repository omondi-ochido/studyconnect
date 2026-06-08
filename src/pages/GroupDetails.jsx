import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import Avatar from '../components/Avatar'

export default function GroupDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  useEffect(() => {
    fetchGroupDetails()
  }, [id, user])

  const fetchGroupDetails = async () => {
    try {
      setLoading(true)

      // Fetch group
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', id)
        .single()

      if (groupError) throw groupError

      // Fetch members count
      const { data: membershipData, error: memberError } = await supabase
        .from('memberships')
        .select('user_id, profiles(full_name, email)')
        .eq('group_id', id)

      if (memberError) throw memberError

      // Check if current user is a member
      const userMembership = membershipData.some((m) => m.user_id === user?.id)
      setIsMember(userMembership)

      setGroup({
        ...groupData,
        memberCount: membershipData.length,
      })
      setMembers(membershipData)
    } catch (error) {
      console.error('Error fetching group details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    try {
      setIsJoining(true)
      const { error } = await supabase.from('memberships').insert([
        {
          group_id: id,
          user_id: user.id,
        },
      ])

      if (error) throw error

      // insert notification for creator
      await supabase.from('notifications').insert([
        {
          user_id: group.creator_id,
          message: `${user?.user_metadata?.full_name || user.email} joined your group ${group.title}`,
          group_id: group.id,
        },
      ])

      setIsMember(true)
      fetchGroupDetails()
    } catch (error) {
      console.error('Error joining group:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeave = async () => {
    try {
      setIsJoining(true)
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('group_id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // insert notification for creator
      await supabase.from('notifications').insert([
        {
          user_id: group.creator_id,
          message: `${user?.user_metadata?.full_name || user.email} left your group ${group.title}`,
          group_id: group.id,
        },
      ])

      setIsMember(false)
      fetchGroupDetails()
    } catch (error) {
      console.error('Error leaving group:', error)
    } finally {
      setIsJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Group not found</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Back to Groups
          </button>
        </div>
      </div>
    )
  }

  const isFull = group.memberCount >= group.max_members

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/home')}
          className="mb-6 text-primary hover:underline"
        >
          ← Back to Groups
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">{group.title}</h1>
              <p className="text-xl text-primary font-semibold">{group.course}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
              <p className="text-3xl font-bold text-primary">
                {group.memberCount}/{group.max_members}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Topic</p>
              <p className="text-lg text-slate-800 dark:text-slate-100">{group.topic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Location</p>
              <p className="text-lg text-slate-800 dark:text-slate-100">{group.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Date & Time</p>
              <p className="text-lg text-slate-800 dark:text-slate-100">
                {new Date(group.date_time).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Created by</p>
              <p className="text-lg text-slate-800 dark:text-slate-100">
                {group.creator_id === user?.id ? 'You' : 'Another user'}
              </p>
            </div>
          </div>

          {!isMember && !isFull && (
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {isJoining ? 'Joining...' : 'Join Group'}
            </button>
          )}

          {!isMember && isFull && (
            <div className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg text-center font-semibold">
              Group is Full
            </div>
          )}

          {isMember && (
            <button
              onClick={handleLeave}
              disabled={isJoining}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {isJoining ? 'Leaving...' : 'Leave Group'}
            </button>
          )}
        </div>

        {members.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Members</h2>
            <div className="space-y-2">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center py-2 px-4 bg-gray-50 dark:bg-slate-700 rounded"
                >
                  <div className="w-10 h-10 rounded-full mr-4">
                    <Avatar name={member.profiles?.full_name} />
                  </div>
                  <p className="text-slate-800 dark:text-slate-100">
                    {member.profiles?.full_name || 'Unknown User'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
