-- Create rate limiting table
CREATE TABLE public.rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    action TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, action)
);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_action TEXT,
    p_max_requests INTEGER,
    p_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Clean up old records
    DELETE FROM rate_limits 
    WHERE window_start < NOW() - (p_window_minutes || ' minutes')::INTERVAL;

    -- Get or create rate limit record
    INSERT INTO rate_limits (user_id, action)
    VALUES (p_user_id, p_action)
    ON CONFLICT (user_id, action) DO UPDATE
    SET count = rate_limits.count + 1
    WHERE rate_limits.window_start > NOW() - (p_window_minutes || ' minutes')::INTERVAL
    RETURNING count INTO v_count;

    RETURN v_count <= p_max_requests;
END;
$$ LANGUAGE plpgsql; 