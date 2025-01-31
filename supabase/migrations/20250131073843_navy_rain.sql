/*
  # Add Priority and Importance to Projects
  
  1. Changes
    - Add priority column (SS, S, A, B, C)
    - Add importance column (color code)
    - Add check constraint for priority values
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add priority and importance columns to projects table
DO $$
BEGIN
  -- Add priority column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'priority'
  ) THEN
    ALTER TABLE projects ADD COLUMN priority text DEFAULT 'C';
    ALTER TABLE projects ADD CONSTRAINT projects_priority_check 
      CHECK (priority IN ('SS', 'S', 'A', 'B', 'C'));
  END IF;

  -- Add importance column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'importance_color'
  ) THEN
    ALTER TABLE projects ADD COLUMN importance_color text DEFAULT '#FFE5E5';
  END IF;
END $$;