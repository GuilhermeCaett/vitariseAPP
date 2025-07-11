/*
  # Initial VitaRise Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `treatment_start_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `daily_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date, unique per user)
      - `medication_taken` (boolean)
      - `energy_level` (integer, 1-10)
      - `libido_level` (integer, 1-10)
      - `rigidity_level` (integer, 1-10)
      - `self_esteem_level` (integer, 1-10)
      - `performance_rating` (integer, 0-10, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_type` (text)
      - `unlocked_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  treatment_start_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  medication_taken boolean NOT NULL DEFAULT false,
  energy_level integer NOT NULL DEFAULT 5 CHECK (energy_level >= 1 AND energy_level <= 10),
  libido_level integer NOT NULL DEFAULT 5 CHECK (libido_level >= 1 AND libido_level <= 10),
  rigidity_level integer NOT NULL DEFAULT 5 CHECK (rigidity_level >= 1 AND rigidity_level <= 10),
  self_esteem_level integer NOT NULL DEFAULT 5 CHECK (self_esteem_level >= 1 AND self_esteem_level <= 10),
  performance_rating integer CHECK (performance_rating >= 0 AND performance_rating <= 10),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for daily_entries
CREATE POLICY "Users can read own daily entries"
  ON daily_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily entries"
  ON daily_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries"
  ON daily_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily entries"
  ON daily_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for achievements
CREATE POLICY "Users can read own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_type ON achievements(user_id, achievement_type);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_entries_updated_at
  BEFORE UPDATE ON daily_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();