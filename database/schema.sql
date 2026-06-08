-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study groups table
CREATE TABLE study_groups (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  course TEXT NOT NULL,
  topic TEXT NOT NULL,
  location TEXT NOT NULL,
  date_time TIMESTAMP NOT NULL,
  max_members INTEGER DEFAULT 10,
  creator_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Memberships table
CREATE TABLE memberships (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Note: RLS is disabled for development
-- Enable and configure RLS policies before production deployment

-- Notifications table
-- Run in Supabase SQL Editor to create notifications table
--
-- CREATE TABLE notifications (
--   id SERIAL PRIMARY KEY,
--   user_id UUID REFERENCES profiles(id),
--   message TEXT NOT NULL,
--   group_id INTEGER REFERENCES study_groups(id),
--   is_read BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMP DEFAULT NOW()
-- );
