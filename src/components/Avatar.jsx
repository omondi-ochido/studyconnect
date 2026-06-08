import React from 'react'

const COLORS = [
  'bg-sky-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-indigo-500',
]

function initials(name) {
  if (!name) return ''
  const parts = name.split(' ')
  return (parts[0][0] || '') + (parts[1]?.[0] || '')
}

export default function Avatar({ name = '', size = 'md', imageUrl }) {
  const sizeMap = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl',
  }

  const color = COLORS[(name?.charCodeAt(0) || 0) % COLORS.length]

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={name}
      className={`rounded-full object-cover ${sizeMap[size]}`}
    />
  ) : (
    <div className={`rounded-full flex items-center justify-center text-white font-semibold ${sizeMap[size]} ${color}`}>
      {initials(name)}
    </div>
  )
}
