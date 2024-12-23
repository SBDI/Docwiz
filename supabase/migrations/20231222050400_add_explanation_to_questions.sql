-- Add explanation column to questions table
ALTER TABLE public.questions ADD COLUMN explanation TEXT;

-- Update the column to be NOT NULL for new entries
ALTER TABLE public.questions ALTER COLUMN explanation SET NOT NULL;
