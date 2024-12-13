-- Function to check and deduct credits
CREATE OR REPLACE FUNCTION check_and_deduct_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has enough credits
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = NEW.user_id 
    AND credits >= 1
  ) THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Deduct one credit
  UPDATE profiles 
  SET credits = credits - 1 
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check credits before quiz creation
CREATE TRIGGER check_credits_before_quiz
  BEFORE INSERT ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION check_and_deduct_credits(); 