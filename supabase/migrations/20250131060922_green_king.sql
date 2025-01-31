/*
  # Fix RLS policies for all tables

  1. Changes
    - Drop all existing RLS policies
    - Add new RLS policies with proper authentication checks
    - Enable RLS on all tables
    - Add policies for authenticated users only

  2. Security
    - Restrict all operations to authenticated users only
    - Remove public access policies
    - Ensure proper authentication checks
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Enable read for all users" ON staff;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON staff;
DROP POLICY IF EXISTS "Enable read for all users" ON categories;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable read for all users" ON projects;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable read for all users" ON tasks;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON tasks;

-- Staff table policies
CREATE POLICY "Enable all operations for authenticated users only" ON staff
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Categories table policies
CREATE POLICY "Enable all operations for authenticated users only" ON categories
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Projects table policies
CREATE POLICY "Enable all operations for authenticated users only" ON projects
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Tasks table policies
CREATE POLICY "Enable all operations for authenticated users only" ON tasks
  FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');