-- Enable RLS for both tables
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON quizzes;
DROP POLICY IF EXISTS "Enable read access for all users" ON quizzes;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON quizzes;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON quizzes;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON questions;
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON questions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON questions;

-- Quizzes policies
CREATE POLICY "Enable insert for authenticated users only"
ON quizzes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for all users"
ON quizzes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for authenticated users"
ON quizzes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users"
ON quizzes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Enable insert for authenticated users only"
ON questions FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM quizzes
  WHERE id = quiz_id AND user_id = auth.uid()
));

CREATE POLICY "Enable read access for all users"
ON questions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for authenticated users"
ON questions FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM quizzes
  WHERE id = quiz_id AND user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM quizzes
  WHERE id = quiz_id AND user_id = auth.uid()
));

CREATE POLICY "Enable delete for authenticated users"
ON questions FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM quizzes
  WHERE id = quiz_id AND user_id = auth.uid()
));
