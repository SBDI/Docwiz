-- Enable RLS
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;

-- Create policies
CREATE POLICY "Enable insert for authenticated users only"
ON questions FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "Enable read access for all users"
ON questions FOR SELECT
TO authenticated
USING (true);  -- Allow any authenticated user to read
