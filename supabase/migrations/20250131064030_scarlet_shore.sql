/*
  # Add major categories

  1. New Tables
    - `major_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Changes
    - Add `major_category_id` to `staff` table
    - Add `major_category_id` to `categories` table

  3. Security
    - Enable RLS on `major_categories` table
    - Add policies for authenticated users
*/

-- Create major_categories table
CREATE TABLE IF NOT EXISTS major_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_major_categories_user_id ON major_categories(user_id);

-- Add major_category_id to staff and categories tables
ALTER TABLE staff ADD COLUMN IF NOT EXISTS major_category_id uuid REFERENCES major_categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS major_category_id uuid REFERENCES major_categories(id);

-- Enable RLS
ALTER TABLE major_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own major categories" ON major_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all major categories" ON major_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default major categories
INSERT INTO major_categories (name) VALUES
  ('VTuber事業'),
  ('クリエイティブ事業')
ON CONFLICT DO NOTHING;