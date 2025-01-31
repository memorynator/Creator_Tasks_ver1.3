/*
  # Update task duration to support decimal numbers

  1. Changes
    - Modify tasks.duration column from integer to numeric(10,2) to support decimal numbers up to 2 decimal places
  
  2. Notes
    - This change preserves existing data while allowing decimal input
    - The numeric(10,2) type allows numbers up to 8 digits before the decimal and 2 after
*/

DO $$ 
BEGIN
  -- Modify duration column to support decimals
  ALTER TABLE tasks 
    ALTER COLUMN duration TYPE numeric(10,2);
END $$;