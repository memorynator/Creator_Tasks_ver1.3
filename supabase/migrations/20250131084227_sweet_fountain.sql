/*
  # Add business type to projects

  1. Changes
    - Add business_type column to projects table
    - Add check constraint for valid business types
    - Add index for better performance

  2. Notes
    - Business types are limited to 'vtuber' and 'creative'
*/

DO $$
BEGIN
  -- Add business_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE projects ADD COLUMN business_type text DEFAULT 'vtuber';
    ALTER TABLE projects ADD CONSTRAINT projects_business_type_check 
      CHECK (business_type IN ('vtuber', 'creative'));
  END IF;

  -- Add index for better performance
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_business_type'
  ) THEN
    CREATE INDEX idx_projects_business_type ON projects(business_type);
  END IF;
END $$;