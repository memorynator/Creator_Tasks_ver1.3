/*
  # Update RLS policies for data persistence

  1. Changes
    - Add user_id column to all tables to track ownership
    - Update RLS policies to enforce user-based access control
    - Add indexes for better query performance

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading shared data
*/

-- Add user_id column to tables
ALTER TABLE staff ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Update default values for user_id
ALTER TABLE staff ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE categories ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE projects ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Remove existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON staff;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON tasks;

-- Staff table policies
CREATE POLICY "Users can manage their own staff" ON staff
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all staff" ON staff
  FOR SELECT
  TO authenticated
  USING (true);

-- Categories table policies
CREATE POLICY "Users can manage their own categories" ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all categories" ON categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Projects table policies
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all projects" ON projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Tasks table policies
CREATE POLICY "Users can manage their own tasks" ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all tasks" ON tasks
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure RLS is enabled for all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;