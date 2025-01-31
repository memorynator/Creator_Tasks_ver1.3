/*
  # Staff Management System Update
  
  1. Changes
    - Create new staff_members table
    - Add necessary indexes and foreign keys
    - Set up RLS policies
    - Update tasks table references
  
  2. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create new staff table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'staff_members') THEN
    CREATE TABLE staff_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      role text NOT NULL,
      created_at timestamptz DEFAULT now(),
      user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
    );
  END IF;
END $$;

-- Create index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_staff_members_user_id'
  ) THEN
    CREATE INDEX idx_staff_members_user_id ON staff_members(user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own staff members" ON staff_members;
  DROP POLICY IF EXISTS "Users can view all staff members" ON staff_members;
END $$;

-- Create new policies
CREATE POLICY "Users can manage their own staff members"
  ON staff_members
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all staff members"
  ON staff_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Add new column to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'staff_member_id'
  ) THEN
    ALTER TABLE tasks 
      ADD COLUMN staff_member_id uuid REFERENCES staff_members(id) ON DELETE CASCADE;
  END IF;
END $$;