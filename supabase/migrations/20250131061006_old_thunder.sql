/*
  # Fix RLS policies with proper authentication checks

  1. Changes
    - Drop all existing RLS policies
    - Add new RLS policies with proper authentication checks
    - Use auth.uid() for user identification
    - Enable RLS on all tables
    - Add policies for authenticated users only

  2. Security
    - Restrict all operations to authenticated users only
    - Use auth.uid() for user identification
    - Remove public access completely
    - Ensure proper authentication checks
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON staff;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON projects;
DROP POLICY IF EXISTS "Enable all operations for authenticated users only" ON tasks;

-- Staff table policies
CREATE POLICY "Enable all operations for authenticated users only" ON staff
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Categories table policies
CREATE POLICY "Enable all operations for authenticated users only" ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Projects table policies
CREATE POLICY "Enable all operations for authenticated users only" ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tasks table policies
CREATE POLICY "Enable all operations for authenticated users only" ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled for all tables
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;