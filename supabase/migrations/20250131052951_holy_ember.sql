/*
  # Add estimated hours to projects table

  1. Changes
    - Add `estimated_hours` column to `projects` table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'estimated_hours'
  ) THEN
    ALTER TABLE projects ADD COLUMN estimated_hours integer NOT NULL DEFAULT 0;
  END IF;
END $$;