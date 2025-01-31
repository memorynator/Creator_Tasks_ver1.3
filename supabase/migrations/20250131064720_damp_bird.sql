/*
  # Add target month to projects

  1. Changes
    - Add target_month column to projects table
    - Add index for better performance
*/

-- Add target_month column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS target_month text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_target_month ON projects(target_month);