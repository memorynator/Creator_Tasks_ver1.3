/*
  # Initial schema for staff task management system

  1. New Tables
    - `staff`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text)
      - `created_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category_id` (uuid, foreign key)
      - `revenue` (integer)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `project_id` (uuid, foreign key)
      - `assignee_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `duration` (integer)
      - `completed` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Staff table
CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users" ON staff
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users" ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  revenue integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users" ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  assignee_id uuid REFERENCES staff(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  duration integer NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for authenticated users" ON tasks
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);