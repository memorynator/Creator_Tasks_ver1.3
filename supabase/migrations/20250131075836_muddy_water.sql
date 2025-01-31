/*
  # Update Project Priority Colors and Remove Importance
  
  1. Changes
    - Remove importance_color column
    - Keep priority column with updated colors in the UI
*/

DO $$
BEGIN
  -- Remove importance_color column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'importance_color'
  ) THEN
    ALTER TABLE projects DROP COLUMN importance_color;
  END IF;
END $$;