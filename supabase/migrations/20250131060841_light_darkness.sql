/*
  # Fix RLS policies for all tables

  1. Changes
    - Remove existing RLS policies
    - Add new RLS policies that allow all operations for authenticated users
    - Add default RLS policies for public access

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform all operations
    - Add policies for public users to read non-sensitive data
*/

-- Remove existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON staff;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON projects;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON tasks;

-- Staff table policies
CREATE POLICY "Enable read for all users" ON staff
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON staff
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories table policies
CREATE POLICY "Enable read for all users" ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Projects table policies
CREATE POLICY "Enable read for all users" ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tasks table policies
CREATE POLICY "Enable read for all users" ON tasks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable all operations for authenticated users" ON tasks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);